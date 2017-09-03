import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';
import {EncodeClassInfo, ParseClassInfo} from '../../../../Parser/Packet/ClassInfo';
import {EncodeGameEvent, ParseGameEvent} from '../../../../Parser/Packet/GameEvent';
import {GameEventPacket} from '../../../../Data/Packet';
import {Match} from '../../../../Data/Match';
import {GameEventTypeIdMap} from '../../../../Data/GameEventTypes';
import {GameEventValueType} from '../../../../Data/GameEvent';

const data = [25, 240, 149, 0, 0];
const expected = {
	packetType: 'gameEvent',
	event: {
		name: 'post_inventory_application',
		values: {userid: 9}
	}
};

const match = new Match();
match.eventDefinitions.set(190, {
	id: 190,
	name: 'post_inventory_application',
	entries: [{
		name: 'userid',
		type: GameEventValueType.SHORT
	}]
});

const parseEvent = (stream: BitStream) => {
	return ParseGameEvent(stream, match);
};

const encodeEvent = (packet: GameEventPacket, stream: BitStream) => {
	EncodeGameEvent(packet, stream, match);
};

suite('GameEvent', () => {
	test('Parse gameEvent', () => {
		assertParser(parseEvent, getStream(data), expected, 36);
	});

	test('Encode gameEvent', () => {
		assertEncoder(parseEvent, encodeEvent, expected, 36);
	});
});
