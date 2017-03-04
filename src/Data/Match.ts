import {PacketEntity} from "./PacketEntity";
import {ServerClass} from "./ServerClass";
import {SendTable} from "./SendTable";
import {StringTable} from "./StringTable";
import {GameEventDefinitionMap} from "./GameEvent";
import {BitStream} from "bit-buffer";
import {UserInfo} from "./UserInfo";
import {World} from "./World";
import {Player} from "./Player";
import {Death} from "./Death";
import {handleStringTable} from "../PacketHandler/StringTable";
import {handleSayText2} from "../PacketHandler/SayText2";
import {handleGameEvent} from "../PacketHandler/GameEvent";
import {handlePacketEntities} from "../PacketHandler/PacketEntities";
import {handleGameEventList} from "../PacketHandler/GameEventList";
import {handleDataTable} from "../PacketHandler/DataTable";
import {Weapon} from "./Weapon";
import {Team} from "./Team";
import {Building} from "./Building";
import {PlayerResource} from "./PlayerResource";

export class Match {
	tick: number;
	chat: any[];
	users: {[id: string]: UserInfo};
	deaths: Death[];
	rounds: any[];
	startTick: number;
	intervalPerTick: number;
	stringTables: StringTable[];
	serverClasses: ServerClass[];
	sendTables: SendTable[];
	staticBaseLines: BitStream[];
	eventDefinitions: GameEventDefinitionMap;
	world: World;
	players: Player[];
	playerMap: {[entityId: number]: Player};
	entityClasses: {[entityId: string]: ServerClass};
	sendTableMap: {[name: string]: SendTable};
	baseLineCache: {[serverClass: string]: PacketEntity};
	weaponMap: {[entityId: string]: Weapon};
	outerMap: {[outer: number]: number};
	teams: Team[];
	teamMap: {[entityId: string]: Team};
	version: number;
	buildings: {[entityId: string]: Building} = {};
	playerResources: PlayerResource[]         = [];

	constructor() {
		this.tick             = 0;
		this.chat             = [];
		this.users            = {};
		this.deaths           = [];
		this.rounds           = [];
		this.startTick        = 0;
		this.intervalPerTick  = 0;
		this.stringTables     = [];
		this.sendTables       = [];
		this.serverClasses    = [];
		this.staticBaseLines  = [];
		this.eventDefinitions = {};
		this.players          = [];
		this.playerMap        = {};
		this.world            = {
			boundaryMin: {x: 0, y: 0, z: 0},
			boundaryMax: {x: 0, y: 0, z: 0}
		};
		this.entityClasses    = {};
		this.sendTableMap     = {};
		this.baseLineCache    = {};
		this.weaponMap        = {};
		this.outerMap         = {};
		this.teams            = [];
		this.teamMap          = {};
		this.version          = 0;
	}

	getSendTable(name) {
		if (this.sendTableMap[name]) {
			return this.sendTableMap[name];
		}
		for (const table of this.sendTables) {
			if (table.name === name) {
				this.sendTableMap[name] = table;
				return table;
			}
		}
		throw new Error("unknown SendTable " + name);
	}

	getStringTable(name) {
		for (const table of this.stringTables) {
			if (table.name === name) {
				return table;
			}
		}
		return null;
	}

	getState() {
		const users = {};
		for (const key in this.users) {
			const user = this.users[key];
			if (this.users.hasOwnProperty(key)) {
				users[key] = {
					classes: user.classes,
					name:    user.name,
					steamId: user.steamId,
					userId:  user.userId,
				};
				if (user.team) {
					users[key].team = user.team;
				}
			}
		}

		return {
			'chat':            this.chat,
			'users':           users,
			'deaths':          this.deaths,
			'rounds':          this.rounds,
			'startTick':       this.startTick,
			'intervalPerTick': this.intervalPerTick
		};
	}

	handlePacket(packet) {
		switch (packet.packetType) {
			case 'packetEntities':
				handlePacketEntities(packet, this);
				break;
			case 'netTick':
				if (this.startTick === 0) {
					this.startTick = packet.tick;
				}
				this.tick = packet.tick;
				break;
			case 'serverInfo':
				this.intervalPerTick = packet.intervalPerTick;
				this.version         = packet.version;
				break;
			case 'sayText2':
				handleSayText2(packet, this);
				break;
			case 'dataTable':
				handleDataTable(packet, this);
				break;
			case 'stringTable':
				handleStringTable(packet, this);
				break;
			case 'gameEventList':
				handleGameEventList(packet, this);
				break;
			case 'gameEvent':
				handleGameEvent(packet, this);
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

	getUserInfoForEntity(entity: PacketEntity): UserInfo {
		for (const id of Object.keys(this.users)) {
			const user = this.users[id];
			if (user && user.entityId === entity.entityIndex) {
				return user;
			}
		}
		throw new Error('User not found for entity ' + entity.entityIndex);
	}

	getPlayerByUserId(userId: number): Player {
		for (const player of this.players) {
			if (player.user.userId === userId) {
				return player;
			}
		}
		throw new Error('player not found for user id');
	}

	get classBits() {
		return Math.ceil(Math.log(this.serverClasses.length) * Math.LOG2E)
	}
}
