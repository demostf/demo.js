import {VoiceInitPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function VoiceInit(stream: BitStream): VoiceInitPacket {
	const codec     = stream.readASCIIString();
	const quality   = stream.readUint8();
	// no clue, from 2017-2-14 update
	const extraData = readExtraData(stream, codec, quality);

	return {
		packetType: 'voiceInit',
		codec:      codec,
		quality:    quality,
		extraData:  extraData
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
