import {MenuPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function Menu(stream: BitStream): MenuPacket {
	//'type{16}length{16}_{$length}_{$length}_{$length}_{$length}_{$length}_{$length}_{$length}'
	const type   = stream.readUint16();
	const length = stream.readUint16();
	const data   = stream.readBitStream(length * 8); //length is in bytes
	return {
		packetType: 'menu',
		type:       type,
		length:     length,
		data:       data
	};
}
