import {BitStream} from 'bit-buffer';
import {DataTablesMessage, MessageHandler, MessageType} from '../../Data/Message';
import {SendPropDefinition, SendPropFlag, SendPropType} from '../../Data/SendPropDefinition';
import {SendTable} from '../../Data/SendTable';
import {ServerClass} from '../../Data/ServerClass';

export const DataTableHandler: MessageHandler<DataTablesMessage> = {
	parseMessage: (stream: BitStream) => {
		const s = stream.index;

		const tick = stream.readInt32();

		const length = stream.readInt32();
		const messageStream = stream.readBitStream(length * 8);

		// https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_common_eng.cpp#L356
		// https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_recv_eng.cpp#L310
		// https://github.com/PazerOP/DemoLib/blob/master/DemoLib/Commands/DemoDataTablesCommand.cs
		const tables: SendTable[] = [];
		const tableMap: {[key: string]: SendTable} = {};
		while (messageStream.readBoolean()) {
			const needsDecoder = messageStream.readBoolean();
			const tableName = messageStream.readASCIIString();
			const numProps = messageStream.readBits(10);
			const table = new SendTable(tableName);
			table.needsDecoder = needsDecoder;

			// get props metadata
			let arrayElementProp;
			for (let i = 0; i < numProps; i++) {
				const propType = messageStream.readBits(5);
				const propName = messageStream.readASCIIString();
				const nFlagsBits = 16; // might be 11 (old?), 13 (new?), 16(networked) or 17(??)
				const flags = messageStream.readBits(nFlagsBits);
				const prop = new SendPropDefinition(propType, propName, flags, tableName);
				if (propType === SendPropType.DPT_DataTable) {
					prop.excludeDTName = messageStream.readASCIIString();
				} else {
					if (prop.isExcludeProp()) {
						prop.excludeDTName = messageStream.readASCIIString();
					} else if (prop.type === SendPropType.DPT_Array) {
						prop.numElements = messageStream.readBits(10);
					} else {
						prop.lowValue = messageStream.readFloat32();
						prop.highValue = messageStream.readFloat32();
						prop.bitCount = messageStream.readBits(7);
					}
				}

				if (prop.hasFlag(SendPropFlag.SPROP_NOSCALE)) {
					if (prop.type === SendPropType.DPT_Float) {
						prop.bitCount = 32;
					} else if (prop.type === SendPropType.DPT_Vector) {
						if (!prop.hasFlag(SendPropFlag.SPROP_NORMAL)) {
							prop.bitCount = 32 * 3;
						}
					}
				}

				if (arrayElementProp) {
					if (prop.type !== SendPropType.DPT_Array) {
						throw new Error('expected prop of type array');
					}
					prop.arrayProperty = arrayElementProp;
					arrayElementProp = null;
				}

				if (prop.hasFlag(SendPropFlag.SPROP_INSIDEARRAY)) {
					if (arrayElementProp) {
						throw new Error('array element already set');
					}
					if (prop.hasFlag(SendPropFlag.SPROP_CHANGES_OFTEN)) {
						throw new Error('unexpected CHANGES_OFTEN prop in array');
					}
					arrayElementProp = prop;
				} else {
					table.addProp(prop);
				}
			}
			tables.push(table);
			tableMap[table.name] = table;
		}

		// link referenced tables
		for (const table of tables) {
			for (const prop of table.props) {
				if (prop.type === SendPropType.DPT_DataTable) {
					if (prop.excludeDTName) {
						prop.table = tableMap[prop.excludeDTName];
						prop.excludeDTName = null;
					}
				}
			}
		}

		const numServerClasses = messageStream.readUint16(); // short
		const serverClasses: ServerClass[] = [];
		if (numServerClasses <= 0) {
			throw new Error('expected one or more serverclasses');
		}

		for (let i = 0; i < numServerClasses; i++) {
			const classId = messageStream.readUint16();
			if (classId > numServerClasses) {
				throw new Error('invalid class id');
			}
			const className = messageStream.readASCIIString();
			const dataTable = messageStream.readASCIIString();
			serverClasses.push(new ServerClass(classId, className, dataTable));
		}

		if (messageStream.bitsLeft > 7) {
			throw new Error('unexpected remaining data in datatable (' + messageStream.bitsLeft + ' bits)');
		}
		//
		// const e = stream.index;
		// stream.index = s;
		// const d = {
		// 	type: MessageType.DataTables,
		// 	tick,
		// 	tables,
		// 	serverClasses,
		// };
		// require('fs').writeFileSync('src/tests/data/dataTableResult.json.gz', require('zlib').gzipSync(JSON.stringify(d)));
		// process.exit();

		return {
			type: MessageType.DataTables,
			tick,
			rawData: messageStream,
			tables,
			serverClasses
		};
	},
	encodeMessage: (message, stream) => {
		stream.writeUint32(message.tick);

		const lengthStart = stream.index;
		stream.index += 32;

		const dataStart = stream.index;

		for (const table of message.tables) {
			stream.writeBoolean(true);
			stream.writeBoolean(table.needsDecoder);
			stream.writeASCIIString(table.name);
			const numPropsStart = stream.index;
			stream.index += 10;

			let numProps = 0;
			for (const definition of table.props) {
				if (definition.arrayProperty) {
					encodeSendPropDefinition(stream, definition.arrayProperty);
					numProps++;
				}
				encodeSendPropDefinition(stream, definition);
				numProps++;
			}

			const propDataEnd = stream.index;
			stream.index = numPropsStart;
			stream.writeBits(numProps, 10);
			stream.index = propDataEnd;
		}
		stream.writeBoolean(false);

		stream.writeUint16(message.serverClasses.length);

		for (const serverClass of message.serverClasses) {
			stream.writeUint16(serverClass.id);
			stream.writeASCIIString(serverClass.name);
			stream.writeASCIIString(serverClass.dataTable);
		}

		const dataEnd = stream.index;

		stream.index = lengthStart;

		const byteLength = Math.ceil((dataEnd - dataStart) / 8);
		stream.writeUint32(byteLength);

		// align to byte;
		stream.index = dataStart + byteLength * 8;
	}
};

function encodeSendPropDefinition(stream: BitStream, definition: SendPropDefinition) {
	stream.writeBits(definition.type, 5);
	stream.writeASCIIString(definition.name);
	stream.writeBits(definition.flags, 16);

	if (definition.type === SendPropType.DPT_DataTable) {
		if (!definition.table) {
			throw new Error('Missing linked table');
		}
		stream.writeASCIIString(definition.table.name);
	} else {
		if (definition.isExcludeProp()) {
			if (!definition.excludeDTName) {
				throw new Error('Missing linked table');
			}
			stream.writeASCIIString(definition.excludeDTName);
		} else if (definition.type === SendPropType.DPT_Array) {
			stream.writeBits(definition.numElements, 10);
		} else {
			stream.writeFloat32(definition.lowValue);
			stream.writeFloat32(definition.highValue);
			stream.writeBits(definition.bitCount, 7);
		}
	}
}
