var Match = function () {
	this.tick = 0;
	this.chat = [];
	this.users = {};
	this.deaths = [];
	this.rounds = [];
	this.startTick = 0;
	this.intervalPerTick = 0;
	this.entities = [];
	this.stringTables = [];
	this.sendTables = [];
	this.serverClasses = [];
	this.entities = [];
	this.instanceBaselines = [[],[]];
	this.staticBaseLines = [];
};

Match.prototype.getSendTable = function (name) {
	for (var i = 0; i < this.sendTables.length; i++) {
		if (this.sendTables[i].name === name) {
			return this.sendTables[i];
		}
	}
	return null;
};

Match.prototype.getStringTable = function (name) {
	for (var i = 0; i < this.stringTables.length; i++) {
		if (this.stringTables[i].name === name) {
			return this.stringTables[i];
		}
	}
	return null;
};

Match.prototype.getState = function () {
	return {
		'chat'           : this.chat,
		'users'          : this.users,
		'deaths'         : this.deaths,
		'rounds'         : this.rounds,
		'startTick'      : this.startTick,
		'intervalPerTick': this.intervalPerTick
	};
};

Match.prototype.handlePacket = function (packet) {
	var userState;
	switch (packet.packetType) {
		case 'netTick':
			if (this.startTick === 0) {
				this.startTick = packet.tick;
			}
			this.tick = packet.tick;
			break;
		case 'serverInfo':
			this.intervalPerTick = packet.intervalPerTick;
			break;
		case 'sayText2':
			this.chat.push({
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
						userState = this.getUserState(userId);
						userState.name = name;
						userState.steamId = steamId;
					}
				}
			}
			break;
		case 'gameEvent':
			switch (packet.event.name) {
				case 'player_death':
					while (packet.event.values.assister > 256 && packet.event.values.assister < (1024 * 16)) {
						packet.event.values.assister -= 256;
					}
					var assister = packet.event.values.assister < 256 ? packet.event.values.assister : null;
					// todo get player names, not same id as the name string table
					while (packet.event.values.attacker > 256) {
						packet.event.values.attacker -= 256;
					}
					while (packet.event.values.userid > 256) {
						packet.event.values.userid -= 256;
					}
					this.deaths.push({
						killer  : packet.event.values.attacker,
						assister: assister,
						victim  : packet.event.values.userid,
						weapon  : packet.event.values.weapon,
						tick    : this.tick
					});
					break;
				case 'teamplay_round_win':
					if (packet.event.values.winreason !== 6) {// 6 = timelimit
						this.rounds.push({
							winner  : packet.event.values.team === 2 ? 'red' : 'blue',
							length  : packet.event.values.round_time,
							end_tick: this.tick
						});
					}
					break;
				case 'player_spawn':
					userId = packet.event.values.userid;
					userState = this.getUserState(userId);
					if (!userState.team) { //only register first spawn
						userState.team = packet.event.values.team === 2 ? 'red' : 'blue'
					}
					var classId = packet.event.values.class;
					if (!userState.classes[classId]) {
						userState.classes[classId] = 0;
					}
					userState.classes[classId]++;
					break;
			}
			break;
	}
};

Match.prototype.getUserState = function (userId) {
	// no clue why it does this
	// only seems to be the case with per user ready
	while (userId > 256) {
		userId -= 256;
	}
	if (!this.users[userId]) {
		this.users[userId] = {
			name   : null,
			userId : userId,
			steamId: null,
			classes: {}
		}
	}
	return this.users[userId];
};

Object.defineProperty(Match.prototype, 'classBits', {
	get: function () {
		return Math.ceil(Math.log(this.serverClasses.length) * Math.LOG2E)
	}
});

module.exports = Match;
