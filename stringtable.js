var StringTable = function (type, tick, stream, length) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
};

StringTable.prototype.parse = function () {
	var tableCount = this.stream.readBits(8);
	var tables = {};
	try {
		for (var i = 0; i < tableCount; i++) {
			var entries = [];
			var tableName = this.stream.readASCIIString();
			var entryCount = this.stream.readBits(16);
			for (var j = 0; j < entryCount; j++) {
				var entry = {
					text: this.stream.readASCIIString()
				};
				if (this.stream.readBits(1)) {
					var extraDataLength = this.stream.readBits(16);
					entry.extraData = this.stream.readASCIIString(extraDataLength);
				}
				entries.push(entry);
			}
			tables[tableName] = entries;
			if (this.stream.readBits(1)) {
				console.log(this.stream.readASCIIString());
				if (this.stream.readBits(1)) {
					//throw 'more extra data not implemted';
					var extraDataLength = this.stream.readBits(16);
					this.stream.readBits(extraDataLength);
				}
			}
		}
	}catch(e){}
	//console.log(tables);
	return [{
		packetType: 'stringTable',
		tables    : tables
	}];
};

module.exports = StringTable;
