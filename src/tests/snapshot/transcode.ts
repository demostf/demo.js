import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {readFileSync, statSync, writeFileSync} from 'fs';
import {Analyser} from '../../Analyser';
import {Packet} from '../../Data/Packet';
import {DynamicBitStream} from '../../DynamicBitStream';
import {Encoder} from '../../Encoder';
import {Parser} from '../../Parser';
import {MessageTransform, nullTransform, PacketTransform, Transformer} from '../../Transformer';

function testDemo(name: string, packetTransform: PacketTransform, messageTransform: MessageTransform) {
	const decodeStream = new BitStream(
		readFileSync(`${__dirname}/../data/${name}.dem`).buffer as ArrayBuffer
	);

	const parser = new Parser(decodeStream);
	const analyser = new Analyser(parser);
	const original = analyser.getBody().getState();
	decodeStream.index = 0;

	const encodeStream = new DynamicBitStream(32 * 1024 * 1024);

	const transformer = new Transformer(decodeStream, encodeStream);
	transformer.transform(packetTransform, messageTransform);

	const encodedLength = encodeStream.index;
	encodeStream.index = 0;

	const reParser = new Parser(encodeStream);
	const reAnalyser = new Analyser(reParser);
	const parsed = reAnalyser.getBody().getState();

	const reParsedLength = encodeStream.index;

	encodeStream.index = 0;
	writeFileSync('fly.dem', encodeStream.readArrayBuffer(Math.ceil(encodedLength / 8)));

	assert.equal(reParsedLength, encodedLength, 'Unexpected number of bits used when parsing encoding stream');

	assert.deepEqual(parsed, original);
}

function testCompareMessages(name: string) {
	const decodeStream = new BitStream(
		readFileSync(`${__dirname}/../data/${name}.dem`).buffer as ArrayBuffer
	);

	const parser = new Parser(decodeStream);

	const encodeBuffer = new ArrayBuffer(32 * 1024 * 1024);
	const encodeStream = new BitStream(encodeBuffer);
	const reParseStream = new BitStream(encodeBuffer);
	const encoder = new Encoder(encodeStream);
	const reParser = new Parser(reParseStream);

	encoder.encodeHeader(parser.getHeader());

	const messages = parser.getMessages();
	// we always need to encode one message ahead of the re-parser
	let lastMessage = messages.next().value;
	encoder.writeMessage(lastMessage);
	const reParsedMessages = reParser.getMessages();

	for (const message of messages) {
		encoder.writeMessage(message);
		const reParsedMessage = reParsedMessages.next().value;
		assert.deepEqual(removeBitStreams(reParsedMessage), removeBitStreams(lastMessage));

		lastMessage = message;
	}
}

// can't deep compare bitstreams properly
function removeBitStreams(object: {}) {
	const result = {};
	for (const key in object) {
		if (object.hasOwnProperty(key)) {
			if (object[key] instanceof BitStream) {
				// skip
			} else if (object[key] instanceof Object) {
				result[key] = removeBitStreams(object[key]);
			} else {
				result[key] = object[key];
			}
		}
	}
	return result;
}

suite('Transcode demo basic test', () => {
	test('Noop transcode', () => {
		testDemo('short', nullTransform, nullTransform);
	});
});

suite('Transcode demo message compare', () => {
	test('Noop transcode', () => {
		testCompareMessages('short');
	});
});
