"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function make(name, definition, nameKey = 'packetType', extraData = {}) {
    const parts = definition.split('}');
    const items = parts.map((part) => {
        return part.split('{');
    }).filter((part) => part[0]);
    const parser = (stream) => {
        const result = Object.assign({}, extraData);
        result[nameKey] = name;
        try {
            for (const group of items) {
                const value = readItem(stream, group[1], result);
                if (group[0] !== '_') {
                    result[group[0]] = value;
                }
            }
        }
        catch (e) {
            throw new Error('Failed reading pattern ' + definition + '. ' + e);
        }
        return result;
    };
    const encoder = (packet, stream) => {
        for (const group of items) {
            writeItem(stream, group[1], packet, packet[group[0]]);
        }
    };
    return { parser, encoder, name };
}
exports.make = make;
function readItem(stream, description, data) {
    if (description[0] === 'b') {
        return stream.readBoolean();
    }
    else if (description[0] === 's') {
        if (description.length === 1) {
            return stream.readUTF8String();
        }
        else {
            const length = parseInt(description.substr(1), 10);
            return stream.readASCIIString(length);
        }
    }
    else if (description === 'f32') {
        return stream.readFloat32();
    }
    else if (description[0] === 'u') {
        const length = parseInt(description.substr(1), 10);
        return stream.readBits(length);
    }
    else if (description[0] === '$' && description.substr(description.length - 2) === '*8') {
        const variable = description.substr(1, description.length - 3);
        return stream.readBitStream(data[variable] * 8);
    }
    else if (description[0] === '$') {
        const variable = description.substr(1);
        return stream.readBitStream(data[variable]);
    }
    else {
        return stream.readBits(parseInt(description, 10), true);
    }
}
function writeItem(stream, description, data, value) {
    if (description[0] === 'b') {
        return stream.writeBoolean(value);
    }
    else if (description[0] === 's') {
        if (description.length === 1) {
            return stream.writeUTF8String(value);
        }
        else {
            const length = parseInt(description.substr(1), 10);
            return stream.writeUTF8String(value, length);
        }
    }
    else if (description === 'f32') {
        return stream.writeFloat32(value);
    }
    else if (description[0] === 'u') {
        const length = parseInt(description.substr(1), 10);
        return stream.writeBits(value, length);
    }
    else if (description[0] === '$' && description.substr(description.length - 2) === '*8') {
        const variable = description.substr(1, description.length - 3);
        return stream.writeBitStream(value, data[variable] * 8);
    }
    else if (description[0] === '$') {
        const variable = description.substr(1);
        return stream.writeBitStream(value, data[variable]);
    }
    else {
        return stream.writeBits(value, parseInt(description, 10));
    }
}
//# sourceMappingURL=ParserGenerator.js.map