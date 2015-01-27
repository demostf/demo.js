var ConsoleCmd = function (type, tick, stream, length) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
};

ConsoleCmd.prototype.parse = function () {
	var cmd = this.stream.readUTF8String();
	//console.log("cmd " + cmd);
	return cmd;
};

module.exports = ConsoleCmd;
