import {Entity} from "./Entity";
import {ServerClass} from "./ServerClass";
import {SendTable} from "./SendTable";
import {StringTable} from "./StringTable";
import {SendProp} from "./SendProp";
import {GameEventDefinitionMap} from "./GameEvent";
import {BitStream} from "bit-buffer";
import {UserInfo} from "./UserInfo";
import {World} from "./World";
import {Vector} from "./Vector";
import {Player} from "./Player";
export class Match {
	tick: number;
	chat: any[];
	users: UserInfo[];
	deaths: any[];
	rounds: any[];
	startTick: number;
	intervalPerTick: number;
	entities: (Entity|null)[];
	stringTables: StringTable[];
	serverClasses: ServerClass[];
	sendTables: SendTable[];
	instanceBaselines: SendProp[][][];
	staticBaseLines: BitStream[];
	eventDefinitions: GameEventDefinitionMap;
	world: World;
	players: Player[];
	playerMap: {[entityId: number]: Player};

	constructor() {
		this.tick              = 0;
		this.chat              = [];
		this.users             = [];
		this.deaths            = [];
		this.rounds            = [];
		this.startTick         = 0;
		this.intervalPerTick   = 0;
		this.entities          = [];
		this.stringTables      = [];
		this.sendTables        = [];
		this.serverClasses     = [];
		this.entities          = [];
		this.instanceBaselines = [[], []];
		this.staticBaseLines   = [];
		this.eventDefinitions  = {};
		this.players           = [];
		this.playerMap         = {};
		this.world             = {
			boundaryMin: {x: 0, y: 0, z: 0},
			boundaryMax: {x: 0, y: 0, z: 0}
		}
	}

	getSendTable(name) {
		for (var i = 0; i < this.sendTables.length; i++) {
			if (this.sendTables[i].name === name) {
				return this.sendTables[i];
			}
		}
		throw new Error("unknown SendTable " + name);
	}

	getStringTable(name) {
		for (var i = 0; i < this.stringTables.length; i++) {
			if (this.stringTables[i].name === name) {
				return this.stringTables[i];
			}
		}
		return null;
	}

	getState() {
		return {
			'chat':            this.chat,
			'users':           this.users,
			'deaths':          this.deaths,
			'rounds':          this.rounds,
			'startTick':       this.startTick,
			'intervalPerTick': this.intervalPerTick
		};
	}

	handlePacket(packet) {
		switch (packet.packetType) {
			case 'packetEntities':
				for (const entity of this.entities) {
					if (entity) {
						this.handleEntity(entity);
					}
				}
				break;
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
				for (const table of <StringTable[]>packet.tables) {
					if (table.name === 'userinfo') {
						for (const userData of table.entries) {
							if (userData.extraData) {
								if (userData.extraData.bitsLeft > (32*8)) {
									const name      = userData.extraData.readUTF8String(32);
									const userId    = userData.extraData.readUint32();
									const steamId   = userData.extraData.readUTF8String();
									if (steamId) {
										const userState    = this.getUserInfo(userId);
										userState.name     = name;
										userState.steamId  = steamId;
										userState.entityId = parseInt(userData.text, 10) + 1;
									}
								}

							}
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
						const assister = packet.event.values.assister < 256 ? packet.event.values.assister : null;
						// todo get player names, not same id as the name string table (entity id)
						while (packet.event.values.attacker > 256) {
							packet.event.values.attacker -= 256;
						}
						while (packet.event.values.userid > 256) {
							packet.event.values.userid -= 256;
						}
						this.deaths.push({
							killer:   packet.event.values.attacker,
							assister: assister,
							victim:   packet.event.values.userid,
							weapon:   packet.event.values.weapon,
							tick:     this.tick
						});
						break;
					case 'teamplay_round_win':
						if (packet.event.values.winreason !== 6) {// 6 = timelimit
							this.rounds.push({
								winner:   packet.event.values.team === 2 ? 'red' : 'blue',
								length:   packet.event.values.round_time,
								end_tick: this.tick
							});
						}
						break;
					case 'player_spawn':
						const userId    = packet.event.values.userid;
						const userState = this.getUserInfo(userId);
						const player = this.playerMap[userState.entityId];
						if (!userState.team) { //only register first spawn
							userState.team = packet.event.values.team === 2 ? 'red' : 'blue'
						}
						const classId = packet.event.values.class;
						if (player) {
							player.classId = classId;
						}
						if (!userState.classes[classId]) {
							userState.classes[classId] = 0;
						}
						userState.classes[classId]++;
						break;
				}
				break;
		}
	}

	getUserInfo(userId: number): UserInfo {
		// no clue why it does this
		// only seems to be the case with per user ready
		while (userId > 256) {
			userId -= 256;
		}
		if (!this.users[userId]) {
			this.users[userId] = {
				name:     '',
				userId:   userId,
				steamId:  '',
				classes:  {},
				entityId: 0,
				team:     ''
			}
		}
		return this.users[userId];
	}

	getUserInfoForEntity(entity: Entity): UserInfo {
		for (const user of this.users) {
			if (user && user.entityId === entity.entityIndex) {
				return user;
			}
		}
		throw new Error('User not found for entity ' + entity.entityIndex);
	}

	get classBits() {
		return Math.ceil(Math.log(this.serverClasses.length) * Math.LOG2E)
	}

	handleEntity(entity: Entity) {
		switch (entity.serverClass.name) {
			case 'CWorld':
				this.world.boundaryMin = <Vector>entity.getProperty('DT_WORLD', 'm_WorldMins').value;
				this.world.boundaryMax = <Vector>entity.getProperty('DT_WORLD', 'm_WorldMaxs').value;
				break;
			case 'CTFPlayer':
				const player: Player = (this.playerMap[entity.entityIndex]) ? this.playerMap[entity.entityIndex] : {
						user:      this.getUserInfoForEntity(entity),
						position:  new Vector(0, 0, 0),
						maxHealth: 0,
						health:    0,
					};
				if (!this.playerMap[entity.entityIndex]) {
					this.playerMap[entity.entityIndex] = player;
					this.players.push(player);
				}

				for (const prop of entity.updatedProps) {
					const propName = prop.definition.ownerTableName + '.' + prop.definition.name;
					// console.log(propName, prop.value);
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
					}
				}

		}
		entity.updatedProps = [];
	}
}
