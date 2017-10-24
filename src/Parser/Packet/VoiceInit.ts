import {BitStream} from 'bit-buffer';
import {VoiceInitPacket} from '../../Data/Packet';

export function ParseVoiceInit(stream: BitStream): VoiceInitPacket {
	const codec = stream.readASCIIString();
	const quality = stream.readUint8();

	// no clue, from 2017-2-14 update
	const extraData = readExtraData(stream, codec, quality);

	return {
		packetType: 'voiceInit',
		codec,
		quality,
		extraData
	};
}

function readExtraData(stream: BitStream, codec: string, quality: number) {
	if (quality === 255) {
		return stream.readUint16();
	} else if (codec === 'vaudio_celt') {
		return 11025;
	} else {
		return 0;
	}
}

export function EncodeVoiceInit(packet: VoiceInitPacket, stream: BitStream) {
	stream.writeASCIIString(packet.codec);
	stream.writeUint8(packet.quality);
	if (packet.extraData) {
		stream.writeUint16(packet.extraData);
	}
}
