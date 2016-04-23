var UserCMD = function (type, tick, stream, length, match) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
	this.match = match;
};

UserCMD.prototype.parse = function () {
	return [];
};

module.exports = UserCMD;
