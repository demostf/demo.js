"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("../Data/Player");
function handleHL2DMEntity(entity, match, message) {
    switch (entity.serverClass.name) {
        case 'CHL2MP_Player':
            const userInfo = match.getUserInfoForEntity(entity);
            if (!userInfo) {
                throw new Error(`No user info for entity ${entity.entityIndex}`);
            }
            if (userInfo.entityId !== entity.entityIndex) {
                throw new Error(`Invalid user info for entity ${entity.entityIndex} vs ${userInfo.entityId}`);
            }
            const player = (match.playerEntityMap.has(entity.entityIndex)) ?
                match.playerEntityMap.get(entity.entityIndex) :
                new Player_1.Player(match, userInfo);
            if (!match.playerEntityMap.has(entity.entityIndex)) {
                match.playerEntityMap.set(entity.entityIndex, player);
            }
            for (const prop of entity.props) {
                if (prop.definition.ownerTableName === 'm_hMyWeapons') {
                    if (prop.value !== 2097151) {
                        player.weaponIds[parseInt(prop.definition.name, 10)] = prop.value;
                    }
                }
                if (prop.definition.ownerTableName === 'm_iAmmo') {
                    if (prop.value !== null && prop.value > 0) {
                        player.ammo[parseInt(prop.definition.name, 10)] = prop.value;
                    }
                }
                const propName = prop.definition.ownerTableName + '.' + prop.definition.name;
                switch (propName) {
                    case 'DT_BaseEntity.m_iTeamNum':
                        if (!player.user.team && (prop.value === 2 || prop.value === 3)) {
                            player.user.team = prop.value === 2 ? 'red' : 'blue';
                        }
                        player.team = prop.value;
                        break;
                    case 'DT_BasePlayer.m_iHealth':
                        player.health = prop.value;
                        break;
                    case 'DT_BasePlayer.m_iMaxHealth':
                        player.maxHealth = prop.value;
                        break;
                    case 'DT_BaseEntity.m_vecOrigin':
                        player.position.x = prop.value.x;
                        player.position.y = prop.value.y;
                        player.position.z = prop.value.z;
                        break;
                    case 'DT_HL2MP_Player.m_angEyeAngles[0]':
                        player.viewAngle = prop.value;
                        break;
                    case 'DT_HL2MP_Player.m_angEyeAngles[1]':
                        player.viewAngle = prop.value;
                        break;
                    case 'DT_BasePlayer.m_lifeState':
                        player.lifeState = prop.value;
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
        case 'CTeam':
            if (entity.hasProperty('DT_Team', 'm_iTeamNum')) {
                const teamId = entity.getProperty('DT_Team', 'm_iTeamNum').value;
                if (!match.teams.has(teamId)) {
                    const team = {
                        name: entity.getProperty('DT_Team', 'm_szTeamname').value,
                        score: entity.getProperty('DT_Team', 'm_iScore').value,
                        roundsWon: entity.getProperty('DT_Team', 'm_iRoundsWon').value,
                        players: entity.getProperty('DT_Team', '"player_array"').value,
                        teamNumber: teamId
                    };
                    match.teams.set(teamId, team);
                    match.teamEntityMap.set(entity.entityIndex, team);
                }
            }
            else {
                const team = match.teamEntityMap.get(entity.entityIndex);
                if (!team) {
                    throw new Error(`No team with entity id: ${entity.entityIndex}`);
                }
                for (const prop of entity.props) {
                    const propName = prop.definition.ownerTableName + '.' + prop.definition.name;
                    switch (propName) {
                        case 'DT_Team.m_iScore':
                            team.score = prop.value;
                            break;
                        case 'DT_Team.m_szTeamname':
                            team.name = prop.value;
                            break;
                        case 'DT_Team.m_iRoundsWon':
                            team.roundsWon = prop.value;
                            break;
                        case 'DT_Team."player_array"':
                            team.players = prop.value;
                            break;
                    }
                }
            }
            break;
        case 'CPlayerResource':
            for (const prop of entity.props) {
                const playerId = parseInt(prop.definition.name, 10);
                const value = prop.value;
                if (!match.playerResources[playerId]) {
                    match.playerResources[playerId] = {
                        alive: false,
                        arenaSpectator: false,
                        bonusPoints: 0,
                        chargeLevel: 0,
                        connected: false,
                        damageAssists: 0,
                        damageBlocked: 0,
                        deaths: 0,
                        dominations: 0,
                        healing: 0,
                        healingAssist: 0,
                        health: 0,
                        killStreak: 0,
                        maxBuffedHealth: 0,
                        maxHealth: 0,
                        nextRespawn: 0,
                        ping: 0,
                        playerClass: 0,
                        playerLevel: 0,
                        score: 0,
                        team: 0,
                        totalScore: 0,
                        damage: 0
                    };
                }
                const playerResource = match.playerResources[playerId];
                switch (prop.definition.ownerTableName) {
                    case 'm_iPing':
                        playerResource.ping = value;
                        break;
                    case 'm_iScore':
                        playerResource.score = value;
                        break;
                    case 'm_iDeaths':
                        playerResource.deaths = value;
                        break;
                    case 'm_bConnected':
                        playerResource.connected = value > 0;
                        break;
                    case 'm_iTeam':
                        playerResource.team = value;
                        break;
                    case 'm_bAlive':
                        playerResource.alive = value > 0;
                        break;
                    case 'm_iHealth':
                        playerResource.health = value;
                        break;
                    case 'm_iTotalScore':
                        playerResource.totalScore = value;
                        break;
                    case 'm_iMaxHealth':
                        playerResource.maxHealth = value;
                        break;
                    case 'm_iMaxBuffedHealth':
                        playerResource.maxBuffedHealth = value;
                        break;
                    case 'm_iPlayerClass':
                        playerResource.playerClass = value;
                        break;
                    case 'm_bArenaSpectator':
                        playerResource.arenaSpectator = value > 0;
                        break;
                    case 'm_iActiveDominations':
                        playerResource.dominations = value;
                        break;
                    case 'm_flNextRespawnTime':
                        playerResource.nextRespawn = value;
                        break;
                    case 'm_iChargeLevel':
                        playerResource.chargeLevel = value;
                        break;
                    case 'm_iDamage':
                        playerResource.damage = value;
                        break;
                    case 'm_iDamageAssist':
                        playerResource.damageAssists = value;
                        break;
                    case 'm_iHealing':
                        playerResource.healing = value;
                        break;
                    case 'm_iHealingAssist':
                        playerResource.healingAssist = value;
                        break;
                    case 'm_iDamageBlocked':
                        playerResource.damageBlocked = value;
                        break;
                    case 'm_iBonusPoints':
                        playerResource.bonusPoints = value;
                        break;
                    case 'm_iPlayerLevel':
                        playerResource.playerLevel = value;
                        break;
                    case 'm_iKillstreak':
                        playerResource.killStreak = value;
                        break;
                }
            }
            break;
    }
}
exports.handleHL2DMEntity = handleHL2DMEntity;
//# sourceMappingURL=HL2DMEntityHandler.js.map