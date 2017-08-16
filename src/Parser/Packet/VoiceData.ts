import {BitStream} from 'bit-buffer';
import {VoiceDataPacket} from '../../Data/Packet';

export function ParseVoiceData(stream: BitStream): VoiceDataPacket {
	const client = stream.readUint8();
	const proximity = stream.readUint8();
	const length = stream.readUint16();
	const data = stream.readBitStream(length);

	return {
		packetType: 'voiceData',
		client,
		proximity,
		length,
		data,
	};
}

export function EncodeVoiceData(packet: VoiceDataPacket, stream: BitStream) {
	stream.writeUint8(packet.client);
	stream.writeUint8(packet.proximity);
	stream.writeUint16(packet.length);
	packet.data.index = 0;
	stream.writeBitStream(packet.data, packet.length);
	packet.data.index = 0;

	const length = stream.index;

	stream.index = 0;
	console.log(stream.readArrayBuffer(Math.ceil(length / 8)));
}
