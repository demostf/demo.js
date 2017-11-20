import {BitStream} from 'bit-buffer';
import {UpdateStringTablePacket} from '../../Data/Packet';
import {ParserState} from '../../Data/ParserState';
import {encodeStringTableEntries, parseStringTableEntries} from '../StringTableParser';

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

	const lengthStart = stream.index;
	stream.index += 20;
	const lengthEnd = stream.index;

	const table = state.stringTables[packet.tableId];
	encodeStringTableEntries(stream, table, packet.entries, table.entries);

	const dataEnd = stream.index;
	stream.index = lengthStart;
	const entryLength = dataEnd - lengthEnd;
	stream.writeBits(entryLength, 20);
	stream.index = dataEnd;
}
