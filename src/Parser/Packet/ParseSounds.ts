import {ParseSoundsPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function ParseSounds(stream: BitStream): ParseSoundsPacket { // 17: parseSounds
	const reliable = stream.readBoolean();
	const num = (reliable) ? 1 : stream.readUint8();
	const length = (reliable) ? stream.readUint8() : stream.readUint16();
	stream.index += length;
	return {
		packetType: 'parseSounds',
		reliable: reliable,
		num: num,
		length: length
	}
}
