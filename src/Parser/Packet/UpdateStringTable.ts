import {PacketStringTable} from './PacketStringTable';
import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {Match} from "../../Data/Match";
import {parseStringTable} from "../StringTableParser";

export function UpdateStringTable(stream: BitStream, match: Match): Packet { // 12: updateStringTable
	const tableId = stream.readBits(5);

	const multipleChanged = stream.readBoolean();
	const changedEntries  = (multipleChanged) ? stream.readBits(16) : 1;

	const bitCount = stream.readBits(20);
	const data     = stream.readBitStream(bitCount);

	if (!match.stringTables[tableId]) {
		throw new Error('Table not found for update');
	}

	const table = match.stringTables[tableId];
	console.log('update table ' + table.name);
	parseStringTable(data, table, changedEntries, match);

	return {
		packetType: 'updateStringTable',
		table:      table
	};
}
