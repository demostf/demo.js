module.exports = function (stream, events) { // 30: gameEventList
	// list of game events and parameters
	var numEvents = stream.readBits(9);
	var length = stream.readBits(20);
	for (var i = 0; i < numEvents; i++) {
		var id = stream.readBits(9);
		var name = stream.readASCIIString();
		var type = stream.readBits(3);
		var entries = [];
		while (type !== 0) {
			var entryName = stream.readASCIIString();
			entries.push({
				type: type,
				name: entryName
			});
			type = stream.readBits(3);
		}
		events[id] = {
			id     : id,
			name   : name,
			type   : type,
			entries: entries
		};
	}
	return {
		packetType: 'gameEventList',
		events    : events
	}
};
