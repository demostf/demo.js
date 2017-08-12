import {Packet} from '../../Data/Packet';
import {PacketHandler} from './Parser';
import {BitStream} from 'bit-buffer';

export function make(name: string, definition: string): PacketHandler {
	const parts = definition.split('}');
	const items = parts.map((part) => {
		return part.split('{');
	}).filter(part => part[0]);
	return {
		parser: (stream) => {
			const result = {
				packetType: name,
			};
			try {
				for (const group of items) {
					const value = readItem(stream, group[1], result);
					if (group[0] !== '_') {
						result[group[0]] = value;
					}
				}
			} catch (e) {
				throw new Error('Failed reading pattern ' + definition + '. ' + e);
			}
			return result as Packet;
		},
		encoder: (packet, stream) => {
			for (const group of items) {
				writeItem(stream, group[1], packet, packet[group[0]]);
			}
		}
	};
}

function readItem(stream: BitStream, description: string, data) {
	if (description[0] === 'b') {
		return stream.readBoolean();
	} else if (description[0] === 's') {
		if (description.length === 1) {
			return stream.readUTF8String();
		} else {
			const length = parseInt(description.substr(1), 10);
			return stream.readASCIIString(length);
		}
	} else if (description === 'f32') {
		return stream.readFloat32();
	} else if (description[0] === 'u') {
		const length = parseInt(description.substr(1), 10);
		return stream.readBits(length);
	} else if (description[0] === '$') {
		const variable = description.substr(1);
		return stream.readBits(data[variable]);
	} else {
		return stream.readBits(parseInt(description, 10), true);
	}
}

function writeItem(stream: BitStream, description: string, data, value: boolean | string | number) {
	if (description[0] === 'b') {
		return stream.writeBoolean(value as boolean);
	} else if (description[0] === 's') {
		if (description.length === 1) {
			return stream.writeUTF8String(value as string);
		} else {
			const length = parseInt(description.substr(1), 10);
			return stream.writeUTF8String(value as string, length);
		}
	} else if (description === 'f32') {
		return stream.writeFloat32(value as number);
	} else if (description[0] === 'u') {
		const length = parseInt(description.substr(1), 10);
		return stream.writeBits(value as number, length);
	} else if (description[0] === '$') {
		const variable = description.substr(1);
		return stream.writeBits(value as number, data[variable]);
	} else {
		return stream.writeBits(value as number, parseInt(description, 10));
	}
}
