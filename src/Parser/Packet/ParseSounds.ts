import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function ParseSounds(stream: BitStream): Packet { // 17: parseSounds
	const reliable = stream.readBoolean();
	const num = (reliable) ? 1 : stream.readUint8();
	const length = (reliable) ? stream.readUint8() : stream.readUint16();
	stream._index += length;
	return {
		packetType: 'parseSounds',
		reliable: reliable,
		num: num,
		length: length
	}
}
