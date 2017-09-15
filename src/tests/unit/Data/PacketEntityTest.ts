import {PacketEntity, PVS} from '../../../Data/PacketEntity';
import {ServerClass} from '../../../Data/ServerClass';
import {hydrateEntity, propDataDefinition} from '../Parser/Packet/hydrate';
import {SendProp} from '../../../Data/SendProp';
import * as assert from 'assert';
import {readFileSync} from 'fs';

const serverClass = new ServerClass(241, 'CTFPlayer', 'DT_TFPlayer');
const playerBaseLineData = JSON.parse(readFileSync(__dirname + '/../../data/packetEntitiesPlayerBaseline.json', 'utf8'));
const playerEntityData = JSON.parse(readFileSync(__dirname + '/../../data/packetEntitiesPlayerEntity.json', 'utf8'));

const definition1 = propDataDefinition({
	'type': 1,
	'name': 'm_flDucktime',
	'flags': 1032,
	'excludeDTName': null,
	'lowValue': 0,
	'highValue': 2047.5,
	'bitCount': 12,
	'table': null,
	'numElements': 0,
	'arrayProperty': null,
	'ownerTableName': 'DT_Local'
});
const definition2 = propDataDefinition({
	'type': 1,
	'name': 'm_flFallVelocity',
	'flags': 1024,
	'excludeDTName': null,
	'lowValue': -4096,
	'highValue': 4096,
	'bitCount': 17,
	'table': null,
	'numElements': 0,
	'arrayProperty': null,
	'ownerTableName': 'DT_Local'
});

suite('PacketEntity', () => {
	test('baseLine diff', () => {
		const baseLine = new PacketEntity(serverClass, 123, PVS.ENTER);
		const entity = new PacketEntity(serverClass, 123, PVS.ENTER);
		const prop1 = new SendProp(definition1);
		prop1.value = 0.03125023842039809;
		const prop2 = new SendProp(definition2);
		prop2.value = 0;
		const prop3 = new SendProp(definition2);
		prop3.value = 0.03125023842039809;
		baseLine.props = [prop1, prop2];
		entity.props = [prop1, prop3];

		assert.deepEqual(entity.diffFromBaseLine(baseLine), [prop3]);
	});

	test('baseLine diff player', () => {
		const baseLine = hydrateEntity(playerBaseLineData);
		const entity = hydrateEntity(playerEntityData);

		assert.deepEqual(entity.diffFromBaseLine(baseLine).length, 75);
	});
});
