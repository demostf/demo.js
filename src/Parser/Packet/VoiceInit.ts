import {BitStream} from 'bit-buffer';
import {VoiceInitPacket} from '../../Data/Packet';

export function ParseVoiceInit(stream: BitStream): VoiceInitPacket {
	const codec = stream.readASCIIString();
	const quality = stream.readUint8();

	// no clue, from 2017-2-14 update
	const extraData = (codec === 'vaudio_celt' && quality === 255) ? stream.readUint16() : 0;

	return {
		packetType: 'voiceInit',
		codec,
		quality,
		extraData,
	};
}

export function EncodeVoiceInit(packet: VoiceInitPacket, stream: BitStream) {
	stream.writeASCIIString(packet.codec);
	stream.writeUint8(packet.quality);
	if (packet.extraData) {
		stream.writeUint16(packet.extraData);
	}
}
