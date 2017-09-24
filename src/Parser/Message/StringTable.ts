import {StringTable as StringTableObject, StringTableEntry} from '../../Data/StringTable';
import {MessageHandler, MessageType, StringTablesMessage} from '../../Data/Message';
import {BitStream} from 'bit-buffer';

export const StringTableHandler: MessageHandler<StringTablesMessage> = {
	parseMessage: (stream: BitStream) => {
		const tick = stream.readInt32();

		const length = stream.readInt32();
		const messageStream = stream.readBitStream(length * 8);

		// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/ST/StringTableParser.cs
		const tableCount = messageStream.readUint8();
		const tables: StringTableObject[] = [];
		let extraDataLength;
		for (let i = 0; i < tableCount; i++) {
			const entries: StringTableEntry[] = [];
			const tableName = messageStream.readASCIIString();
			const entryCount = messageStream.readUint16();
			for (let j = 0; j < entryCount; j++) {
				let entry: StringTableEntry;
				try {
					entry = {
						text: messageStream.readUTF8String(),
					};
				} catch (e) {
					return {
						type: MessageType.StringTables,
						tick,
						rawData: messageStream,
						tables,
					};
				}
				if (messageStream.readBoolean()) {
					extraDataLength = messageStream.readUint16();
					if ((extraDataLength * 8) > messageStream.bitsLeft) {
						// extradata to long, can't continue parsing the tables
						// seems to happen in POV demos after the MyM update
						return {
							type: MessageType.StringTables,
							tick,
							rawData: messageStream,
							tables,
						};
					}
					entry.extraData = messageStream.readBitStream(extraDataLength * 8);
				}
				entries.push(entry);
			}
			const table: StringTableObject = {
				entries,
				name: tableName,
				maxEntries: entryCount,
			};
			tables.push(table);
			if (messageStream.readBits(1)) {
				messageStream.readASCIIString();
				if (messageStream.readBits(1)) {
					// throw 'more extra data not implemented';
					extraDataLength = messageStream.readBits(16);
					messageStream.readBits(extraDataLength);
				}
			}
		}
		return {
			type: MessageType.StringTables,
			tick,
			rawData: messageStream,
			tables,
		};
	},
	encodeMessage: (message, stream) => {
		throw new Error('Not implemented');
	}
};
