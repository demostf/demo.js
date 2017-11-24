import {BitStream} from 'bit-buffer';
import {readFileSync} from 'fs';
import {PacketTypeId} from '../../../../Data/Packet';
import {ParserState} from '../../../../Data/ParserState';
import {PacketMessageHandler} from '../../../../Parser/Message/Packet';
import {assertEncoder, assertParser, assertReEncode, getStream} from '../Packet/PacketTest';

const data = Object.values(JSON.parse(readFileSync(__dirname + '/../../../data/packetMessageData.json', 'utf8')));
const firstPacketData = readFileSync(__dirname + '/../../../data/packetMessageFirst.bin');
const expected = JSON.parse(readFileSync(__dirname + '/../../../data/packetMessageResult.json', 'utf8'));

const getParserState = (fastMode) => {
	const state = new ParserState();
	// fast mode allows us not to bother with complicated entity parser state
	state.skippedPackets = fastMode ? [
		PacketTypeId.packetEntities,
		PacketTypeId.tempEntities,
		PacketTypeId.entityMessage
	] : [];
	return state;
};

const handler = PacketMessageHandler;

function parser(stream) {
	const result = handler.parseMessage(stream, getParserState(true));
	delete result.rawData;
	return result;
}

function encoder(message, stream) {
	handler.encodeMessage(message, stream, getParserState(false));
}

suite('Packet', () => {
	test('Parse packet message', () => {
		assertParser(parser, getStream(data), expected, 4264);
	});

	test('Encode packet message', () => {
		// shorted since empty entity list encoded, instead of skipping over entities
		assertEncoder(parser, encoder, expected, 920, '');
	});

	test('Encode first packet message', () => {
		const expected = parser(new BitStream(firstPacketData));
		assertEncoder(parser, encoder, expected, 1032952, '');
	});

	test('Re-encode first packet message', () => {
		assertReEncode(parser, encoder, new BitStream(firstPacketData));
	});
});
