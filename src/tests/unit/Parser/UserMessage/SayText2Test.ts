import {BitStream} from 'bit-buffer';
import {EncodeSayText2, ParseSayText2} from '../../../../Parser/UserMessage/SayText2';
import {assertEncoder, assertParser, getStream} from '../Packet/PacketTest';

const data = [
	3,
	1,
	84,
	70,
	95,
	67,
	104,
	97,
	116,
	95,
	84,
	101,
	97,
	109,
	95,
	68,
	101,
	97,
	100,
	0,
	79,
	108,
	100,
	32,
	66,
	105,
	108,
	108,
	121,
	32,
	82,
	105,
	108,
	101,
	121,
	0,
	91,
	80,
	45,
	82,
	69,
	67,
	93,
	32,
	83,
	116,
	111,
	112,
	32,
	114,
	101,
	99,
	111,
	114,
	100,
	46,
	0,
	0,
	0];
const expected = {
	packetType: 'userMessage',
	userMessageType: 'sayText2',
	client: 3,
	raw: 1,
	kind: 'TF_Chat_Team_Dead',
	from: 'Old Billy Riley',
	text: '[P-REC] Stop record.'
};

suite('SayText2', () => {
	test('Parse sayText2', () => {
		assertParser(ParseSayText2, getStream(data), expected, 472);
	});

	test('Encode sayText2', () => {
		assertEncoder(ParseSayText2, EncodeSayText2, expected, 472);
	});
});
