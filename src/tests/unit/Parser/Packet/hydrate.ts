import {SendProp, SendPropValue} from '../../../../Data/SendProp';
import {PacketEntity} from '../../../../Data/PacketEntity';
import {SendPropDefinition, SendPropType} from '../../../../Data/SendPropDefinition';
import {Vector} from '../../../../Data/Vector';
import {SendTable} from '../../../../Data/SendTable';

export function hydrateEntity(entityData): PacketEntity {
	const entity = new PacketEntity(entityData.serverClass, entityData.entityIndex, entityData.pvs);
	entity.props = entityData.props.map(propData => {
		const prop = new SendProp(propDataDefinition(propData.definition));
		prop.value = hydrateProp(propData.value, prop.definition);
		return prop;
	});
	entity.inPVS = entityData.inPVS;
	if (typeof entityData.delay !== 'undefined') {
		entity.delay = entityData.delay;
	}
	if (typeof entityData.serialNumber !== 'undefined') {
		entity.serialNumber = entityData.serialNumber;
	}
	return entity;
}

function hydrateProp(value: any, definition: SendPropDefinition): SendPropValue {
	if (Array.isArray(value)) {
		const arrayProp = definition.arrayProperty;
		if (arrayProp === null) {
			throw new Error('arrayProperty not set for array property');
		}
		return value.map(arrayValue => hydrateProp(arrayValue, arrayProp)) as SendPropValue;
	} else if (definition.type === SendPropType.DPT_Vector || definition.type === SendPropType.DPT_VectorXY) {
		return new Vector(value.x, value.y, value.z);
	} else {
		return value;
	}
}

export function propDataDefinition(propData): SendPropDefinition {
	const prop = new SendPropDefinition(propData.type, propData.name, propData.flags, propData.ownerTableName);
	prop.arrayProperty = propData.arrayProperty ? propDataDefinition(propData.arrayProperty) : null;
	prop.numElements = propData.numElements;
	prop.bitCount = propData.bitCount;
	prop.excludeDTName = propData.excludeDTName;
	prop.lowValue = propData.lowValue;
	prop.highValue = propData.highValue;
	prop.table = propData.table ? hydrateTable(propData.table) : null;
	return prop;
}

export function hydrateTable(tableData): SendTable {
	const table = new SendTable(tableData.name);
	table.props = tableData.props.map(propDataDefinition);
	return table;
}
