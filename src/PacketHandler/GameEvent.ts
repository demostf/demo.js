import {DeathEventValues, ObjectDestroyedValues, PlayerSpawnEventValues, RoundWinEventValues} from '../Data/GameEvent';
import {Match} from '../Data/Match';
import {GameEventPacket} from '../Data/Packet';

export function handleGameEvent(packet: GameEventPacket, match: Match) {
	switch (packet.event.name) {
		case 'player_death':
			handlePlayerDeath(packet, match);
			break;
		case 'teamplay_round_win':
			handleRoundWin(packet, match);
			break;
		case 'player_spawn':
			handlePlayerSpawn(packet, match);
			break;
		case 'object_destroyed':
			handleObjectDestroyed(packet, match);
			break;
		case 'teamplay_round_start':
			handleRoundStart(packet, match);
			break;
	}
}

function handlePlayerDeath(packet: GameEventPacket, match: Match) {
	const values = packet.event.values as DeathEventValues;
	while (values.assister > 256 && values.assister < (1024 * 16)) {
		values.assister -= 256;
	}
	const assister = values.assister < 256 ? values.assister : null;
	// todo get player names, not same id as the name string table (entity id?)
	while (values.attacker > 256) {
		values.attacker -= 256;
	}
	while (values.userid > 256) {
		values.userid -= 256;
	}
	match.deaths.push({
		killer: values.attacker,
		assister,
		victim: values.userid,
		weapon: values.weapon,
		tick: match.tick,
	});
}

function handleRoundWin(packet: GameEventPacket, match: Match) {
	const values = packet.event.values as RoundWinEventValues;
	if (values.winreason !== 6) {// 6 = timelimit
		match.rounds.push({
			winner: values.team === 2 ? 'red' : 'blue',
			length: values.round_time,
			end_tick: match.tick,
		});
	}
}

function handlePlayerSpawn(packet: GameEventPacket, match: Match) {
	const values = packet.event.values as PlayerSpawnEventValues;
	const userId = values.userid;
	const userState = match.getUserInfo(userId);
	const player = match.playerEntityMap.get(userState.entityId);
	userState.team = values.team === 2 ? 'red' : 'blue';
	const classId = values.class;
	if (player) {
		player.classId = classId;
		player.team = values.team;
	}
	if (!userState.classes[classId]) {
		userState.classes[classId] = 0;
	}
	userState.classes[classId]++;
}

function handleObjectDestroyed(packet: GameEventPacket, match: Match) {
	const values = packet.event.values as ObjectDestroyedValues;
	match.buildings.delete(values.index);
}

function handleRoundStart(packet: GameEventPacket, match: Match) {
	match.buildings.clear();
}
