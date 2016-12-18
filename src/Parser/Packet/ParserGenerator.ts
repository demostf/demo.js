import {Parser} from './Parser';

export function make(name: string, definition: string): Parser {
	var parts = definition.substr(0, definition.length - 1).split('}');//remove leading } to prevent empty part
	var items = parts.map(function (part) {
		return part.split('{');
	});
	return function (stream) {
		var result = {
			'packetType': name
		};
		try {
			for (var i = 0; i < items.length; i++) {
				var value = readItem(stream, items[i][1], result);
				if (items[i][0] !== '_') {
					result[items[i][0]] = value;
				}
			}
		} catch (e) {
			throw 'Failed reading pattern ' + definition + '. ' + e;
		}
		return result;
	}
}

const readItem = function (stream, description, data) {
	var length;
	if (description[0] === 'b') {
		return !!stream.readBits(1);
	} else if (description[0] === 's') {
		if (description.length === 1) {
			return stream.readUTF8String();
		} else {
			length = parseInt(description.substr(1), 10);
			return stream.readASCIIString(length);
		}
	} else if (description === 'f32') {
		return stream.readFloat32();
	} else if (description[0] === 'u') {
		length = parseInt(description.substr(1), 10);
		return stream.readBits(length);
	} else if (description[0] === '$') {
		var variable = description.substr(1);
		return stream.readBits(variable);
	} else {
		return stream.readBits(parseInt(description, 10), true);
	}
};
