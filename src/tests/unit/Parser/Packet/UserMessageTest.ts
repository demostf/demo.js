import {BitStream} from 'bit-buffer';
import {HudTextLocation} from '../../../../Data/UserMessage';
import {EncodeUserMessage, ParseUserMessage} from '../../../../Parser/Packet/UserMessage';
import {assertEncoder, assertParser, assertReEncode, getStream} from './PacketTest';

const data = [
	5,
	200,
	8,
	24,
	57,
	10,
	107,
	43,
	251,
	26,
	123,
	115,
	115,
	43,
	27,
	163,
	43,
	35,
	3,
	152,
	43,
	91,
	147,
	3,
	0,
	0,
	0,
	24];

const expected = {
	packetType: 'userMessage',
	userMessageType: 'textMsg',
	destType: HudTextLocation.HUD_PRINTNOTIFY,
	text: '#Game_connected',
	substitute1: 'sekr',
	substitute2: '',
	substitute3: '',
	substitute4: ''
};

suite('UserMessage', () => {
	test('Parse userMessage', () => {
		assertParser(ParseUserMessage, getStream(data), expected, 219);
	});

	test('Encode userMessage', () => {
		assertEncoder(ParseUserMessage, EncodeUserMessage, expected, 219);
	});

	test('Re-encode userMessage', () => {
		assertReEncode(ParseUserMessage, EncodeUserMessage, getStream(data));
	});
});
