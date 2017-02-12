import {PacketStringTable} from './PacketStringTable';
import {StringTablePacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {Match} from "../../Data/Match";
import {parseStringTable} from "../StringTableParser";

export function UpdateStringTable(stream: BitStream, match: Match): StringTablePacket { // 12: updateStringTable
	const tableId = stream.readBits(5);

	const multipleChanged = stream.readBoolean();
	const changedEntries  = (multipleChanged) ? stream.readBits(16) : 1;

	const bitCount = stream.readBits(20);
	const data     = stream.readBitStream(bitCount);

	if (!match.stringTables[tableId]) {
		throw new Error('Table not found for update');
	}

	const table = match.stringTables[tableId];
	parseStringTable(data, table, changedEntries, match);

	return {
		packetType: 'stringTable',
		tables:      [table]
	};
}
