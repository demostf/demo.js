import {PacketStringTable} from '../../packetstringtable';

import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function CreateStringTable(stream: BitStream): Packet { // 12: createStringTable
	const stringTable = new PacketStringTable(stream);
	const tables = stringTable.parse();
	return {
		packetType: 'createStringTable',
		table: tables
	};
}
