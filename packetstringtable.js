function logBase2(num) {
	var result = 0;
	while ((num >>= 1) != 0) {
		result++;
	}
	return result;
}

var PacketStringTable = function (stream) {
	this.stream = stream;
	this.id = PacketStringTable.tables.length;
	this.strings = [];
	this.numEntries = 0;
	this.name = '';
	PacketStringTable.tables.push(this);
};

PacketStringTable.prototype.parse = function () {
	//todo
	// https://coldemoplayer.googlecode.com/svn/branches/2.0/code/plugins/CDP.Source/Messages/SvcCreateStringTable.cs

	//while (true) {//skip untill userinfo
	//	var pos = this.stream._index;
	//	if (this.stream.readASCIIString() === 'userinfo') {
	//		this.stream._index = pos;
	//		console.log(pos);
	//		break;
	//	}
	//	this.stream._index = pos + 1;
	//}
	//this.stream._index = 442393; // process
	//this.stream._index = 472495;

	//this.name = this.stream.readASCIIString();
	//var maxEntries = this.stream.readBits(16);
	//var bits = logBase2(maxEntries);
	//this.numEntries = this.stream.readBits(bits + 1);
	//var length = this.stream.readBits(20);
	//var userDataFixedSize = this.stream.readBoolean(1);
	//var userSize = 0;
	//var userDataBits = 0;
	//if (userDataFixedSize) {
	//	console.log('fixed');
	//	userSize = this.stream.readBits(12);
	//	userDataBits = this.stream.readBits(4);
	//	console.log(userSize);
	//	console.log(userDataBits);
	//}
	//
	//console.log('table: ' + this.name);
	//console.log('entries: ' + this.numEntries);

	//var pos = this.stream._index;

	var users = this.searchIds();
	//this.stream.index = pos + length;
	return users;

	//start expermiment

	//console.log(this.stream.readBits(2));
	this.stream.readBits(5 + 8 * 8);
	for (i = 0; i < 12; i++) {
		console.log(this.stream.readBits(8));
	}
	console.log(this.stream.readBits(2));
	console.log('name: ' + this.stream.readUTF8String());
	for (i = 0; i < 8; i++) {
		console.log(this.stream.readBits(8));
	}
	console.log('id: ' + this.stream.readUTF8String());
	console.log(this.stream.readBits(8));

	console.log(this.stream.readUTF8String(32));
	// end TV
	// start icewind

	for (i = 0; i < 12; i++) {
		console.log(this.stream.readBits(8));
	}
	console.log(this.stream.readBits(2));
	console.log('name: ' + this.stream.readUTF8String());
	for (i = 0; i < 7; i++) {
		console.log(this.stream.readBits(8));
	}
	console.log('id: ' + this.stream.readASCIIString(14));
	// end icewind
	// start gat

	console.log(this.stream.readBits(8));
	console.log(this.stream.readUTF8String(32));
	//console.log(this.stream.readUTF8String());
	console.log(this.stream.readBits(8 * 9));
	console.log(this.stream.readBits(2));
	//console.log('name: ' + this.stream.readASCIIString());
	for (i = 0; i < 7; i++) {
		console.log(this.stream.readBits(8));
	}
	console.log('id: ' + this.stream.readASCIIString(14));
	//console.log(this.stream.readASCIIString());
	//console.log(this.stream.readASCIIString());
	//console.log(this.stream.readASCIIString());
	//console.log(this.stream.readBits(8));
	//console.log(this.stream.readASCIIString());
	//console.log(this.stream.readBits(2 + 8 * 14));
	//console.log(this.stream.readASCIIString());
	//console.log(this.stream.readBits(7 * 8));
	//console.log(this.stream.readASCIIString());
	//process.exit();

	for (i = 0; i < this.numEntries; i++) {
		var pos = this.stream._index;
		var string = this.stream.readASCIIString();
		console.log('string: "' + string + '"');
		if (string.length > 4) {
			if (string.charCodeAt(2) > 128) {
				this.stream._index = pos;
				this.stream.readBits(1);
				return;
			}
		}
		this.strings.push(string);

		if (this.stream.readBits(1)) { //user data
			if (this.userDataFixedSize) {
				var userData = this.stream.readBits(this.userDataSizeBits)
			} else {
				bits = this.stream.readBits(14);
				userData = this.stream.readASCIIString(bits);
			}
			console.log('userdata: ' + userData);
			//console.log(this.stream.readBits(5));
			//stream.readBits(5);
		}

		//this.strings.push(string);
	}
};

PacketStringTable.prototype.parsePlayerInfo = function () {
	console.log('name: ' + this.stream.readUTF8String());
};

// "fuckit" parsing, look for anything that looks like a steam id, user id is the 32 bit before that
PacketStringTable.prototype.searchIds = function () {
	var validChar = function (charCode) {
		return charCode === 91 || charCode === 93 || charCode === 58 || (charCode > 47 && charCode < 58); // [ ] : 0-9
	};

	console.log('startSearch');
	console.log('length ' + this.stream._view._view.length);
	this.stream.readBits(9);
	var users = {};
	while (true) {
		var found = false;
		while (this.stream._index < ((this.stream._view._view.length - 1) * 8)) {
			var startPos = this.stream._index;
			try {
				if (this.stream.readASCIIString(3) === '[U:') {
					found = true;
					break;
				}
				this.stream._index = startPos + 1;
			} catch (e) {
				break;
			}
		}
		if (!found) {
			console.log(users);
			return users;
		}
		while (validChar(this.stream.readBits(8))) {
			// seek
		}
		var endPos = this.stream._index - 8;
		var length = (endPos / 8) - (startPos / 8);
		this.stream._index = startPos - 32;
		var userId = this.stream.readBits(32);
		var steamId = this.stream.readASCIIString(length);
		if (steamId[steamId.length - 1] !== ']') {
			steamId += ']';
		}
		users[userId] = steamId;
	}
	console.log(users);
	//process.exit();
};

PacketStringTable.tables = [];

module.exports = PacketStringTable;
