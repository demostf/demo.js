import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

function logBase2(num: number): number {
	let result = 0;
	while ((num >>= 1) != 0) {
		result++;
	}
	return result;
}

export function ClassInfo(stream: BitStream): Packet { // 10: classInfo
	const number = stream.readBits(16);
	const create = !!stream.readBits(1);
	let entries: any[] = [];
	if (!create) {
		const bits = logBase2(number) + 1;
		for (let i = 0; i < number; i++) {
			const entry = {
				'classId': stream.readBits(bits),
				'className': stream.readASCIIString(),
				'dataTableName': stream.readASCIIString()
			};
			entries.push(entry);
		}
	}
	return {
		'packetType': 'classInfo',
		number: number,
		create: create,
		entries: entries
	}
}
