import {BitStream} from 'bit-buffer';
import {UpdateStringTablePacket} from '../../Data/Packet';
import {ParserState} from '../../Data/ParserState';
import {encodeStringTableEntries, guessStringTableEntryLength, parseStringTableEntries} from '../StringTableParser';

export function ParseUpdateStringTable(stream: BitStream, state: ParserState): UpdateStringTablePacket { // 12: updateStringTable
	const tableId = stream.readBits(5);

	const multipleChanged = stream.readBoolean();
	const changedEntries = multipleChanged ? stream.readUint16() : 1;

	const bitCount = stream.readBits(20);
	const data = stream.readBitStream(bitCount);
	data.index = 0;

	if (!state.stringTables[tableId]) {
		throw new Error(`Table not found for update: ${tableId}`);
	}

	const table = state.stringTables[tableId];
	const updatedEntries = parseStringTableEntries(data, table, changedEntries, table.entries);

	return {
		packetType: 'updateStringTable',
		entries: updatedEntries,
		tableId
	};
}

export function EncodeUpdateStringTable(packet: UpdateStringTablePacket, stream: BitStream, state: ParserState) {
	stream.writeBits(packet.tableId, 5);

	const changedEntryCount = packet.entries.filter((entry) => entry).length;
	const multipleChanged = changedEntryCount > 1;
	stream.writeBoolean(multipleChanged);

	if (multipleChanged) {
		stream.writeUint16(changedEntryCount);
	}

	if (!state.stringTables[packet.tableId]) {
		throw new Error(`Table not found for update: ${packet.tableId}`);
	}
	const table = state.stringTables[packet.tableId];
	const entryData = new BitStream(new ArrayBuffer(guessStringTableEntryLength(table, packet.entries)));
	encodeStringTableEntries(entryData, table, packet.entries);

	const entryLength = entryData.index;
	entryData.index = 0;

	stream.writeBits(entryLength, 20);
	stream.writeBitStream(entryData, entryLength);
}
