import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from '../Packet/PacketTest';
import {readFileSync} from 'fs';
import {PacketMessageHandler} from '../../../../Parser/Message/Packet';
import {ParserState} from '../../../../Data/ParserState';
import {PacketTypeId} from '../../../../Data/Packet';

const data = Object.values(JSON.parse(readFileSync(__dirname + '/../../../data/packetMessageData.json', 'utf8')));
const expected = JSON.parse(readFileSync(__dirname + '/../../../data/packetMessageResult.json', 'utf8'));

const getParserState = (fastMode) => {
	const state = new ParserState();
	// fast mode allows us not to bother with complicated entity parser state
	state.skippedPackets = fastMode ? [
		PacketTypeId.packetEntities,
		PacketTypeId.tempEntities,
		PacketTypeId.entityMessage,
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
});
