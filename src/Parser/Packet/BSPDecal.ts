import {BitStream} from 'bit-buffer';
import {BSPDecalPacket} from '../../Data/Packet';
import {Vector} from '../../Data/Vector';
import {SendPropEncoder} from '../SendPropEncoder';
import {SendPropParser} from '../SendPropParser';

export function getVecCoord(stream: BitStream): Vector {
	const hasX = stream.readBoolean();
	const hasY = stream.readBoolean();
	const hasZ = stream.readBoolean();

	return {
		x: hasX ? SendPropParser.readBitCoord(stream) : 0,
		y: hasY ? SendPropParser.readBitCoord(stream) : 0,
		z: hasZ ? SendPropParser.readBitCoord(stream) : 0
	};
}

export function encodeVecCoord(vector: Vector, stream: BitStream) {
	stream.writeBoolean(vector.x !== 0);
	stream.writeBoolean(vector.y !== 0);
	stream.writeBoolean(vector.z !== 0);

	if (vector.x !== 0) {
		SendPropEncoder.writeBitCoord(vector.x, stream);
	}
	if (vector.y !== 0) {
		SendPropEncoder.writeBitCoord(vector.y, stream);
	}
	if (vector.z !== 0) {
		SendPropEncoder.writeBitCoord(vector.z, stream);
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
		lowPriority
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
