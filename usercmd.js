var UserCMD = function (type, tick, stream, length, viewOrigin, viewAngles) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
	this.viewOrigin = viewOrigin;
	this.viewAngles = viewAngles;
};

UserCMD.prototype.parse = function () {
	return [];
	var divSize = Math.floor((this.length + 2) / 4);
	var byteShift = new Array(3);
	var lastByte = this.stream.readBits(8);
	var TempUCMD = 0;
	for (var i = 1; i < divSize; i++) {
		var byte = this.stream.readBits(8);
		if (i <= 4) {
			byteShift[0] = lastByte >> i;
			byteShift[1] = byte << 32 - i;
		} else {
			byteShift[0] = lastByte >> 9;
			byteShift[1] = byte << 32 - i;
		}
		byteShift[2] = byteShift[0] | byteShift[0];
		if (i == divSize - 1) {
			if (byteShift[2] > 0 && byteShift[2] < 1321100) {
				TempUCMD = byteShift[2];
			} else {
				TempUCMD = null;
			}
		}
		lastByte = byte;
	}
	// console.log('move', this.tick, this.viewOrigin[0][0], this.viewOrigin[0][1], this.viewAngles[0][0], this.viewAngles[0][1], TempUCMD);
	return [];
};

module.exports = UserCMD;
