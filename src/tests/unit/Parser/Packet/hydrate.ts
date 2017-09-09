import {SendProp} from '../../../../Data/SendProp';
import {PacketEntity} from '../../../../Data/PacketEntity';
import {SendPropDefinition, SendPropType} from '../../../../Data/SendPropDefinition';
import {Vector} from '../../../../Data/Vector';
import {SendTable} from '../../../../Data/SendTable';

export function hydrateEntity(entityData): PacketEntity {
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
	entity.inPVS = entityData.inPVS;
	if (typeof entityData.delay !== 'undefined') {
		entity.delay = entityData.delay;
	}
	if (typeof entityData.serialNumber !== 'undefined') {
		entity.serialNumber = entityData.serialNumber;
	}
	return entity;
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
