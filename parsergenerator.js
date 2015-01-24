var Generator = {};

Generator.make = function (name, string) {
	var parts = string.substr(0, string.length - 1).split('}');//remove leading } to prevent empty part
	var items = parts.map(function (part) {
		return part.split('{');
	});
	return function (stream) {
		var result = {
			'packetType': name
		};
		try {
			for (var i = 0; i < items.length; i++) {
				result[items[i][0]] = Generator.readItem(stream, items[i][1], result);
			}
		} catch (e) {
			throw 'Failed reading pattern ' + string;
		}
		return result;
	}
};

Generator.readItem = function (stream, description, data) {
	var length;
	if (description[0] === 'b') {
		return !!stream.readBits(1);
	} else if (description[0] === 's') {
		if (description.length === 1) {
			return stream.readASCIIString();
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

module.exports = Generator;
