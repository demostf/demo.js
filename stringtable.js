var BitStream = require('bit-buffer').BitStream;

var StringTable = function (type, tick, stream, length, match) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
	this.match = match;
};

StringTable.prototype.parse = function () {
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/ST/StringTableParser.cs
	var tableCount = this.stream.readUint8();
	var tables = {};
	var extraDataLength;
	for (var i = 0; i < tableCount; i++) {
		var entries = [];
		var tableName = this.stream.readASCIIString();
		var entryCount = this.stream.readUint16();
		for (var j = 0; j < entryCount; j++) {
			try {
				var entry = {
					text: this.stream.readUTF8String()
				};
			} catch (e){
				return [{
					packetType: 'stringTable',
					tables    : tables
				}];
			}
			if (this.stream.readBits(1)) {
				extraDataLength = this.stream.readUint16();
				if (tableName === 'instancebaseline') {
					this.match.staticBaseLines[parseInt(entry.text, 10)] = this.stream.readBitStream(8 * extraDataLength);
				} else {
					entry.extraData = this.readExtraData(extraDataLength);
				}
			}
			entries.push(entry);
		}
		tables[tableName] = entries;
		this.match.stringTables.push({
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

StringTable.prototype.readExtraData = function (length) {
	var end = this.stream._index + (length * 8);
	var data = [];
	//console.log(this.stream.readUTF8String());
	data.push(this.stream.readUTF8String());
	while (this.stream._index < end) {
		try {
			var string = this.stream.readUTF8String();
		} catch (e) {
			return data;
		}
		if (string) {
			data.push(string);
		}
	}
	this.stream._index = end;
	return data;
};

module.exports = StringTable;
