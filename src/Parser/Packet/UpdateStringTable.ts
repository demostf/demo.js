import {PacketStringTable} from './PacketStringTable';
import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function UpdateStringTable(stream: BitStream): Packet { // 12: updateStringTable
	const tables = PacketStringTable(stream);
	return {
		packetType: 'updateStringTable',
		table: tables
	};
}
