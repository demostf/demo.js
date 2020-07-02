"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleGameEvent(packet, match) {
    switch (packet.event.name) {
        case 'player_death':
            handlePlayerDeath(packet.event, match);
            break;
        case 'teamplay_round_win':
            handleRoundWin(packet.event, match);
            break;
        case 'player_spawn':
            handlePlayerSpawn(packet.event, match);
            break;
        case 'object_destroyed':
            handleObjectDestroyed(packet.event, match);
            break;
        case 'teamplay_round_start':
            handleRoundStart(packet.event, match);
            break;
    }
}
exports.handleGameEvent = handleGameEvent;
function handlePlayerDeath(event, match) {
    const values = event.values;
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
        tick: match.tick
    });
}
function handleRoundWin(event, match) {
    const values = event.values;
    if (values.winreason !== 6) { // 6 = timelimit
        match.rounds.push({
            winner: values.team === 2 ? 'red' : 'blue',
            length: values.round_time,
            end_tick: match.tick
        });
    }
}
function handlePlayerSpawn(event, match) {
    const values = event.values;
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
function handleObjectDestroyed(event, match) {
    const values = event.values;
    match.buildings.delete(values.index);
}
function handleRoundStart(event, match) {
    match.buildings.clear();
}
//# sourceMappingURL=GameEvent.js.map