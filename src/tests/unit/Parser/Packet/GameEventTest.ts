import {BitStream} from 'bit-buffer';
import {GameEventValueType} from '../../../../Data/GameEvent';
import {GameEventPacket} from '../../../../Data/Packet';
import {createParserState} from '../../../../Data/ParserState';
import {EncodeGameEvent, ParseGameEvent} from '../../../../Parser/Packet/GameEvent';
import {assertEncoder, assertParser, assertReEncode, getStream} from './PacketTest';

const data = [25, 240, 149, 0, 0];
const expected = {
	packetType: 'gameEvent',
	event: {
		name: 'post_inventory_application',
		values: {userid: 9}
	}
};

const state = createParserState();
state.eventDefinitions.set(190, {
	id: 190,
	name: 'post_inventory_application',
	entries: [{
		name: 'userid',
		type: GameEventValueType.SHORT
	}]
});
state.eventDefinitionTypes.set('post_inventory_application', 190);

const parseEvent = (stream: BitStream) => {
	return ParseGameEvent(stream, state);
};

const encodeEvent = (packet: GameEventPacket, stream: BitStream) => {
	EncodeGameEvent(packet, stream, state);
};

suite('GameEvent', () => {
	test('Parse gameEvent', () => {
		assertParser(parseEvent, getStream(data), expected, 36);
	});

	test('Encode gameEvent', () => {
		assertEncoder(parseEvent, encodeEvent, expected, 36);
	});

	test('Re-encode gameEvent', () => {
		assertReEncode(parseEvent, encodeEvent, getStream(data));
	});
});
