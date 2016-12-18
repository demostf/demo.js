var PacketStringTable = require('../../packetstringtable');

module.exports = function (stream) { // 12: updateStringTable
	var stringTable = new PacketStringTable(stream);
	var tables = stringTable.parse();
	return {
		packetType: 'updateStringTable',
		table     : tables
	};
};
