import {StringTable as StringTableObject, StringTableEntry} from '../../Data/StringTable';
import {MessageHandler, MessageType, StringTablesMessage} from '../../Data/Message';
import {BitStream} from 'bit-buffer';

export const StringTableHandler: MessageHandler<StringTablesMessage> = {
	parseMessage: (stream: BitStream, tick: number) => {
		// we get the tables from the packets
		// return [{
		// 	packetType: 'stringTable',
		// 	tables:     []
		// }];
		// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/ST/StringTableParser.cs
		const tableCount = stream.readUint8();
		const tables: StringTableObject[] = [];
		let extraDataLength;
		for (let i = 0; i < tableCount; i++) {
			const entries: StringTableEntry[] = [];
			const tableName = stream.readASCIIString();
			const entryCount = stream.readUint16();
			for (let j = 0; j < entryCount; j++) {
				let entry: StringTableEntry;
				try {
					entry = {
						text: stream.readUTF8String(),
					};
				} catch (e) {
					return {
						type: MessageType.StringTables,
						tick,
						rawData: stream,
						tables,
					};
				}
				if (stream.readBoolean()) {
					extraDataLength = stream.readUint16();
					if ((extraDataLength * 8) > stream.bitsLeft) {
						// extradata to long, can't continue parsing the tables
						// seems to happen in POV demos after the MyM update
						return {
							type: MessageType.StringTables,
							tick,
							rawData: stream,
							tables,
						};
					}
					entry.extraData = stream.readBitStream(extraDataLength * 8);
				}
				entries.push(entry);
			}
			const table: StringTableObject = {
				entries,
				name: tableName,
				maxEntries: entryCount,
			};
			tables.push(table);
			if (stream.readBits(1)) {
				stream.readASCIIString();
				if (stream.readBits(1)) {
					// throw 'more extra data not implemented';
					extraDataLength = stream.readBits(16);
					stream.readBits(extraDataLength);
				}
			}
		}
		return {
			type: MessageType.StringTables,
			tick,
			rawData: stream,
			tables,
		};
	},
	encodeMessage: (message, stream) => {
		throw new Error('Not implemented');
	}
};
