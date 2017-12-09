import {BitStream} from 'bit-buffer';
import {readFileSync} from 'fs';
import {StringTableEntry} from '../../../Data/StringTable';
import {encodeStringTableEntries, parseStringTableEntries} from '../../../Parser/StringTableParser';
import {assertEncoder, assertParser, assertReEncode, getStream} from './Packet/PacketTest';

const baseTable = {
	name: 'modelprecache',
	entries: [],
	maxEntries: 4096,
	fixedUserDataSize: 1,
	fixedUserDataSizeBits: 2,
	compressed: true
};

const data = readFileSync(__dirname + '/../../data/stringTableEntries.bin');

function ParseUpdate(stream: BitStream) {
	return parseStringTableEntries(stream, baseTable, 981);
}

function EncodeUpdate(entries: StringTableEntry[], stream: BitStream) {
	return encodeStringTableEntries(stream, baseTable, entries);
}

suite('string table parser', () => {
	test('Encode string table entries', () => {
		const expected = ParseUpdate(new BitStream(data));
		assertEncoder(ParseUpdate, EncodeUpdate, expected);
	});

	test('Re-encode string table entries', () => {
		assertReEncode(ParseUpdate, EncodeUpdate, new BitStream(data));
	});
});
