import {PacketEntitiesPacket} from "../Data/Packet";
import {Match} from "../Data/Match";
import {PacketEntity, PVS} from "../Data/PacketEntity";
import {Vector} from "../Data/Vector";
import {Player} from "../Data/Player";

export function handlePacketEntities(packet: PacketEntitiesPacket, match: Match) {
	for (const removedEntityId of packet.removedEntities) {
		delete match.entityClasses[removedEntityId];
	}

	for (const entity of packet.entities) {
		saveEntity(entity, match);
		handleEntity(entity, match);
	}
}

function saveEntity(packetEntity: PacketEntity, match: Match) {
	if (packetEntity.pvs === PVS.DELETE) {
		delete match.entityClasses[packetEntity.entityIndex];
	}

	match.entityClasses[packetEntity.entityIndex] = packetEntity.serverClass;
}

function handleEntity(entity: PacketEntity, match: Match) {
	switch (entity.serverClass.name) {
		case 'CWorld':
			match.world.boundaryMin = <Vector>entity.getProperty('DT_WORLD', 'm_WorldMins').value;
			match.world.boundaryMax = <Vector>entity.getProperty('DT_WORLD', 'm_WorldMaxs').value;
			break;
		case 'CTFPlayer':
			try {
				const player: Player = (match.playerMap[entity.entityIndex]) ? match.playerMap[entity.entityIndex] : {
						user:      match.getUserInfoForEntity(entity),
						position:  new Vector(0, 0, 0),
						maxHealth: 0,
						health:    0,
						classId:   0,
						team:      0,
						viewAngle: 0
					};
				if (!match.playerMap[entity.entityIndex]) {
					match.playerMap[entity.entityIndex] = player;
					match.players.push(player);
				}

				for (const prop of entity.props) {
					const propName = prop.definition.ownerTableName + '.' + prop.definition.name;
					switch (propName) {
						case 'DT_BasePlayer.m_iHealth':
							player.health = <number>prop.value;
							break;
						case 'DT_BasePlayer.m_iMaxHealth':
							player.maxHealth = <number>prop.value;
							break;
						case 'DT_TFLocalPlayerExclusive.m_vecOrigin':
							player.position.x = (<Vector>prop.value).x;
							player.position.y = (<Vector>prop.value).y;
							break;
						case 'DT_TFNonLocalPlayerExclusive.m_vecOrigin':
							player.position.x = (<Vector>prop.value).x;
							player.position.y = (<Vector>prop.value).y;
							break;
						case 'DT_TFLocalPlayerExclusive.m_vecOrigin[2]':
							player.position.z = <number>prop.value;
							break;
						case 'DT_TFNonLocalPlayerExclusive.m_vecOrigin[2]':
							player.position.z = <number>prop.value;
							break;
						case 'DT_TFNonLocalPlayerExclusive.m_angEyeAngles[1]':
							player.viewAngle = <number>prop.value;
							break;
						case 'DT_TFLocalPlayerExclusive.m_angEyeAngles[1]':
							player.viewAngle = <number>prop.value;
							break;
					}
				}

			} catch (e) {

			}

	}
}
