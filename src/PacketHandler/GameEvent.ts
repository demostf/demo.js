import {GameEventPacket} from "../Data/Packet";
import {Match} from "../Data/Match";
import {DeathEventValues, RoundWinEventValues, PlayerSpawnEventValues, ObjectDestroyedValues} from "../Data/GameEvent";

export function handleGameEvent(packet: GameEventPacket, match: Match) {
	switch (packet.event.name) {
		case 'player_death': {
			const values = <DeathEventValues>packet.event.values;
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
				killer:   values.attacker,
				assister: assister,
				victim:   values.userid,
				weapon:   values.weapon,
				tick:     match.tick
			});
		}
			break;
		case 'teamplay_round_win': {
			const values = <RoundWinEventValues>packet.event.values;
			if (values.winreason !== 6) {// 6 = timelimit
				match.rounds.push({
					winner:   values.team === 2 ? 'red' : 'blue',
					length:   values.round_time,
					end_tick: match.tick
				});
			}
		}
			break;
		case 'player_spawn': {
			const values    = <PlayerSpawnEventValues>packet.event.values;
			const userId    = values.userid;
			const userState = match.getUserInfo(userId);
			const player    = match.playerMap[userState.entityId];
			userState.team  = values.team === 2 ? 'red' : 'blue';
			const classId   = values.class;
			if (player) {
				player.classId = classId;
				player.team    = values.team;
			}
			if (!userState.classes[classId]) {
				userState.classes[classId] = 0;
			}
			userState.classes[classId]++;
		}
			break;
		case 'object_destroyed': {
			const values = <ObjectDestroyedValues>packet.event.values;
			delete match.buildings[values.index];
		}
			break;
		case 'teamplay_round_start':
			match.buildings = {};
			break;
	}
}
