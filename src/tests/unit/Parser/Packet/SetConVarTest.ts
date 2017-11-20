import {BitStream} from 'bit-buffer';
import {EncodeSetConVar, ParseSetConVar} from '../../../../Parser/Packet/SetConVar';
import {assertEncoder, assertParser, assertReEncode, getStream} from './PacketTest';

suite('SetConVar', () => {
	test('Parse setConVar', () => {
		assertParser(ParseSetConVar, getStream(String.fromCharCode(2) + 'foo\0bar\0second\0value\0'), {
			packetType: 'setConVar',
			vars: new Map([
				['foo', 'bar'],
				['second', 'value']
			])
		}, 8 + ('foo\0bar\0second\0value\0'.length * 8));
	});

	test('Encode setConVar', () => {
		assertEncoder(ParseSetConVar, EncodeSetConVar, {
			packetType: 'setConVar',
			vars: new Map([
				['foo', 'bar'],
				['second', 'value']
			])
		}, 8 + ('foo\0bar\0second\0value\0'.length * 8));
	});

	test('Re-encode setConVar', () => {
		assertReEncode(ParseSetConVar, EncodeSetConVar, getStream(String.fromCharCode(2) + 'foo\0bar\0second\0value\0'));
	});
});
