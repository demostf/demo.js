import {VoiceDataPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function VoiceData(stream: BitStream): VoiceDataPacket {
	// 'client{8}proximity{8}length{16}_{$length}'
	const client    = stream.readUint8();
	const proximity = stream.readUint8();
	const length    = stream.readUint16();
	const data      = stream.readBitStream(length);
	return {
		packetType: 'voiceData',
		client:     client,
		proximity:  proximity,
		length:     length,
		data:       data
	};
}
