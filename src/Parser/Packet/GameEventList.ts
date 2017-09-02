import {BitStream} from 'bit-buffer';
import {GameEventDefinition, GameEventEntry} from '../../Data/GameEvent';
import {GameEventListPacket} from '../../Data/Packet';
import {GameEvent} from '../../Data/GameEventTypes';

export function ParseGameEventList(stream: BitStream): GameEventListPacket { // 30: gameEventList
	const s = stream.index;

	// list of game events and parameters
	const numEvents = stream.readBits(9);
	const length = stream.readBits(20);
	const eventList: Map<number, GameEventDefinition<GameEvent['name']>> = new Map();
	for (let i = 0; i < numEvents; i++) {
		const id = stream.readBits(9);
		const name = stream.readASCIIString() as GameEvent['name'];
		let type = stream.readBits(3);
		const entries: GameEventEntry[] = [];
		while (type !== 0) {
			entries.push({
				type,
				name: stream.readASCIIString(),
			});
			type = stream.readBits(3);
		}
		eventList.set(id, {
			id,
			name,
			entries,
		});
	}
	return {
		packetType: 'gameEventList',
		eventList,
	};
}

export function EncodeGameEventList(packet: GameEventListPacket, stream: BitStream) {
	const definitions = Array.from(packet.eventList.values());
	stream.writeBits(definitions.length, 9);

	const eventListBitLength = getEventListLength(definitions);
	const eventListStream = new BitStream(new ArrayBuffer(Math.ceil(eventListBitLength / 8)));

	for (const definition of definitions) {
		eventListStream.writeBits(definition.id, 9);
		eventListStream.writeASCIIString(definition.name);
		for (const entry of definition.entries) {
			eventListStream.writeBits(entry.type, 3);
			eventListStream.writeASCIIString(entry.name);
		}
		eventListStream.writeBits(0, 3);
	}

	const finalLength = eventListStream.index;
	stream.writeBits(finalLength, 20);

	eventListStream.index = 0;
	stream.writeBitStream(eventListStream);
}

function getEventListLength(eventList: GameEventDefinition<GameEvent['name']>[]) {
	return eventList.reduce((length: number, entry: GameEventDefinition<GameEvent['name']>) => {
		return length +
			9 +
			(entry.name.length + 1) * 8 +
			3 +
			entry.entries.reduce((length: number, event: GameEventEntry) => {
				return length +
					3
					+ (event.name.length + 1) * 8;
			}, 0);
	}, 0);
}
