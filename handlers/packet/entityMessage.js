var ParserGenerator = require('../../parsergenerator');

var baseParser = ParserGenerator.make('entityMessage', 'index{11}classId{9}length{11}data{$length}');

module.exports = function (stream) { // 24: entityMessage
	return baseParser(stream); //todo parse data further?
};
