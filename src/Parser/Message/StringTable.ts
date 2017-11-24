import {BitStream} from 'bit-buffer';
import {MessageHandler, MessageType, StringTablesMessage} from '../../Data/Message';
import {StringTable as StringTableObject, StringTableEntry} from '../../Data/StringTable';

export const StringTableHandler: MessageHandler<StringTablesMessage> = {
	parseMessage: (stream: BitStream) => {
		const tick = stream.readInt32();

		const length = stream.readInt32();
		const messageStream = stream.readBitStream(length * 8);

		// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/ST/StringTableParser.cs
		const tableCount = messageStream.readUint8();
		const tables: StringTableObject[] = [];
		for (let i = 0; i < tableCount; i++) {
			const entries: StringTableEntry[] = [];
			const tableName = messageStream.readASCIIString();
			const entryCount = messageStream.readUint16();
			for (let j = 0; j < entryCount; j++) {
				const entry = readEntry(messageStream);
				entries.push(entry);
			}
			const table: StringTableObject = {
				entries,
				name: tableName,
				maxEntries: entryCount,
				clientEntries: []
			};

			if (messageStream.readBoolean()) {
				const clientEntries = messageStream.readUint16();
				for (let j = 0; j < clientEntries; j++) {
					const entry = readEntry(messageStream);
					(table.clientEntries as StringTableEntry[]).push(entry);
				}
			}

			tables.push(table);
		}
		return {
			type: MessageType.StringTables,
			tick,
			rawData: messageStream,
			tables
		};
	},
	encodeMessage: (message, stream) => {
		stream.writeUint32(message.tick);

		const lengthStart = stream.index;
		stream.index += 32;
		const dataStart = stream.index;

		stream.writeUint8(message.tables.length);

		for (const table of message.tables) {
			stream.writeASCIIString(table.name);
			stream.writeUint16(table.entries.length);

			for (const entry of table.entries) {
				writeEntry(entry, stream);
			}

			if (table.clientEntries && table.clientEntries.length) {
				stream.writeBoolean(true);
				stream.writeUint16(table.clientEntries.length);
				for (const entry of table.clientEntries) {
					writeEntry(entry, stream);
				}
			} else {
				stream.writeBoolean(false);
			}

		}

		const dataEnd = stream.index;

		stream.index = lengthStart;

		const byteLength = Math.ceil((dataEnd - dataStart) / 8);
		stream.writeUint32(byteLength);

		// align to byte;
		stream.index = dataStart + byteLength * 8;
	}
};

function readEntry(stream: BitStream): StringTableEntry {
	const entry: StringTableEntry = {text: stream.readUTF8String()};
	if (stream.readBoolean()) {
		const extraDataLength = stream.readUint16();
		entry.extraData = stream.readBitStream(extraDataLength * 8);
	}
	return entry;
}

function writeEntry(entry: StringTableEntry, stream: BitStream) {
	stream.writeUTF8String(entry.text);
	if (entry.extraData) {
		stream.writeBoolean(true);

		stream.writeUint16(Math.ceil(entry.extraData.length / 8));
		entry.extraData.index = 0;
		stream.writeBitStream(entry.extraData, entry.extraData.length);
	} else {
		stream.writeBoolean(false);
	}
}
