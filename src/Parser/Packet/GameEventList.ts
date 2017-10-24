import {BitStream} from 'bit-buffer';
import {GameEventDefinition, GameEventEntry} from '../../Data/GameEvent';
import {GameEvent, GameEventType} from '../../Data/GameEventTypes';
import {GameEventListPacket} from '../../Data/Packet';

export function ParseGameEventList(stream: BitStream): GameEventListPacket { // 30: gameEventList
	// list of game events and parameters
	const numEvents = stream.readBits(9);

	const length = stream.readBits(20);
	const listData = stream.readBitStream(length);
	const eventList: Map<number, GameEventDefinition<GameEventType>> = new Map();
	for (let i = 0; i < numEvents; i++) {
		const id = listData.readBits(9);
		const name = listData.readASCIIString() as GameEvent['name'];
		let type = listData.readBits(3);
		const entries: GameEventEntry[] = [];
		while (type !== 0) {
			entries.push({
				type,
				name: listData.readASCIIString()
			});
			type = listData.readBits(3);
		}
		eventList.set(id, {
			id,
			name,
			entries
		});
	}

	return {
		packetType: 'gameEventList',
		eventList
	};
}

export function EncodeGameEventList(packet: GameEventListPacket, stream: BitStream) {
	const definitions = Array.from(packet.eventList.values());
	stream.writeBits(definitions.length, 9);

	const lengthStart = stream.index;
	stream.index += 20;

	const eventListStart = stream.index;

	for (const definition of definitions) {
		stream.writeBits(definition.id, 9);
		stream.writeASCIIString(definition.name);
		for (const entry of definition.entries) {
			stream.writeBits(entry.type, 3);
			stream.writeASCIIString(entry.name);
		}
		stream.writeBits(0, 3);
	}

	const eventListEnd = stream.index;

	stream.index = lengthStart;
	stream.writeBits(eventListEnd - eventListStart, 20);

	stream.index = eventListEnd;
}
