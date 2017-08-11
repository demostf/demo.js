import {BitStream} from 'bit-buffer';
import {MenuPacket} from '../../Data/Packet';

export function ParseMenu(stream: BitStream): MenuPacket {
	const type   = stream.readUint16();
	const length = stream.readUint16();
	const data   = stream.readBitStream(length * 8); // length is in bytes
	return {
		packetType: 'menu',
		type,
		length,
		data,
	};
}
