import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';
import {hydrateEntity, hydrateTable} from './hydrate';
import {ServerClass} from '../../../../Data/ServerClass';
import {PacketEntitiesPacket} from '../../../../Data/Packet';
import {readFileSync} from 'fs';
import {gunzipSync} from 'zlib';
import {EncodePacketEntities, ParsePacketEntities} from '../../../../Parser/Packet/PacketEntities';
import * as assert from 'assert';
import {deepEqual} from '../../deepEqual';
import {createParserState} from '../../../../Data/ParserState';

const data = JSON.parse(readFileSync(__dirname + '/../../../data/packetEntitiesData.json', 'utf8'));
const packetData = JSON.parse(gunzipSync(readFileSync(__dirname + '/../../../data/packetEntitiesResult.json.gz')).toString('utf8'));
const sendTableData = JSON.parse(gunzipSync(readFileSync(__dirname + '/../../../data/packetEntitiesSendTables.json.gz')).toString('utf8'));
const serverClassesData = JSON.parse(readFileSync(__dirname + '/../../../data/packetEntitiesServerClasses.json', 'utf8'));
const baselineData: [number, number[]][] = JSON.parse(readFileSync(__dirname + '/../../../data/packetEntityBaseLines.json', 'utf8'));

const expected: PacketEntitiesPacket = {
	packetType: 'packetEntities',
	removedEntities: packetData.removedEntities,
	updatedBaseLine: packetData.updatedBaseLine,
	baseLine: packetData.baseLine,
	delta: packetData.delta,
	maxEntries: packetData.maxEntries,
	entities: packetData.entities.map(hydrateEntity)
};

const state = createParserState();
state.serverClasses.length = 348;
for (const serverClass of serverClassesData) {
	state.serverClasses[serverClass.id] = new ServerClass(serverClass.id, serverClass.name, serverClass.dataTable);
}
for (const sendTable of sendTableData) {
	const table = hydrateTable(sendTable);
	state.sendTables.set(table.name, table);
}

for (const entity of expected.entities) {
	state.entityClasses.set(entity.entityIndex, entity.serverClass);
}

for (const [serverClassId, baseLine] of baselineData) {
	state.staticBaseLines.set(serverClassId, getStream(baseLine));
}

function parse(stream: BitStream) {
	return ParsePacketEntities(stream, state);
}

function encode(value: PacketEntitiesPacket, stream: BitStream) {
	EncodePacketEntities(value, stream, state);
}

const sunEntityData = {
	'serverClass': {
		'id': 123,
		'name': 'CSun',
		'dataTable': 'DT_Sun'
	},
	'entityIndex': 403,
	'props': [
		{
			'definition': {
				'type': 0,
				'name': 'm_clrRender',
				'flags': 1,
				'excludeDTName': null,
				'lowValue': 0,
				'highValue': 0,
				'bitCount': 32,
				'table': null,
				'numElements': 0,
				'arrayProperty': null,
				'ownerTableName': 'DT_Sun'
			},
			'value': 4276271871
		},
		{
			'definition': {
				'type': 0,
				'name': 'm_clrOverlay',
				'flags': 1,
				'excludeDTName': null,
				'lowValue': 0,
				'highValue': 0,
				'bitCount': 32,
				'table': null,
				'numElements': 0,
				'arrayProperty': null,
				'ownerTableName': 'DT_Sun'
			},
			'value': 0
		},
		{
			'definition': {
				'type': 2,
				'name': 'm_vDirection',
				'flags': 32,
				'excludeDTName': null,
				'lowValue': 0,
				'highValue': -121121.125,
				'bitCount': 0,
				'table': null,
				'numElements': 0,
				'arrayProperty': null,
				'ownerTableName': 'DT_Sun'
			},
			'value': {
				'x': -0.6453346360527601,
				'y': -0.504152418172936,
				'z': 0.1880801172447484
			}
		}
	],
	'inPVS': true,
	'pvs': 1,
	'serialNumber': 664
};

suite('PacketEntities', () => {
	// test('Parse packetEntities', () => {
	// 	const length = 130435;
	// 	const stream = getStream(data);
	// 	const start = stream.index;
	// 	const resultPacket = parse(stream);
	// 	assert.equal(stream.index - start, length, 'Unexpected number of bits consumed from stream');
	//
	// 	for (let i = 0; i < resultPacket.entities.length; i++) {
	// 		const resultEntity = resultPacket.entities[i];
	// 		const expectedEntity = expected.entities[i];
	// 		assert.deepEqual(expectedEntity.serverClass, resultEntity.serverClass);
	// 		assert.equal(expectedEntity.serialNumber, resultEntity.serialNumber);
	// 		assert.equal(expectedEntity.entityIndex, resultEntity.entityIndex);
	// 		if (!deepEqual(resultEntity, expectedEntity)) {
	// 			for (let i = 0; i < expectedEntity.props.length; i++) {
	// 				console.log(resultEntity.getPropByDefinition(expectedEntity.props[i].definition),expectedEntity.props[i].definition);
	// 				assert.deepEqual(resultEntity.getPropByDefinition(expectedEntity.props[i].definition), expectedEntity.props[i], `invalid property #${i} for ${resultEntity.serverClass.name}`);
	// 			}
	// 			assert.equal(resultEntity.props.length, expectedEntity.props.length, `Unexpected number of props for ${resultEntity.serverClass.name}`);
	// 			assert(false, 'Invalid entity ' + resultEntity.serverClass.name);
	// 		}
	// 	}
	// });

	// test('Encode packetEntities', () => {
	// 	assertEncoder(parse, encode, expected, Math.ceil(data.length / 8));
	// });


	test('Encode small packetEntities', () => {
		assertEncoder(parse, encode, {
			packetType: 'packetEntities',
			removedEntities: [],
			updatedBaseLine: false,
			baseLine: 0,
			delta: 0,
			maxEntries: 16,
			entities: [hydrateEntity(sunEntityData)]
		}, 202);
	});

	test('Encode small packetEntities with removed', () => {
		assertEncoder(parse, encode, {
			packetType: 'packetEntities',
			removedEntities: [10, 11],
			updatedBaseLine: false,
			baseLine: 0,
			delta: 0,
			maxEntries: 16,
			entities: [hydrateEntity(sunEntityData)]
		}, 259);
	});

	test('Encode packetEntities only removed', () => {
		assertEncoder(parse, encode, {
			packetType: 'packetEntities',
			removedEntities: [10, 11],
			updatedBaseLine: false,
			baseLine: 0,
			delta: 0,
			maxEntries: 16,
			entities: []
		}, 102);
	});
});
