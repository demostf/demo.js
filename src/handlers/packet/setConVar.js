module.exports= function (stream) { // 5: setconvar
	var count = stream.readBits(8);
	var vars = {};
	for (var i = 0; i < count; i++) {
		vars[stream.readUTF8String()] = stream.readUTF8String();
	}
	return {
		packetType: 'setConVar',
		vars      : vars
	}
};
