import {BitStream} from 'bit-buffer';
import {
	GameEventDefinition, GameEventEntry,
	GameEventValue, GameEventValueType,
} from '../../Data/GameEvent';
import {GameEvent, GameEventType} from '../../Data/GameEventTypes';
import {Match} from '../../Data/Match';
import {GameEventPacket} from '../../Data/Packet';

function parseGameEvent(eventId: number, stream: BitStream, events: Map<number, GameEventDefinition<GameEventType>>) {
	const eventDescription = events.get(eventId);
	if (!eventDescription) {
		throw new Error('unknown event type');
	}
	const values: GameEvent['values'] = {};
	for (const entry of eventDescription.entries) {
		const value = getGameEventValue(stream, entry);
		if (value) {
			values[entry.name] = value;
		}
	}
	const name = eventDescription.name;

	return {
		name,
		values,
	};
}

function getGameEventValue(stream: BitStream, entry: GameEventEntry): GameEventValue | null {
	switch (entry.type) {
		case GameEventValueType.STRING:
			return stream.readUTF8String();
		case GameEventValueType.FLOAT:
			return stream.readFloat32();
		case GameEventValueType.LONG:
			return stream.readUint32();
		case GameEventValueType.SHORT:
			return stream.readUint16();
		case GameEventValueType.BYTE:
			return stream.readUint8();
		case GameEventValueType.BOOLEAN:
			return stream.readBoolean();
		case GameEventValueType.LOCAL:
			return null;
	}
}

export function ParseGameEvent(stream: BitStream, match: Match): GameEventPacket { // 25: game event
	const length = stream.readBits(11);
	const end = stream.index + length;
	const eventId = stream.readBits(9);
	const event = parseGameEvent(eventId, stream, match.eventDefinitions);
	stream.index = end;
	return {
		packetType: 'gameEvent',
		event: event as GameEvent,
	};
}
