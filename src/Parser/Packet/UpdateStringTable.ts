import {PacketStringTable} from '../../packetstringtable';
import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function UpdateStringTable(stream: BitStream): Packet { // 12: updateStringTable
	const stringTable = new PacketStringTable(stream);
	const tables = stringTable.parse();
	return {
		packetType: 'updateStringTable',
		table: tables
	};
}
