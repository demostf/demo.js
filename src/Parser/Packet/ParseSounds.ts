import {BitStream} from 'bit-buffer';
import {ParseSoundsPacket} from '../../Data/Packet';

export function ParseParseSounds(stream: BitStream): ParseSoundsPacket { // 17: parseSounds
	const reliable = stream.readBoolean();
	const num = (reliable) ? 1 : stream.readUint8();
	const length = (reliable) ? stream.readUint8() : stream.readUint16();
	const data = stream.readBitStream(length);

	return {
		packetType: 'parseSounds',
		reliable,
		num,
		length,
		data
	};
}

export function EncodeParseSounds(packet: ParseSoundsPacket, stream: BitStream) {
	stream.writeBoolean(packet.reliable);
	if (packet.reliable) {
		stream.writeUint8(packet.length);
	} else {
		stream.writeUint8(packet.num);
		stream.writeUint16(packet.length);
	}

	packet.data.index = 0;
	stream.writeBitStream(packet.data, packet.length);
	packet.data.index = 0;
}
