var parseGameEvent = function (eventId, stream, events) {
	if (!events[eventId]) {
		return 'unknown';
	}
	var eventDescription = events[eventId];
	var values = {};
	for (var i = 0; i < eventDescription.entries.length; i++) {
		var entry = eventDescription.entries[i];
		values[entry.name] = getGameEventValue(stream, entry);
	}
	return {
		name  : eventDescription.name,
		type  : eventDescription.type,
		values: values
	};
};

var getGameEventValue = function (stream, entry) {
	switch (entry.type) {
		case 1:
			return stream.readUTF8String();
		case 2:
			return stream.readFloat32();
		case 3:
			return stream.readInt32();
		case 4:
			return stream.readBits(16);
		case 5:
			return stream.readBits(8);
		case 6:
			return !!stream.readBits(1);
		case 7:
			return 'local value';
		default:
			throw 'invalid game event type';
	}
};


module.exports = function (stream, events) { // 25: game event
	var length = stream.readBits(11);
	var end = stream._index + length;
	var eventId = stream.readBits(9);
	var event = parseGameEvent(eventId, stream, events);
	stream._index = end;
	return {
		packetType: 'gameEvent',
		event     : event
	}
};
