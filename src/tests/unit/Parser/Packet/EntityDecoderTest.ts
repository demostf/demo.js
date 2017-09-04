import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';
import {readFileSync} from 'fs';
import {SendTable} from '../../../../Data/SendTable';
import {encodeEntityUpdate, getEntityUpdate} from '../../../../Parser/EntityDecoder';
import {SendProp, SendPropValue} from '../../../../Data/SendProp';
import {SendPropDefinition, SendPropType} from '../../../../Data/SendPropDefinition';
import {PacketEntity} from '../../../../Data/PacketEntity';
import {Vector} from '../../../../Data/Vector';
import {SendPropEncoder} from '../../../../Parser/SendPropEncoder';
import {SendPropParser} from '../../../../Parser/SendPropParser';

const data = [
	9, 128, 64, 64, 64, 64, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 36, 0, 64, 0, 1, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136, 0, 128, 0, 0, 8, 0, 128, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 64, 0, 32, 0, 16, 0, 32, 240, 255, 255, 255, 31, 0, 2, 32, 48, 0, 128, 0, 0, 4, 254, 255, 127, 224, 255, 255, 7, 254, 255, 127, 0, 8, 64, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 64, 64, 64, 64, 0, 32, 224, 136, 10, 248, 91, 2, 63, 18, 8, 40, 38, 3, 250, 163, 192, 126, 7, 2, 2, 0, 0, 0, 0, 1, 0, 0, 0, 128, 0, 0, 0, 224, 111, 0, 0, 0, 0, 32, 192, 129, 172, 140, 46, 44, 141, 237, 133, 172, 140, 46, 44, 141, 109, 14, 78, 46, 141, 174, 108, 238, 107, 46, 236, 174, 45, 141, 141, 45, 0];

const entityData = JSON.parse(readFileSync(__dirname + '/../../../data/worldEntity.json', 'utf8'));
const sendTableData = JSON.parse(readFileSync(__dirname + '/../../../data/sendTableDTWorld.json', 'utf8'));
const sendTable = hydrateTable(sendTableData);
const entity = hydrateEntity(entityData);

function hydrateEntity(entityData): PacketEntity {
	const entity = new PacketEntity(entityData.serverClass, entityData.entityIndex, entityData.pvs);
	entity.props = entityData.props.map(propData => {
		const prop = new SendProp(propDataDefinition(propData.definition));
		if (prop.definition.type === SendPropType.DPT_Vector || prop.definition.type === SendPropType.DPT_VectorXY) {
			prop.value = new Vector(propData.value.x, propData.value.y, propData.value.z);
		} else {
			prop.value = propData.value;
		}
		return prop;
	});
	return entity;
}

function propDataDefinition(propData): SendPropDefinition {
	const prop = new SendPropDefinition(propData.type, propData.name, propData.flags, propData.ownerTableName);
	prop.arrayProperty = propData.arrayProperty;
	prop.numElements = propData.numElements;
	prop.bitCount = propData.bitCount;
	prop.excludeDTName = propData.excludeDTName;
	prop.lowValue = propData.lowValue;
	prop.highValue = propData.highValue;
	prop.table = propData.table ? hydrateTable(propData.table) : null;
	return prop;
}

function hydrateTable(tableData): SendTable {
	const table = new SendTable(tableData.name);
	table.props = tableData.props.map(propDataDefinition);
	return table;
}

function decodeUpdate(stream: BitStream) {
	return getEntityUpdate(sendTable, stream);
}

function encodeUpdate(props: SendProp[], stream: BitStream) {
	encodeEntityUpdate(props, sendTable, stream);
}

function encodeProp(prop: SendProp) {
	return function (value: SendPropValue, stream: BitStream) {
		return SendPropEncoder.encode(value, prop.definition, stream);
	};
}

function decodeProp(prop: SendProp) {
	return function (stream: BitStream) {
		return SendPropParser.decode(prop.definition, stream);
	};
}

suite('Entity Decoder', () => {
	test('Encode sendProps', () => {
		for (const prop of entity.props) {
			if (prop.value !== null) {
				assertEncoder(decodeProp(prop), encodeProp(prop), prop.value, 0, ` for ${SendPropType[prop.definition.type]} with flags ${prop.definition.allFlags}`);
			}
		}
	});

	test('Decode entity update', () => {
		assertParser(decodeUpdate, getStream(data), entity.props, 1958);
	});

	test('Encode userMessage', () => {
		assertEncoder(decodeUpdate, encodeUpdate, entity.props, 1966);
	});
});
