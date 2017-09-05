import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';
import {EncodeTempEntities, ParseTempEntities} from '../../../../Parser/Packet/TempEntities';
import {Match} from '../../../../Data/Match';
import {hydrateEntity, hydrateTable} from './hydrate';
import {ServerClass} from '../../../../Data/ServerClass';
import {TempEntitiesPacket} from '../../../../Data/Packet';

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

const entityData = [
	{
		'serverClass': {
			'id': 164,
			'name': 'CTEPlayerAnimEvent',
			'dataTable': 'DT_TEPlayerAnimEvent'
		},
		'entityIndex': 0,
		'props': [
			{
				'definition': {
					'type': 0,
					'name': 'm_iPlayerIndex',
					'flags': 1,
					'excludeDTName': null,
					'lowValue': 0,
					'highValue': 0,
					'bitCount': 7,
					'table': null,
					'numElements': 0,
					'arrayProperty': null,
					'ownerTableName': 'DT_TEPlayerAnimEvent'
				},
				'value': 17
			}
		],
		'inPVS': false,
		'pvs': 1,
		'delay': 0
	},
	{
		'serverClass': {
			'id': 178,
			'name': 'CTETFParticleEffect',
			'dataTable': 'DT_TETFParticleEffect'
		},
		'entityIndex': 0,
		'props': [
			{
				'definition': {
					'type': 1,
					'name': 'm_vecOrigin[0]',
					'flags': 32772,
					'excludeDTName': null,
					'lowValue': 0,
					'highValue': 0,
					'bitCount': 32,
					'table': null,
					'numElements': 0,
					'arrayProperty': null,
					'ownerTableName': 'DT_TETFParticleEffect'
				},
				'value': 1004
			},
			{
				'definition': {
					'type': 1,
					'name': 'm_vecOrigin[1]',
					'flags': 32772,
					'excludeDTName': null,
					'lowValue': 0,
					'highValue': 0,
					'bitCount': 32,
					'table': null,
					'numElements': 0,
					'arrayProperty': null,
					'ownerTableName': 'DT_TETFParticleEffect'
				},
				'value': -2016
			},
			{
				'definition': {
					'type': 1,
					'name': 'm_vecOrigin[2]',
					'flags': 32772,
					'excludeDTName': null,
					'lowValue': 0,
					'highValue': 0,
					'bitCount': 32,
					'table': null,
					'numElements': 0,
					'arrayProperty': null,
					'ownerTableName': 'DT_TETFParticleEffect'
				},
				'value': 561
			},
			{
				'definition': {
					'type': 0,
					'name': 'm_iParticleSystemIndex',
					'flags': 1,
					'excludeDTName': null,
					'lowValue': 0,
					'highValue': 0,
					'bitCount': 16,
					'table': null,
					'numElements': 0,
					'arrayProperty': null,
					'ownerTableName': 'DT_TETFParticleEffect'
				},
				'value': 472
			},
			{
				'definition': {
					'type': 0,
					'name': 'entindex',
					'flags': 1,
					'excludeDTName': null,
					'lowValue': 0,
					'highValue': 0,
					'bitCount': 11,
					'table': null,
					'numElements': 0,
					'arrayProperty': null,
					'ownerTableName': 'DT_TETFParticleEffect'
				},
				'value': 2047
			}
		],
		'inPVS': false,
		'pvs': 1,
		'delay': 0
	}
];
const sendTableData = {
	'name': 'DT_TEPlayerAnimEvent',
	'props': [
		{
			'type': 0,
			'name': 'm_iPlayerIndex',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 7,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TEPlayerAnimEvent'
		},
		{
			'type': 0,
			'name': 'm_iEvent',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 6,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TEPlayerAnimEvent'
		},
		{
			'type': 0,
			'name': 'm_nData',
			'flags': 0,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 12,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TEPlayerAnimEvent'
		}
	],
	'cachedFlattenedProps': []
};
const sendTableData2 = {
	'name': 'DT_TETFParticleEffect',
	'props': [
		{
			'type': 6,
			'name': 'baseclass',
			'flags': 4096,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 0,
			'table': {
				'name': 'DT_BaseTempEntity',
				'props': [],
				'cachedFlattenedProps': []
			},
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_vecOrigin[0]',
			'flags': 32772,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_vecOrigin[1]',
			'flags': 32772,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_vecOrigin[2]',
			'flags': 32772,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_vecStart[0]',
			'flags': 32772,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_vecStart[1]',
			'flags': 32772,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_vecStart[2]',
			'flags': 32772,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 2,
			'name': 'm_vecAngles',
			'flags': 0,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 360,
			'bitCount': 7,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 0,
			'name': 'm_iParticleSystemIndex',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 16,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 0,
			'name': 'entindex',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 11,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 0,
			'name': 'm_iAttachType',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 5,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 0,
			'name': 'm_iAttachmentPointIndex',
			'flags': 0,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 0,
			'name': 'm_bResetParticles',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 1,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 0,
			'name': 'm_bCustomColors',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 1,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 2,
			'name': 'm_CustomColors.m_vecColor1',
			'flags': 0,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 1,
			'bitCount': 8,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 2,
			'name': 'm_CustomColors.m_vecColor2',
			'flags': 0,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 1,
			'bitCount': 8,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 0,
			'name': 'm_bControlPoint1',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 1,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 0,
			'name': 'm_ControlPoint1.m_eParticleAttachment',
			'flags': 1,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 5,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_ControlPoint1.m_vecOffset[0]',
			'flags': 8196,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_ControlPoint1.m_vecOffset[1]',
			'flags': 8196,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		},
		{
			'type': 1,
			'name': 'm_ControlPoint1.m_vecOffset[2]',
			'flags': 8196,
			'excludeDTName': null,
			'lowValue': 0,
			'highValue': 0,
			'bitCount': 32,
			'table': null,
			'numElements': 0,
			'arrayProperty': null,
			'ownerTableName': 'DT_TETFParticleEffect'
		}
	],
	'cachedFlattenedProps': []
};
const sendTable = hydrateTable(sendTableData);
const sendTable2 = hydrateTable(sendTableData2);
const expected = {
	packetType: 'tempEntities',
	entities: entityData.map(hydrateEntity)
};

const match = new Match();
match.serverClasses.length = 348;
match.serverClasses[164] = new ServerClass(164, 'CTEPlayerAnimEvent', 'DT_TEPlayerAnimEvent');
match.serverClasses[178] = new ServerClass(178, 'CTETFParticleEffect', 'DT_TETFParticleEffect');
match.sendTables.set(sendTable.name, sendTable);
match.sendTables.set(sendTable2.name, sendTable2);

function parse(stream: BitStream) {
	return ParseTempEntities(stream, match);
}

function encode(value: TempEntitiesPacket, stream: BitStream) {
	EncodeTempEntities(value, stream, match);
}

suite('TempEntities', () => {
	test('Parse tempEntities', () => {
		assertParser(parse, getStream(data), expected, 166);
	});

	test('Encode tempEntities', () => {
		assertEncoder(parse, encode, expected, 166);
	});
});
