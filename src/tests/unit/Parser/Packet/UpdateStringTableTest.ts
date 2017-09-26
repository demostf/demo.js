import {BitStream} from 'bit-buffer';
import {UpdateStringTablePacket} from '../../../../Data/Packet';
import {createParserState} from '../../../../Data/ParserState';
import {StringTable} from '../../../../Data/StringTable';
import {EncodeUpdateStringTable, ParseUpdateStringTable} from '../../../../Parser/Packet/UpdateStringTable';
import {assertEncoder, assertParser, getStream} from './PacketTest';

const exampleData = [200, 3, 0, 48, 130, 53];

function getExistingParserState() {
	const existingTable: StringTable = {
		name: 'downloadables',
		entries: [],
		maxEntries: 2048,
		fixedUserDataSize: 1,
		fixedUserDataSizeBits: 1
	};
	existingTable.entries[70] = {text: 'maps\\pl_badwater_pro_v9.bsp'};
	const state = createParserState();
	state.stringTables[8] = existingTable;

	return state;
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
	return ParseUpdateStringTable(stream, getExistingParserState());
}

function EncodeUpdate(packet: UpdateStringTablePacket, stream: BitStream) {
	return EncodeUpdateStringTable(packet, stream, getExistingParserState());
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
