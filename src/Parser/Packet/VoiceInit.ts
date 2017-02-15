import {VoiceInitPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function VoiceInit(stream: BitStream): VoiceInitPacket {
	//ParserGenerator.make('voiceInit', 'codec{s}quality{8}'),
	const codec = stream.readASCIIString();
	const quality = stream.readUint8();
	if (codec === 'vaudio_celt') {
		// no clue, from 2017-2-14 update
		stream.readUint8();
		stream.readUint8();
	}
	return {
		packetType: 'voiceInit',
		codec:      codec,
		quality:    quality
	}
}
