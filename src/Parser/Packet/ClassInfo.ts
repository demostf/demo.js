import {ClassInfoPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {logBase2} from '../../Math';

export function ClassInfo(stream: BitStream): ClassInfoPacket { // 10: classInfo
	const number       = stream.readBits(16);
	const create       = stream.readBoolean();
	let entries: any[] = [];
	if (!create) {
		const bits = logBase2(number) + 1;
		for (let i = 0; i < number; i++) {
			const entry = {
				'classId':       stream.readBits(bits),
				'className':     stream.readASCIIString(),
				'dataTableName': stream.readASCIIString()
			};
			entries.push(entry);
		}
	}
	return {
		'packetType': 'classInfo',
		number:       number,
		create:       create,
		entries:      entries
	}
}
