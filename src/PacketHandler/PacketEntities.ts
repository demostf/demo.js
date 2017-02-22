import {PacketEntitiesPacket} from "../Data/Packet";
import {Match} from "../Data/Match";
import {PacketEntity, PVS} from "../Data/PacketEntity";
import {Vector} from "../Data/Vector";
import {Player, LifeState} from "../Data/Player";
import {CWeaponMedigun, Weapon} from "../Data/Weapon";

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
	for (const prop of entity.props) {
		if (prop.definition.ownerTableName === 'DT_AttributeContainer' && prop.definition.name === 'm_hOuter') {
			if (!match.outerMap[<number>prop.value]) {
				match.outerMap[<number>prop.value] = entity.entityIndex;
			}
		}
	}

	for (const prop of entity.props) {
		if (prop.definition.ownerTableName === 'DT_BaseCombatWeapon' && prop.definition.name === 'm_hOwner') {
			if (!match.weaponMap[entity.entityIndex]) {
				match.weaponMap[entity.entityIndex] = {
					className: entity.serverClass.name,
					owner:     <number>prop.value
				}
			}
		}
	}

	switch (entity.serverClass.name) {
		case 'CWorld':
			match.world.boundaryMin = <Vector>entity.getProperty('DT_WORLD', 'm_WorldMins').value;
			match.world.boundaryMax = <Vector>entity.getProperty('DT_WORLD', 'm_WorldMaxs').value;
			break;
		case 'CTFPlayer':
			/**
			 "DT_TFPlayerScoringDataExclusive.m_iCaptures": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iDefenses": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iKills": 5,
			 "DT_TFPlayerScoringDataExclusive.m_iDeaths": 17,
			 "DT_TFPlayerScoringDataExclusive.m_iSuicides": 7,
			 "DT_TFPlayerScoringDataExclusive.m_iDominations": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iRevenge": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iBuildingsBuilt": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iBuildingsDestroyed": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iHeadshots": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iBackstabs": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iHealPoints": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iInvulns": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iTeleports": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iDamageDone": 847,
			 "DT_TFPlayerScoringDataExclusive.m_iCrits": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iResupplyPoints": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iKillAssists": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iBonusPoints": 0,
			 "DT_TFPlayerScoringDataExclusive.m_iPoints": 6,
			 "DT_TFPlayerSharedLocal.m_nDesiredDisguiseTeam": 0,
			 "DT_TFPlayerSharedLocal.m_nDesiredDisguiseClass": 0,
			 "DT_TFPlayerShared.m_iKillStreak": 0,
			 "DT_TFPlayerShared.m_flCloakMeter": 100,
			 */

			const player: Player = (match.playerMap[entity.entityIndex]) ?
				match.playerMap[entity.entityIndex] :
				new Player(match, match.getUserInfoForEntity(entity));
			if (!match.playerMap[entity.entityIndex]) {
				match.playerMap[entity.entityIndex] = player;
				match.players.push(player);
			}

			for (const prop of entity.props) {
				if (prop.definition.ownerTableName === 'm_hMyWeapons') {
					if (prop.value !== 2097151) {
						player.weaponIds[parseInt(prop.definition.name, 10)] = <number>prop.value;
					}
				}
				if (prop.definition.ownerTableName === 'm_iAmmo') {
					if (prop.value > 0) {
						player.ammo[parseInt(prop.definition.name, 10)] = <number>prop.value;
					}
				}
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
					case 'DT_BasePlayer.m_lifeState':
						player.lifeState = <number>prop.value;
						break;
					case 'DT_BaseCombatCharacter.m_hActiveWeapon':
						for (let i = 0; i < player.weapons.length; i++) {
							if (player.weaponIds[i] === prop.value) {
								player.activeWeapon = i;
							}
						}
				}
			}
			break;
		case 'CWeaponMedigun':
			const weapon = <CWeaponMedigun>match.weaponMap[entity.entityIndex];
			for (const prop of entity.props) {
				const propName = prop.definition.ownerTableName + '.' + prop.definition.name;
				switch (propName) {
					case 'DT_WeaponMedigun.m_hHealingTarget':
						weapon.healTarget = <number>prop.value;
						break;
					case 'DT_TFWeaponMedigunDataNonLocal.m_flChargeLevel':
						weapon.chargeLevel = <number>prop.value;
						break;
					case 'DT_LocalTFWeaponMedigunData.m_flChargeLevel':
						weapon.chargeLevel = <number>prop.value;
						break;
				}
			}
			break;
		case'CTFTeam':
			try {
				const teamId = <number>entity.getProperty('DT_Team', 'm_iTeamNum').value;
				if (!match.teams[teamId]) {
					match.teams[teamId]               = {
						name:       <string>entity.getProperty('DT_Team', 'm_szTeamname').value,
						score:      <number>entity.getProperty('DT_Team', 'm_iScore').value,
						roundsWon:  <number>entity.getProperty('DT_Team', 'm_iRoundsWon').value,
						players:    <number[]>entity.getProperty('DT_Team', '"player_array"').value,
						teamNumber: <number>teamId
					};
					match.teamMap[entity.entityIndex] = match.teams[teamId];
				}
			} catch (e) {
				const team = match.teamMap[entity.entityIndex];
				for (const prop of entity.props) {
					const propName = prop.definition.ownerTableName + '.' + prop.definition.name;
					switch (propName) {
						case 'DT_Team.m_iScore':
							team.score = <number>prop.value;
							break;
						case 'DT_Team.m_szTeamname':
							team.name = <string>prop.value;
							break;
						case 'DT_Team.m_iRoundsWon':
							team.roundsWon = <number>prop.value;
							break;
						case 'DT_Team."player_array"':
							team.players = <number[]>prop.value;
							break;

					}
				}
				// process.exit();
			}
			break;
		case 'CTFPlayerResource':
			break;
		case 'CObjectSentrygun':
			break;
		case 'CTeamRoundTimer':
			break;
	}
}
