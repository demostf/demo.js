var State = function () {
	this.tick = 0;
	this.state = {
		chat           : [],
		users          : {},
		deaths         : [],
		rounds         : [],
		startTick      : 0,
		intervalPerTick: 0
	};
};

State.prototype.get = function () {
	return this.state;
};

State.prototype.updateState = function (packet) {
	switch (packet.packetType) {
		case 'netTick':
			if (this.state.startTick === 0) {
				this.state.startTick = packet.tick;
			}
			this.tick = packet.tick;
			break;
		case 'serverInfo':
			this.state.intervalPerTick = packet.intervalPerTick;
			break;
		case 'sayText2':
			this.state.chat.push({
				kind: packet.kind,
				from: packet.from,
				text: packet.text,
				tick: this.tick
			});
			break;
		case 'stringTable':
			if (packet.tables.userinfo) {
				for (var j = 0; j < packet.tables.userinfo.length; j++) {
					if (packet.tables.userinfo[j].extraData) {
						var name = packet.tables.userinfo[j].extraData[0];
						var steamId = packet.tables.userinfo[j].extraData[2];
						var userId = packet.tables.userinfo[j].extraData[1].charCodeAt(0);
						this.state.users[userId] = {
							name   : name,
							userId : userId,
							steamId: steamId,
							classes: {}
						}
					}
				}
			}
			break;
		case 'gameEvent':
			switch (packet.event.name) {
				case 'player_death':
					// todo get player names, not same id as the name string table
					var assister = packet.event.values.assister < 32 ? packet.event.values.assister : null;
					this.state.deaths.push({
						killer  : packet.event.values.attacker,
						assister: assister,
						victim  : packet.event.values.userid,
						weapon  : packet.event.values.weapon,
						tick    : this.tick
					});
					break;
				case 'teamplay_round_win':
					if (packet.event.values.winreason !== 6) {// 6 = timelimit
						this.state.rounds.push({
							winner  : packet.event.values.team === 2 ? 'red' : 'blue',
							length  : packet.event.values.round_time,
							end_tick: this.tick
						});
					}
					break;
				case 'player_spawn':
					userId = packet.event.values.userid;
					if (this.state.users[userId]) {
						if (!this.state.users[userId].team) { //only register first spawn
							this.state.users[userId].team = packet.event.values.team === 2 ? 'red' : 'blue'
						}
						var classId = packet.event.values.class;
						if (!this.state.users[userId].classes[classId]) {
							this.state.users[userId].classes[classId] = 0;
						}
						this.state.users[userId].classes[classId]++;
					}
					break;
			}
			break;
	}
};

module.exports = State;
