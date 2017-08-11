import {BitStream} from 'bit-buffer';
import {ClassInfoPacket} from '../../Data/Packet';
import {logBase2} from '../../Math';

export function ParseClassInfo(stream: BitStream): ClassInfoPacket { // 10: classInfo
	const count       = stream.readBits(16);
	const create       = stream.readBoolean();
	const entries: any[] = [];
	if (!create) {
		const bits = logBase2(count) + 1;
		for (let i = 0; i < count; i++) {
			const entry = {
				classId:       stream.readBits(bits),
				className:     stream.readASCIIString(),
				dataTableName: stream.readASCIIString(),
			};
			entries.push(entry);
		}
	}
	return {
		packetType: 'classInfo',
		number: count,
		create,
		entries,
	};
}
