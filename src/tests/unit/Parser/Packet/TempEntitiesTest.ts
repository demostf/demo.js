import {BitStream} from 'bit-buffer';
import {readFileSync} from 'fs';
import {TempEntitiesPacket} from '../../../../Data/Packet';
import {createParserState} from '../../../../Data/ParserState';
import {ServerClass} from '../../../../Data/ServerClass';
import {EncodeTempEntities, ParseTempEntities} from '../../../../Parser/Packet/TempEntities';
import {hydrateEntity, hydrateTable} from './hydrate';
import {assertEncoder, assertParser, getStream} from './PacketTest';

const data = [
	2,
	142,
	1,
	150,
	10,
	68,
	56,
	43,
	176,
	245,
	5,
	254,
	253,
	192,
	96,
	20,
	194,
	14,
	8,
	252,
	95];

const entityData = JSON.parse(readFileSync(__dirname + '/../../../data/tempEntitiesResult.json', 'utf8'));
const sendTableData = {
	name: 'DT_TEPlayerAnimEvent',
	props: [
		{
			type: 0,
			name: 'm_iPlayerIndex',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 7,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TEPlayerAnimEvent'
		},
		{
			type: 0,
			name: 'm_iEvent',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 6,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TEPlayerAnimEvent'
		},
		{
			type: 0,
			name: 'm_nData',
			flags: 0,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 12,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TEPlayerAnimEvent'
		}
	],
	cachedFlattenedProps: []
};
const sendTableData2 = {
	name: 'DT_TETFParticleEffect',
	props: [
		{
			type: 6,
			name: 'baseclass',
			flags: 4096,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 0,
			table: {
				name: 'DT_BaseTempEntity',
				props: [],
				cachedFlattenedProps: []
			},
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_vecOrigin[0]',
			flags: 32772,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_vecOrigin[1]',
			flags: 32772,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_vecOrigin[2]',
			flags: 32772,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_vecStart[0]',
			flags: 32772,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_vecStart[1]',
			flags: 32772,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_vecStart[2]',
			flags: 32772,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 2,
			name: 'm_vecAngles',
			flags: 0,
			excludeDTName: null,
			lowValue: 0,
			highValue: 360,
			bitCount: 7,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 0,
			name: 'm_iParticleSystemIndex',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 16,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 0,
			name: 'entindex',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 11,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 0,
			name: 'm_iAttachType',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 5,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 0,
			name: 'm_iAttachmentPointIndex',
			flags: 0,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 0,
			name: 'm_bResetParticles',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 1,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 0,
			name: 'm_bCustomColors',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 1,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 2,
			name: 'm_CustomColors.m_vecColor1',
			flags: 0,
			excludeDTName: null,
			lowValue: 0,
			highValue: 1,
			bitCount: 8,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 2,
			name: 'm_CustomColors.m_vecColor2',
			flags: 0,
			excludeDTName: null,
			lowValue: 0,
			highValue: 1,
			bitCount: 8,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 0,
			name: 'm_bControlPoint1',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 1,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 0,
			name: 'm_ControlPoint1.m_eParticleAttachment',
			flags: 1,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 5,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_ControlPoint1.m_vecOffset[0]',
			flags: 8196,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_ControlPoint1.m_vecOffset[1]',
			flags: 8196,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		},
		{
			type: 1,
			name: 'm_ControlPoint1.m_vecOffset[2]',
			flags: 8196,
			excludeDTName: null,
			lowValue: 0,
			highValue: 0,
			bitCount: 32,
			table: null,
			numElements: 0,
			arrayProperty: null,
			ownerTableName: 'DT_TETFParticleEffect'
		}
	],
	cachedFlattenedProps: []
};
const sendTable = hydrateTable(sendTableData);
const sendTable2 = hydrateTable(sendTableData2);
const expected = {
	packetType: 'tempEntities',
	entities: entityData.map(hydrateEntity)
};

const state = createParserState();
state.serverClasses.length = 348;
state.serverClasses[164] = new ServerClass(164, 'CTEPlayerAnimEvent', 'DT_TEPlayerAnimEvent');
state.serverClasses[178] = new ServerClass(178, 'CTETFParticleEffect', 'DT_TETFParticleEffect');
state.sendTables.set(sendTable.name, sendTable);
state.sendTables.set(sendTable2.name, sendTable2);

function parse(stream: BitStream) {
	return ParseTempEntities(stream, state);
}

function encode(value: TempEntitiesPacket, stream: BitStream) {
	EncodeTempEntities(value, stream, state);
}

suite('TempEntities', () => {
	test('Parse tempEntities', () => {
		assertParser(parse, getStream(data), expected, 166);
	});

	test('Encode tempEntities', () => {
		assertEncoder(parse, encode, expected, 166);
	});
});
