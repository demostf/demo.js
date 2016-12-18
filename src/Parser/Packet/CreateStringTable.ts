import {PacketStringTable} from './PacketStringTable';

import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function CreateStringTable(stream: BitStream): Packet { // 12: createStringTable
	const tables = PacketStringTable(stream);
	return {
		packetType: 'createStringTable',
		table: tables
	};
}
