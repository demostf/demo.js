import {BitStream} from 'bit-buffer';
import {assertEncoder} from '../Packet/PacketTest';
import {ConsoleCmdHandler} from '../../../../Parser/Message/ConsoleCmd';
import {ParserState} from '../../../../Data/ParserState';
import {MessageType} from '../../../../Data/Message';

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
