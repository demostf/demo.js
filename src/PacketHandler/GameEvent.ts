import {GameEventPacket} from "../Data/Packet";
import {Match} from "../Data/Match";

export function handleGameEvent(packet: GameEventPacket, match: Match) {
	switch (packet.event.name) {
		case 'player_death':
			while (packet.event.values.assister > 256 && packet.event.values.assister < (1024 * 16)) {
				packet.event.values.assister -= 256;
			}
			const assister = packet.event.values.assister < 256 ? packet.event.values.assister : null;
			// todo get player names, not same id as the name string table (entity id)
			while (packet.event.values.attacker > 256) {
				packet.event.values.attacker -= 256;
			}
			while (packet.event.values.userid > 256) {
				packet.event.values.userid -= 256;
			}
			match.deaths.push({
				killer:   packet.event.values.attacker,
				assister: assister,
				victim:   packet.event.values.userid,
				weapon:   packet.event.values.weapon,
				tick:     match.tick
			});
			break;
		case 'teamplay_round_win':
			if (packet.event.values.winreason !== 6) {// 6 = timelimit
				match.rounds.push({
					winner:   packet.event.values.team === 2 ? 'red' : 'blue',
					length:   packet.event.values.round_time,
					end_tick: match.tick
				});
			}
			break;
		case 'player_spawn':
			const userId    = packet.event.values.userid;
			const userState = match.getUserInfo(userId);
			const player    = match.playerMap[userState.entityId];
			userState.team  = packet.event.values.team === 2 ? 'red' : 'blue';
			const classId   = packet.event.values.class;
			if (player) {
				player.classId = classId;
				player.team    = packet.event.values.team;
			}
			if (!userState.classes[classId]) {
				userState.classes[classId] = 0;
			}
			userState.classes[classId]++;
			break;
	}
}
