var PacketStringTable = require('../../packetstringtable');

module.exports = function (stream) { // 12: createStringTable
	var stringTable = new PacketStringTable(stream);
	var tables = stringTable.parse();
	return {
		packetType: 'createStringTable',
		table     : tables
	};
};
