import {Vector} from '../Data/Vector';
import {PacketEntity} from '../Data/PacketEntity';
import {Match} from '../Data/Match';
import {PacketMessage} from '../Data/Message';

export function handleBaseEntity(entity: PacketEntity, match: Match, message: PacketMessage) {
	for (const prop of entity.props) {
		if (prop.definition.ownerTableName === 'DT_AttributeContainer' && prop.definition.name === 'm_hOuter') {
			if (!match.outerMap.has(prop.value as number)) {
				match.outerMap.set(prop.value as number, entity.entityIndex);
			}
		}
	}

	for (const prop of entity.props) {
		if (prop.definition.ownerTableName === 'DT_BaseCombatWeapon' && prop.definition.name === 'm_hOwner') {
			if (!match.weaponMap.has(entity.entityIndex)) {
				match.weaponMap.set(entity.entityIndex, {
					className: entity.serverClass.name,
					owner: prop.value as number
				});
			}
		}
	}

	switch (entity.serverClass.name) {
		case 'CWorld':
			match.world.boundaryMin = entity.getProperty('DT_WORLD', 'm_WorldMins').value as Vector;
			match.world.boundaryMax = entity.getProperty('DT_WORLD', 'm_WorldMaxs').value as Vector;
			break;
	}
}
