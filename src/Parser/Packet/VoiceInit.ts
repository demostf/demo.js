import {VoiceInitPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function VoiceInit(stream: BitStream): VoiceInitPacket {
	const codec     = stream.readASCIIString();
	const quality   = stream.readUint8();
	// no clue, from 2017-2-14 update
	const extraData = (codec === 'vaudio_celt') ? stream.readUint16() : 0;
	return {
		packetType: 'voiceInit',
		codec:      codec,
		quality:    quality,
		extraData:  extraData
	};
}
