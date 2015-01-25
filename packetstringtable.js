var PacketStringTable = function (name, maxEntries, entryBits, userDataFixedSize, userDataSize, userDataSizeBits, numEntries) {
	this.name = name;
	this.maxEntries = maxEntries;
	this.entryBits = entryBits;
	this.userDataFixedSize = userDataFixedSize;
	this.userDataSize = userDataSize;
	this.userDataSizeBits = userDataSizeBits;
	this.numEntries = numEntries;
	this.id = PacketStringTable.tables.length;
	this.strings = [];
	PacketStringTable.tables.push(this);
};

PacketStringTable.prototype.parse = function (stream) {
	var entryIndex, lastEntry = -1;
	for (var i = 0; i < this.numEntries; i++) {
		entryIndex = lastEntry + 1;
		this.strings.push(stream.readASCIIString());
		//if (!stream.readBits(1)) {
		//	entryIndex = stream.readBits(this.entryBits);
		//}
		//lastEntry = entryIndex;
		//if (entryIndex < 0 || entryIndex >= this.maxEntries) {
		//	throw 'invalid index';
		//}
		//var string = '';
		//if (stream.readBits(1)) {
		//	if (stream.readBits(1)) {
		//		throw 'substr not implented';
		//	} else {
		//		string = stream.readASCIIString();
		//	}
		//}

		if (stream.readBits(1)) { //user data
			if (this.userDataFixedSize) {
				var userData = stream.readBits(this.userDataSizeBits)
			} else {
				var bits = stream.readBits(14);
				userData = stream.readBits(bits);
			}
			console.log('userdata: ' + userData);
		}

		//this.strings.push(string);
	}
};

PacketStringTable.tables = [];

module.exports = PacketStringTable;
