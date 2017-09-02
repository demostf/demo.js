import {BitStream} from 'bit-buffer';
import {
	GameEvent as IGameEvent, GameEventDefinition, GameEventEntry, GameEventType,
	GameEventValue, GameEventValueMap,
} from '../../Data/GameEvent';
import {Match} from '../../Data/Match';
import {GameEventPacket} from '../../Data/Packet';

function parseGameEvent(eventId: number, stream: BitStream, events: Map<number, GameEventDefinition>): IGameEvent {
	const eventDescription = events.get(eventId);
	if (!eventDescription) {
		throw new Error('unknown event type');
	}
	const values: GameEventValueMap = {};
	for (const entry of eventDescription.entries) {
		const value = getGameEventValue(stream, entry);
		if (value) {
			values[entry.name] = value;
		}
	}
	return {
		name: eventDescription.name,
		values,
	};
}

function getGameEventValue(stream: BitStream, entry: GameEventEntry): GameEventValue | null {
	switch (entry.type) {
		case GameEventType.STRING:
			return stream.readUTF8String();
		case GameEventType.FLOAT:
			return stream.readFloat32();
		case GameEventType.LONG:
			return stream.readUint32();
		case GameEventType.SHORT:
			return stream.readUint16();
		case GameEventType.BYTE:
			return stream.readUint8();
		case GameEventType.BOOLEAN:
			return stream.readBoolean();
		case GameEventType.LOCAL:
			return null;
		default:
			throw new Error('invalid game event type');
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
		event,
	};
}
