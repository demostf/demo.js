module.exports = function (stream) { // 17: parseSounds
	var reliable = !!stream.readBits(1);
	var num = (reliable) ? 1 : stream.readBits(8);
	var length = (reliable) ? stream.readBits(8) : stream.readBits(16);
	stream._index += length;
	return {
		packetType: 'parseSounds',
		reliable  : reliable,
		num       : num,
		length    : length
	}
};
