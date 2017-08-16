import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';
import {EncodeVoiceInit, ParseVoiceInit} from '../../../../Parser/Packet/VoiceInit';

const data = [118, 97, 117, 100, 105, 111, 95, 99, 101, 108, 116, 0, 255, 34, 86];

suite('VoiceInit', () => {
	test('Parse voiceInit', () => {
		assertParser(ParseVoiceInit, getStream(data), {
			packetType: 'voiceInit',
			codec: 'vaudio_celt',
			quality: 255,
			extraData: 22050
		}, 120);
	});

	test('Encode voiceInit', () => {
		assertEncoder(ParseVoiceInit, EncodeVoiceInit, {
			packetType: 'voiceInit',
			codec: 'vaudio_celt',
			quality: 255,
			extraData: 22050
		}, 120);
	});
});
