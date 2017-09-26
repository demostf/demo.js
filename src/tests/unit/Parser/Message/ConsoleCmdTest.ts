import {BitStream} from 'bit-buffer';
import {MessageType} from '../../../../Data/Message';
import {ParserState} from '../../../../Data/ParserState';
import {ConsoleCmdHandler} from '../../../../Parser/Message/ConsoleCmd';
import {assertEncoder} from '../Packet/PacketTest';

function parse(stream) {
	const result = ConsoleCmdHandler.parseMessage(stream, new ParserState());
	delete result.rawData;
	return result;
}

suite('ConsoleCmd', () => {
	test('Encode ConsoleCmd message', () => {
		assertEncoder(parse, ConsoleCmdHandler.encodeMessage, {
			type: MessageType.ConsoleCmd,
			tick: 1234,
			command: 'foobar'
		}, 120);
	});

	test('Encode ConsoleCmd message unicode', () => {
		assertEncoder(parse, ConsoleCmdHandler.encodeMessage, {
			type: MessageType.ConsoleCmd,
			tick: 1234,
			command: 'smile☺'
		}, 136);
	});
});
