import * as assert from 'assert';
import {readFileSync, createWriteStream, createReadStream} from 'fs';
import {Demo} from '../../Demo';
import {Packet} from '../../Data/Packet';
import {BitStream} from 'bit-buffer';
import * as split2 from 'split2';
import {createUnzip, createGunzip} from 'zlib';
import {PassThrough} from 'stream';

function writeEntities(name: string) {
	const targetFile = `${__dirname}/../data/${name}_entities.json`;
	const source = readFileSync(`${__dirname}/../data/${name}.dem`);
	const demo = Demo.fromNodeBuffer(source);
	const parser = demo.getParser(false);
	parser.readHeader();
	const match = parser.match;

	const writeStream = createWriteStream(targetFile, 'utf8');

	parser.on('packet', (packet: Packet) => {
		if (packet.packetType === 'packetEntities') {
			for (const entity of packet.entities) {
				const entityProps = {};
				for (const prop of entity.props) {
					entityProps[`${prop.definition.name}`] = prop.value;
				}
				writeStream.write(JSON.stringify({
					tick: match.tick,
					serverClass: entity.serverClass.name,
					id: entity.entityIndex,
					props: entityProps,
					pvs: entity.pvs
				}) + '\n');
			}
		}
	});
	parser.parseBody();

	writeStream.end();
}

function testEntities(name: string, entityCount: number) {
	return new Promise((resolve, reject) => {
		const targetFile = `${__dirname}/../data/${name}_entities.json.gz`;
		const source = readFileSync(`${__dirname}/../data/${name}.dem`);
		const demo = Demo.fromNodeBuffer(source);
		const parser = demo.getParser(false);
		parser.readHeader();
		const match = parser.match;

		const resultData: any[] = [];
		parser.on('packet', (packet: Packet) => {
			if (packet.packetType === 'packetEntities') {
				for (const entity of packet.entities) {
					const entityProps = {};
					for (const prop of entity.props) {
						entityProps[`${prop.definition.name}`] = prop.value;
					}
					resultData.push({
						tick: match.tick,
						serverClass: entity.serverClass.name,
						id: entity.entityIndex,
						props: entityProps,
						pvs: entity.pvs
					});
				}
			}
		});

		function parseEntities() {
			const message = parser.tick();
			if (message && resultData.length === 0) {
				parseEntities();
			}
		}

		const readStream = createReadStream(targetFile);

		let parsed = 0;

		readStream
			.pipe(createUnzip())
			.pipe(split2(JSON.parse)).on('data', (data) => {
			if (resultData.length < 1) {
				parseEntities();
			}
			const result = resultData.shift();
			assert.deepEqual(data, result, `Failed asserting that packet ${parsed} is the same`);
			parsed++;
		}).on('end', () => {
			assert.equal(resultData.length, 0, 'Entities left to be checked');
			assert.equal(parsed, entityCount, 'unexpected number of entities');

			resolve();
		}).on('error', err => {
			reject(err);
		});
	});
}

suite('Parse all demo entities', () => {
	test('Parse snakewater.dem', () => {
		return testEntities('snakewater', 578869);
	});
	test('Parse post MyM POV demo', () => {
		return testEntities('pov2', 1066826);
	});
});
