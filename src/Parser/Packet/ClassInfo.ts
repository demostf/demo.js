import {BitStream} from 'bit-buffer';
import {ClassInfoPacket} from '../../Data/Packet';
import {logBase2} from '../../Math';

export function ParseClassInfo(stream: BitStream): ClassInfoPacket { // 10: classInfo
	const count = stream.readUint16();
	const create = stream.readBoolean();
	const entries: Array<{
		classId: number;
		className: string;
		dataTableName: string;
	}> = [];
	if (!create) {
		const bits = logBase2(count) + 1;
		for (let i = 0; i < count; i++) {
			const entry = {
				classId: stream.readBits(bits),
				className: stream.readASCIIString(),
				dataTableName: stream.readASCIIString()
			};
			entries.push(entry);
		}
	}
	return {
		packetType: 'classInfo',
		number: count,
		create,
		entries
	};
}

export function EncodeClassInfo(packet: ClassInfoPacket, stream: BitStream) {
	stream.writeUint16(packet.number);
	stream.writeBoolean(packet.create);
	if (!packet.create) {
		const bits = logBase2(packet.number) + 1;
		for (const entry of packet.entries) {
			stream.writeBits(entry.classId, bits);
			stream.writeASCIIString(entry.className);
			stream.writeASCIIString(entry.dataTableName);
		}
	}
}
