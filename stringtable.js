var StringTable = function (type, tick, stream, length) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
};

StringTable.tables = [];

StringTable.prototype.parse = function () {
	var tableCount = this.stream.readBits(8);
	var tables = {};
	var extraDataLength;
	for (var i = 0; i < tableCount; i++) {
		var entries = [];
		var tableName = this.stream.readASCIIString();
		var entryCount = this.stream.readBits(16);
		for (var j = 0; j < entryCount; j++) {
			var entry = {
				text: this.stream.readUTF8String()
			};
			if (this.stream.readBits(1)) {
				extraDataLength = this.stream.readBits(16);
				//if (tableName === 'userinfo') {
				//	entry.extraData = this.parsePlayerInfo(extraDataLength);
				//} else {
					entry.extraData = this.stream.readUTF8String(extraDataLength);
				//}
				//console.log(entry.extraData.length-extraDataLength);
			}
			entries.push(entry);
		}
		tables[tableName] = entries;
		StringTable.tables.push({
			name   : tableName,
			entries: entries
		});
		if (this.stream.readBits(1)) {
			this.stream.readASCIIString();
			if (this.stream.readBits(1)) {
				//throw 'more extra data not implemented';
				extraDataLength = this.stream.readBits(16);
				this.stream.readBits(extraDataLength);
			}
		}
	}
	//console.log(tables);
	return [{
		packetType: 'stringTable',
		tables    : tables
	}];
};

StringTable.prototype.parsePlayerInfo = function (length) {
	var pos = this.stream._index;
	var name = this.stream.readUTF8String(128);
	console.log(length);
	//if (name === 'Icewind') {
		console.log(name);
		var userId = this.stream.readBits(32);
		console.log(userId);
		var guid = this.stream.readASCIIString(33);
		console.log('guid: ' + guid);
		//console.log(this.stream.readASCIIString(33));
		//console.log(this.stream.readASCIIString());
		//throw false;
	//}
	this.stream._index = pos + (length * 8);
};

module.exports = StringTable;
