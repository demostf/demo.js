function logBase2(num) {
	var result = 0;
	while ((num >>= 1) != 0) {
		result++;
	}
	return result;
}

module.exports = function (stream) { // 10: classInfo
	var number = stream.readBits(16);
	var create = !!stream.readBits(1);
	var entries = [];
	if (!create) {
		var bits = logBase2(number) + 1;
		for (var i = 0; i < number; i++) {
			var entry = {
				'classId'      : stream.readBits(bits),
				'className'    : stream.readASCIIString(),
				'dataTableName': stream.readASCIIString()
			};
			entries.push(entry);
		}
	}
	return {
		'packetType': 'classInfo',
		number      : number,
		create      : create,
		entries     : entries
	}
};
