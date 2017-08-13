import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {UpdateStringTablePacket} from '../../Data/Packet';
import {parseStringTableEntries} from '../StringTableParser';

export function ParseUpdateStringTable(stream: BitStream, match: Match): UpdateStringTablePacket { // 12: updateStringTable
	const tableId = stream.readBits(5);

	const multipleChanged = stream.readBoolean();
	const changedEntries = (multipleChanged) ? stream.readBits(16) : 1;

	const bitCount = stream.readBits(20);
	const data = stream.readBitStream(bitCount);

	if (!match.stringTables[tableId]) {
		throw new Error('Table not found for update');
	}

	const table = match.stringTables[tableId];
	const updatedEntries = parseStringTableEntries(data, table, changedEntries, table.entries);

	for (let i = 0; i < updatedEntries.length; i++) {
		if (updatedEntries[i]) {
			table.entries[i] = updatedEntries[i];
		}
	}

	return {
		packetType: 'updateStringTable',
		table: table,
	};
}
