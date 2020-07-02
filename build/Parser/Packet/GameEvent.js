"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameEvent_1 = require("../../Data/GameEvent");
function parseGameEvent(definition, stream) {
    const values = {};
    for (const entry of definition.entries) {
        const value = getGameEventValue(stream, entry);
        if (value !== null) {
            values[entry.name] = value;
        }
    }
    const name = definition.name;
    return {
        name,
        values
    };
}
function encodeGameEvent(event, definition, stream) {
    for (const entry of definition.entries) {
        const value = event.values[entry.name];
        if (typeof value === 'undefined') {
            throw new Error('empty event value');
        }
        else {
            encodeGameEventValue(value, stream, entry);
        }
    }
}
function getGameEventValue(stream, entry) {
    switch (entry.type) {
        case GameEvent_1.GameEventValueType.STRING:
            return stream.readUTF8String();
        case GameEvent_1.GameEventValueType.FLOAT:
            return stream.readFloat32();
        case GameEvent_1.GameEventValueType.LONG:
            return stream.readUint32();
        case GameEvent_1.GameEventValueType.SHORT:
            return stream.readUint16();
        case GameEvent_1.GameEventValueType.BYTE:
            return stream.readUint8();
        case GameEvent_1.GameEventValueType.BOOLEAN:
            return stream.readBoolean();
        case GameEvent_1.GameEventValueType.LOCAL:
            return null;
    }
}
function encodeGameEventValue(value, stream, entry) {
    switch (entry.type) {
        case GameEvent_1.GameEventValueType.STRING:
            if (typeof value !== 'string') {
                throw new Error(`Invalid value for game event, expected string got ${typeof value}`);
            }
            return stream.writeASCIIString(value);
        case GameEvent_1.GameEventValueType.FLOAT:
            if (typeof value !== 'number') {
                throw new Error(`Invalid value for game event, expected number got ${typeof value}`);
            }
            return stream.writeFloat32(value);
        case GameEvent_1.GameEventValueType.LONG:
            if (typeof value !== 'number') {
                throw new Error(`Invalid value for game event, expected number got ${typeof value}`);
            }
            return stream.writeUint32(value);
        case GameEvent_1.GameEventValueType.SHORT:
            if (typeof value !== 'number') {
                throw new Error(`Invalid value for game event, expected number got ${typeof value}`);
            }
            return stream.writeUint16(value);
        case GameEvent_1.GameEventValueType.BYTE:
            if (typeof value !== 'number') {
                throw new Error(`Invalid value for game event, expected number got ${typeof value}`);
            }
            return stream.writeUint8(value);
        case GameEvent_1.GameEventValueType.BOOLEAN:
            if (typeof value !== 'boolean') {
                throw new Error(`Invalid value for game event, expected boolean got ${typeof value}`);
            }
            return stream.writeBoolean(value);
    }
}
function ParseGameEvent(stream, state) {
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
        event: event
    };
}
exports.ParseGameEvent = ParseGameEvent;
function EncodeGameEvent(packet, stream, state) {
    const lengthStart = stream.index;
    stream.index += 11;
    const eventId = state.eventDefinitionTypes.get(packet.event.name);
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
exports.EncodeGameEvent = EncodeGameEvent;
//# sourceMappingURL=GameEvent.js.map