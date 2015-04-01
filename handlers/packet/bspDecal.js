var getCoord = function (stream) {
	var hasInt = !!stream.readBits(1);
	var hasFract = !!stream.readBits(1);
	var value = 0;
	if (hasInt || hasFract) {
		var sign = !!stream.readBits(1);
		if (hasInt) {
			value += stream.readBits(14) + 1;
		}
		if (hasFract) {
			value += stream.readBits(5) * (1 / 32);
		}
		if (sign) {
			value = -value;
		}
	}
	return value;
};

var getVecCoord = function (stream) {
	var hasX = !!stream.readBits(1);
	var hasY = !!stream.readBits(1);
	var hasZ = !!stream.readBits(1);
	return {
		x: hasX ? getCoord(stream) : 0,
		y: hasY ? getCoord(stream) : 0,
		z: hasZ ? getCoord(stream) : 0
	}
};

module.exports = function (stream) { // 21: BSPDecal
	var position = getVecCoord(stream);
	var textureIndex = stream.readBits(9);
	if (stream.readBits(1)) {
		var entIndex = stream.readBits(11);
		var modelIndex = stream.readBits(12);
	}
	var lowPriority = !!stream.readBits(1);
	return {
		packetType  : 'BSPDecal',
		position    : position,
		textureIndex: textureIndex,
		entIndex    : entIndex,
		modelIndex  : modelIndex,
		lowPriority : lowPriority
	}
};
