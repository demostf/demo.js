import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {readFileSync} from 'fs';
import {gunzipSync} from 'zlib';
import {DataTablesMessage} from '../../../../Data/Message';
import {ParserState} from '../../../../Data/ParserState';
import {ServerClass} from '../../../../Data/ServerClass';
import {DataTableHandler} from '../../../../Parser/Message/DataTable';
import {hydrateTable} from '../Packet/hydrate';
import {assertEncoder, assertParser, getStream} from '../Packet/PacketTest';

const data = Array.from(readFileSync(__dirname + '/../../../data/dataTableData.bin').values());
const expectedRaw = JSON.parse(
	gunzipSync(
		readFileSync(__dirname + '/../../../data/dataTableResult.json.gz'
		)
	).toString('utf8')
) as DataTablesMessage;

const expected = {
	type: expectedRaw.type,
	tick: expectedRaw.tick,
	serverClasses: expectedRaw.serverClasses.map((serverClass) => new ServerClass(serverClass.id, serverClass.name, serverClass.dataTable)),
	tables: expectedRaw.tables.map(hydrateTable)
};

const getParserState = () => {
	return new ParserState();
};

const handler = DataTableHandler;

function parser(stream) {
	const result = handler.parseMessage(stream, getParserState());
	delete result.rawData;
	return result;
}

function encoder(message, stream) {
	handler.encodeMessage(message, stream, getParserState());
}

suite('DataTable', () => {
	test('Parse DataTable message', () => {
		assertParser(parser, getStream(data), expectedRaw, 947888);
	});

	test('Encode DataTable message', () => {
		const length = 947888;
		const stream = new BitStream(new ArrayBuffer(length + 64000));

		encoder(expected, stream);

		const pos = stream.index;

		if (length) {
			assert.equal(stream.index, length, 'Unexpected number of bits used for encoding');
		}

		stream.index = 0;

		const result = parser(stream);
		assert.deepEqual(result.serverClasses, expected.serverClasses, 'Re-decoded value not equal to original value');
		assert.deepEqual(result.tick, expected.tick, 'Re-decoded value not equal to original value');
		assert.deepEqual(result.type, expected.type, 'Re-decoded value not equal to original value');
		for (let i = 0; i < result.tables.length; i++) {
			const resultTable = JSON.parse(JSON.stringify(result.tables[i]));
			const expectedTable = expectedRaw.tables[i];
			assert.deepEqual(resultTable, expectedTable, 'Re-decoded value not equal to original value');
		}
		assert.equal(stream.index, pos, 'Number of bits used for encoding and parsing not equal');
	});
});
