var DataTable = function (type, tick, stream, length, match) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
	this.match = match;
};

DataTable.prototype.parse = function () {
	//while (this.stream.byteIndex < this.length) {
	//	console.log(this.stream.readASCIIString());
	//}
	return [];
};

module.exports = DataTable;
