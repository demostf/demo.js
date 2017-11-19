import {BitStream} from 'bit-buffer';
import {EncodeCreateStringTable, ParseCreateStringTable} from '../../../../Parser/Packet/CreateStringTable';
import {assertEncoder, assertParser, assertReEncode, getStream} from './PacketTest';

const exampleData = [
	100,
	111,
	119,
	110,
	108,
	111,
	97,
	100,
	97,
	98,
	108,
	101,
	115,
	0,
	0,
	32,
	1,
	0,
	121,
	0,
	107,
	11,
	131,
	155,
	227,
	130,
	99,
	251,
	18,
	11,
	35,
	187,
	11,
	163,
	43,
	147,
	251,
	130,
	147,
	123,
	251,
	178,
	203,
	113,
	17,
	155,
	131,
	3,
	192];

const examplePacket = {
	packetType: 'createStringTable',
	table: {
		name: 'downloadables',
		entries: [{text: 'maps\\pl_badwater_pro_v9.bsp', extraData: undefined}],
		maxEntries: 8192,
		fixedUserDataSize: 0,
		fixedUserDataSizeBits: 0
	}
};

const examplePacket2 = {
	packetType: 'createStringTable',
	table: {
		name: 'downloadables',
		entries: [
			{text: 'maps\\pl_badwater_pro_v9.bsp', extraData: undefined},
			{text: 'foobar', extraData: undefined},
			{text: 'assadasdas', extraData: undefined},
			{text: 'foo', extraData: undefined}
		],
		maxEntries: 8192,
		fixedUserDataSize: 0,
		fixedUserDataSizeBits: 0
	}
};

suite('CreateStringTable', () => {
	test('Parse createStringTable', () => {
		assertParser(ParseCreateStringTable, getStream(exampleData), examplePacket, 388);
	});

	test('Encode createStringTable', () => {
		assertEncoder(ParseCreateStringTable, EncodeCreateStringTable, examplePacket, 388);
		assertEncoder(ParseCreateStringTable, EncodeCreateStringTable, examplePacket2, 615);
	});

	test('Re-encode classInfo', () => {
		assertReEncode(ParseCreateStringTable, EncodeCreateStringTable, getStream(exampleData));
	});
});
