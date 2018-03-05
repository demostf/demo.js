import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {createReadStream, createWriteStream, readFileSync} from 'fs';
import * as split2 from 'split2';
import {PassThrough} from 'stream';
import {createGunzip, createUnzip} from 'zlib';
import {Packet} from '../../Data/Packet';
import {EntityId, PVS} from '../../Data/PacketEntity';
import {SendPropValue} from '../../Data/SendProp';
import {Demo, ParseMode} from '../../Demo';

interface ResultData {
	tick: number;
	serverClass: string;
	id: EntityId;
	props: {[propName: string]: SendPropValue};
	pvs: PVS;
}

function writeEntities(name: string) {
	const targetFile = `${__dirname}/../data/${name}_entities.json`;
	const source = readFileSync(`${__dirname}/../data/${name}.dem`);
	const demo = Demo.fromNodeBuffer(source);
	const parser = demo.getParser(ParseMode.COMPLETE);

	const resultData = getResultData(parser.getPackets());

	const writeStream = createWriteStream(targetFile);

	for (const result of resultData) {
		writeStream.write(JSON.stringify(result) + '\n', 'utf8');
	}

	writeStream.end();
}

function* getResultData(packets: Iterable<Packet>): IterableIterator<ResultData> {
	let tick = 0;

	for (const packet of packets) {
		if (packet.packetType === 'netTick') {
			tick = packet.tick;
		}
		if (packet.packetType === 'packetEntities') {
			for (const entity of packet.entities) {
				const entityProps = {};
				for (const prop of entity.props) {
					entityProps[`${prop.definition.name}`] = prop.value;
				}
				yield {
					tick,
					serverClass: entity.serverClass.name,
					id: entity.entityIndex,
					props: entityProps,
					pvs: entity.pvs
				};
			}
		}
	}
}

function testEntities(name: string, entityCount: number) {
	return new Promise((resolve, reject) => {
		const targetFile = `${__dirname}/../data/${name}_entities.json.gz`;
		const source = readFileSync(`${__dirname}/../data/${name}.dem`);
		const demo = Demo.fromNodeBuffer(source);
		const parser = demo.getParser(ParseMode.COMPLETE);

		const resultData = getResultData(parser.getPackets());

		const readStream = createReadStream(targetFile);

		let parsed = 0;

		readStream
			.pipe(createUnzip())
			.pipe(split2(JSON.parse)).on('data', (data) => {
			const result = resultData.next();
			assert.deepEqual(data, result.value, `Failed asserting that packet ${parsed} is the same`);
			parsed++;
		}).on('end', () => {
			assert.equal(parsed, entityCount, 'unexpected number of entities');

			resolve();
		}).on('error', (err) => {
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
