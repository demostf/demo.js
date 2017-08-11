import {BitStream} from 'bit-buffer';
import {ParseSoundsPacket} from '../../Data/Packet';

export function ParseParseSounds(stream: BitStream): ParseSoundsPacket { // 17: parseSounds
	const reliable = stream.readBoolean();
	const num = (reliable) ? 1 : stream.readUint8();
	const length = (reliable) ? stream.readUint8() : stream.readUint16();
	stream.index += length;
	return {
		packetType: 'parseSounds',
		reliable,
		num,
		length,
	};
}
