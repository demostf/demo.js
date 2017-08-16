import {BitStream} from 'bit-buffer';
import {BSPDecalPacket} from '../../Data/Packet';
import {Vector} from '../../Data/Vector';

export function getCoord(stream: BitStream): number {
	const hasInt = stream.readBoolean();
	const hasFract = stream.readBoolean();
	let value = 0;
	if (hasInt || hasFract) {
		const sign = stream.readBoolean();
		if (hasInt) {
			value += stream.readBits(14) + 1;
		}
		if (hasFract) {
			value += stream.readBits(5) * (1 / 32);
		}
		if (sign) {
			value = -value;
		}
	}

	return value;
}

export function encodeCoord(value: number, stream: BitStream) {
	const abs = Math.abs(value);
	const intPart = Math.floor(abs);
	const fractPart = abs % 1;
	stream.writeBoolean(intPart !== 0);
	stream.writeBoolean(fractPart !== 0);
	if (intPart || fractPart) {
		stream.writeBoolean(value < 0);
		if (intPart) {
			stream.writeBits(intPart - 1, 14);
		}
		if (fractPart) {
			stream.writeBits(fractPart * 32, 5);
		}
	}
}

export function getVecCoord(stream: BitStream): Vector {
	const hasX = stream.readBoolean();
	const hasY = stream.readBoolean();
	const hasZ = stream.readBoolean();

	return {
		x: hasX ? getCoord(stream) : 0,
		y: hasY ? getCoord(stream) : 0,
		z: hasZ ? getCoord(stream) : 0,
	};
}

export function encodeVecCoord(vector: Vector, stream: BitStream) {
	stream.writeBoolean(vector.x !== 0);
	stream.writeBoolean(vector.y !== 0);
	stream.writeBoolean(vector.z !== 0);

	if (vector.x !== 0) {
		encodeCoord(vector.x, stream);
	}
	if (vector.y !== 0) {
		encodeCoord(vector.y, stream);
	}
	if (vector.z !== 0) {
		encodeCoord(vector.z, stream);
	}
}

export function ParseBSPDecal(stream: BitStream): BSPDecalPacket { // 21: ParseBSPDecal
	let modelIndex = 0;
	let entIndex = 0;
	const position = getVecCoord(stream);
	const textureIndex = stream.readBits(9);
	if (stream.readBoolean()) {
		entIndex = stream.readBits(11);
		modelIndex = stream.readBits(12);
	}
	const lowPriority = stream.readBoolean();

	return {
		packetType: 'bspDecal',
		position,
		textureIndex,
		entIndex,
		modelIndex,
		lowPriority,
	};
}

export function EncodeBSPDecal(packet: BSPDecalPacket, stream: BitStream) {
	encodeVecCoord(packet.position, stream);
	stream.writeBits(packet.textureIndex, 9);
	if (packet.entIndex || packet.modelIndex) {
		stream.writeBoolean(true);
		stream.writeBits(packet.entIndex, 11);
		stream.writeBits(packet.modelIndex, 12);
	} else {
		stream.writeBoolean(false);
	}
	stream.writeBoolean(packet.lowPriority);
}
