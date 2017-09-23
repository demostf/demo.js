import {SendPropDefinition, SendPropFlag, SendPropType} from '../../Data/SendPropDefinition';
import {SendTable} from '../../Data/SendTable';
import {ServerClass} from '../../Data/ServerClass';
import {DataTablesMessage, MessageHandler, MessageType} from '../../Data/Message';
import {BitStream} from 'bit-buffer';

export const DataTableHandler: MessageHandler<DataTablesMessage> = {
	parseMessage: (stream: BitStream, tick: number) => {
		// https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_common_eng.cpp#L356
		// https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_recv_eng.cpp#L310
		// https://github.com/PazerOP/DemoLib/blob/master/DemoLib/Commands/DemoDataTablesCommand.cs
		const tables: SendTable[] = [];
		const tableMap: {[key: string]: SendTable} = {};
		while (stream.readBoolean()) {
			const needsDecoder = stream.readBoolean();
			const tableName = stream.readASCIIString();
			const numProps = stream.readBits(10);
			const table = new SendTable(tableName);

			// get props metadata
			let arrayElementProp;
			for (let i = 0; i < numProps; i++) {
				const propType = stream.readBits(5);
				const propName = stream.readASCIIString();
				const nFlagsBits = 16; // might be 11 (old?), 13 (new?), 16(networked) or 17(??)
				const flags = stream.readBits(nFlagsBits);
				const prop = new SendPropDefinition(propType, propName, flags, tableName);
				if (propType === SendPropType.DPT_DataTable) {
					prop.excludeDTName = stream.readASCIIString();
				} else {
					if (prop.isExcludeProp()) {
						prop.excludeDTName = stream.readASCIIString();
					} else if (prop.type === SendPropType.DPT_Array) {
						prop.numElements = stream.readBits(10);
					} else {
						prop.lowValue = stream.readFloat32();
						prop.highValue = stream.readFloat32();
						prop.bitCount = stream.readBits(7);
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

		const numServerClasses = stream.readUint16(); // short
		const serverClasses: ServerClass[] = [];
		if (numServerClasses <= 0) {
			throw new Error('expected one or more serverclasses');
		}

		for (let i = 0; i < numServerClasses; i++) {
			const classId = stream.readUint16();
			if (classId > numServerClasses) {
				throw new Error('invalid class id');
			}
			const className = stream.readASCIIString();
			const dataTable = stream.readASCIIString();
			serverClasses.push(new ServerClass(classId, className, dataTable));
		}

		const bitsLeft = (this.length * 8) - stream.index;
		if (bitsLeft > 7 || bitsLeft < 0) {
			throw new Error('unexpected remaining data in datatable (' + bitsLeft + ' bits)');
		}

		return {
			type: MessageType.DataTables,
			tick,
			rawData: stream,
			tables,
			serverClasses,
		};
	},
	encodeMessage: (message, stream) => {
		throw new Error('Not implemented');
	}
};
