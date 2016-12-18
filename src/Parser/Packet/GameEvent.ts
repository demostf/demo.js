import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {
	GameEventType, GameEventValue, GameEventEntry, GameEventDefinition, GameEvent as IGameEvent,
	GameEventValueMap, GameEventDefinitionMap
} from "../../Data/GameEvent";
import {Match} from "../../Data/Match";

const parseGameEvent = function (eventId: number, stream: BitStream, events: GameEventDefinitionMap): IGameEvent|null {
	if (!events[eventId]) {
		return null;
	}
	const eventDescription: GameEventDefinition = events[eventId];
	const values: GameEventValueMap             = {};
	for (let i = 0; i < eventDescription.entries.length; i++) {
		const entry: GameEventEntry = eventDescription.entries[i];
		const value                 = getGameEventValue(stream, entry);
		if (value) {
			values[entry.name] = value;
		}
	}
	return {
		name:   eventDescription.name,
		values: values
	};
};

const getGameEventValue = function (stream: BitStream, entry: GameEventEntry): GameEventValue|null {
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
};


export function GameEvent(stream: BitStream, match: Match): Packet { // 25: game event
	const length  = stream.readBits(11);
	const end     = stream._index + length;
	const eventId = stream.readBits(9);
	const event   = parseGameEvent(eventId, stream, match.eventDefinitions);
	stream._index = end;
	return {
		packetType: 'gameEvent',
		event:      event
	}
}
