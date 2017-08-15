import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';
import {EncodeUpdateStringTable, ParseUpdateStringTable} from '../../../../Parser/Packet/UpdateStringTable';
import {Match} from '../../../../Data/Match';
import {StringTable} from '../../../../Data/StringTable';
import {UpdateStringTablePacket} from '../../../../Data/Packet';

const exampleData = [200, 3, 0, 48, 130, 53];

function getExistingMatch() {
	const existingTable: StringTable = {
		name: 'downloadables',
		entries: [],
		maxEntries: 2048,
		fixedUserDataSize: 1,
		fixedUserDataSizeBits: 1
	};
	existingTable.entries[70] = {text: 'maps\\pl_badwater_pro_v9.bsp'};
	const match = new Match();
	match.stringTables[8] = existingTable;

	return match;
}

const examplePacket: UpdateStringTablePacket = {
	packetType: 'updateStringTable',
	entries: [],
	tableId: 8
};
const extraData = getStream(exampleData);
extraData.index = 40;
examplePacket.entries[70] = {
	text: 'maps\\pl_badwater_pro_v9.bsp',
	extraData: extraData.readBitStream(
		1
	)
};


const examplePacket2: UpdateStringTablePacket = {
	packetType: 'updateStringTable',
	entries: [
		{text: 'foo', extraData: undefined},
		{text: 'foobar', extraData: undefined},
		{text: 'assadasdas', extraData: undefined},
		{text: 'foo', extraData: undefined}
	],
	tableId: 8
};

function ParseUpdate(stream: BitStream) {
	return ParseUpdateStringTable(stream, getExistingMatch());
}

function EncodeUpdate(packet: UpdateStringTablePacket, stream: BitStream) {
	return EncodeUpdateStringTable(packet, stream, getExistingMatch());
}

suite('UpdateStringTable', () => {
	test('Parse updateStringTable', () => {
		assertParser(ParseUpdate, getStream(exampleData), examplePacket, 41);
	});

	test('Encode updateStringTable', () => {
		assertEncoder(ParseUpdate, EncodeUpdate, examplePacket, 266);
		assertEncoder(ParseUpdate, EncodeUpdate, examplePacket2, 299);
	});
});
