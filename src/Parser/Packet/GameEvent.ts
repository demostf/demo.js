import {BitStream} from 'bit-buffer';
import {
	GameEventDefinition, GameEventEntry,
	GameEventValue, GameEventValueType
} from '../../Data/GameEvent';
import {GameEvent, GameEventType, GameEventTypeIdMap, GameEventTypeMap} from '../../Data/GameEventTypes';
import {GameEventPacket} from '../../Data/Packet';
import {ParserState} from '../../Data/ParserState';

function parseGameEvent<T extends GameEventType>(definition: GameEventDefinition<T>, stream: BitStream) {
	const values: GameEventTypeMap[T]['values'] = {};
	for (const entry of definition.entries) {
		const value = getGameEventValue(stream, entry);
		if (value) {
			values[entry.name] = value;
		}
	}
	const name = definition.name as T;

	return {
		name,
		values
	};
}

function encodeGameEvent<T extends GameEventType>(event: GameEventTypeMap[T], definition: GameEventDefinition<T>, stream: BitStream) {
	for (const entry of definition.entries) {
		const value = event.values[entry.name];
		if (value !== null) {
			encodeGameEventValue(value, stream, entry);
		}
	}
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

function encodeGameEventValue(value: GameEventValue | null, stream: BitStream, entry: GameEventEntry) {
	switch (entry.type) {
		case GameEventValueType.STRING:
			if (typeof value !== 'string') {
				throw new Error(`Invalid value for game event, expected string got ${typeof value}`);
			}
			return stream.writeASCIIString(value);
		case GameEventValueType.FLOAT:
			if (typeof value !== 'number') {
				throw new Error(`Invalid value for game event, expected number got ${typeof value}`);
			}
			return stream.writeFloat32(value);
		case GameEventValueType.LONG:
			if (typeof value !== 'number') {
				throw new Error(`Invalid value for game event, expected number got ${typeof value}`);
			}
			return stream.writeUint32(value);
		case GameEventValueType.SHORT:
			if (typeof value !== 'number') {
				throw new Error(`Invalid value for game event, expected number got ${typeof value}`);
			}
			return stream.writeUint16(value);
		case GameEventValueType.BYTE:
			if (typeof value !== 'number') {
				throw new Error(`Invalid value for game event, expected number got ${typeof value}`);
			}
			return stream.writeUint8(value);
		case GameEventValueType.BOOLEAN:
			if (typeof value !== 'boolean') {
				throw new Error(`Invalid value for game event, expected boolean got ${typeof value}`);
			}
			return stream.writeBoolean(value);
	}
}

export function ParseGameEvent(stream: BitStream, state: ParserState): GameEventPacket { // 25: game event
	const length = stream.readBits(11);
	const eventData = stream.readBitStream(length);
	const eventType = eventData.readBits(9);
	const definition = state.eventDefinitions.get(eventType);
	if (!definition) {
		throw new Error(`Unknown game event type ${eventType}`);
	}
	const event = parseGameEvent(definition, eventData);

	return {
		packetType: 'gameEvent',
		event: event as GameEvent
	};
}

export function EncodeGameEvent(packet: GameEventPacket, stream: BitStream, state: ParserState) {
	const lengthStart = stream.index;
	stream.index += 11;
	const eventId = GameEventTypeIdMap.get(packet.event.name);
	if (typeof eventId === 'undefined') {
		throw new Error(`Unknown game event type ${packet.event.name}`);
	}

	const eventDataStart = stream.index;
	stream.writeBits(eventId, 9);

	const definition = state.eventDefinitions.get(eventId);
	if (typeof definition === 'undefined') {
		throw new Error(`Unknown game event type ${packet.event.name}`);
	}

	encodeGameEvent(packet.event, definition, stream);
	const eventDataEnd = stream.index;

	stream.index = lengthStart;
	stream.writeBits(eventDataEnd - eventDataStart, 11);
	stream.index = eventDataEnd;
}
