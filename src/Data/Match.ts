import {BitStream} from 'bit-buffer';
import {handleDataTable} from '../PacketHandler/DataTable';
import {handleGameEvent} from '../PacketHandler/GameEvent';
import {handleGameEventList} from '../PacketHandler/GameEventList';
import {handlePacketEntities} from '../PacketHandler/PacketEntities';
import {handleSayText2} from '../PacketHandler/SayText2';
import {handleStringTable} from '../PacketHandler/StringTable';
import {Building} from './Building';
import {Death} from './Death';
import {GameEventDefinitionMap} from './GameEvent';
import {PacketEntity} from './PacketEntity';
import {Player} from './Player';
import {PlayerResource} from './PlayerResource';
import {SendTable} from './SendTable';
import {ServerClass} from './ServerClass';
import {StringTable} from './StringTable';
import {Team} from './Team';
import {UserInfo} from './UserInfo';
import {Weapon} from './Weapon';
import {World} from './World';

export class Match {
	public tick: number;
	public chat: any[];
	public users: { [id: string]: UserInfo };
	public deaths: Death[];
	public rounds: any[];
	public startTick: number;
	public intervalPerTick: number;
	public staticBaseLines: BitStream[];
	public eventDefinitions: GameEventDefinitionMap;
	public world: World;
	public players: Player[];
	public playerMap: { [entityId: number]: Player };
	public entityClasses: { [entityId: string]: ServerClass };
	public sendTableMap: { [name: string]: SendTable };
	public baseLineCache: { [serverClass: string]: PacketEntity };
	public weaponMap: { [entityId: string]: Weapon };
	public outerMap: { [outer: number]: number };
	public teams: Team[];
	public teamMap: { [entityId: string]: Team };
	public version: number;
	public buildings: { [entityId: string]: Building } = {};
	public playerResources: PlayerResource[] = [];
	public stringTables: StringTable[];
	public sendTables: SendTable[];
	public serverClasses: ServerClass[];

	constructor() {
		this.tick = 0;
		this.chat = [];
		this.users = {};
		this.deaths = [];
		this.rounds = [];
		this.startTick = 0;
		this.intervalPerTick = 0;
		this.stringTables = [];
		this.sendTables = [];
		this.serverClasses = [];
		this.staticBaseLines = [];
		this.eventDefinitions = {};
		this.players = [];
		this.playerMap = {};
		this.world = {
			boundaryMin: {x: 0, y: 0, z: 0},
			boundaryMax: {x: 0, y: 0, z: 0},
		};
		this.entityClasses = {};
		this.sendTableMap = {};
		this.baseLineCache = {};
		this.weaponMap = {};
		this.outerMap = {};
		this.teams = [];
		this.teamMap = {};
		this.version = 0;
	}

	public getSendTable(name) {
		if (this.sendTableMap[name]) {
			return this.sendTableMap[name];
		}
		for (const table of this.sendTables) {
			if (table.name === name) {
				this.sendTableMap[name] = table;
				return table;
			}
		}
		throw new Error('unknown SendTable ' + name);
	}

	public getStringTable(name) {
		for (const table of this.stringTables) {
			if (table.name === name) {
				return table;
			}
		}
		return null;
	}

	public getState() {
		const users = {};
		for (const key in this.users) {
			if (this.users.hasOwnProperty(key)) {
				const user = this.users[key];
				users[key] = {
					classes: user.classes,
					name: user.name,
					steamId: user.steamId,
					userId: user.userId,
				};
				if (user.team) {
					users[key].team = user.team;
				}
			}
		}

		return {
			chat: this.chat,
			users,
			deaths: this.deaths,
			rounds: this.rounds,
			startTick: this.startTick,
			intervalPerTick: this.intervalPerTick,
		};
	}

	public handlePacket(packet) {
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
				this.version = packet.version;
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

	public getUserInfo(userId: number): UserInfo {
		// no clue why it does this
		// only seems to be the case with per user ready
		while (userId > 256) {
			userId -= 256;
		}
		if (!this.users[userId]) {
			this.users[userId] = {
				name: '',
				userId,
				steamId: '',
				classes: {},
				entityId: 0,
				team: '',
			};
		}
		return this.users[userId];
	}

	public getUserInfoForEntity(entity: PacketEntity): UserInfo {
		for (const id of Object.keys(this.users)) {
			const user = this.users[id];
			if (user && user.entityId === entity.entityIndex) {
				return user;
			}
		}
		throw new Error('User not found for entity ' + entity.entityIndex);
	}

	public getPlayerByUserId(userId: number): Player {
		for (const player of this.players) {
			if (player.user.userId === userId) {
				return player;
			}
		}
		throw new Error('player not found for user id');
	}

	get classBits() {
		return Math.ceil(Math.log(this.serverClasses.length) * Math.LOG2E);
	}
}
