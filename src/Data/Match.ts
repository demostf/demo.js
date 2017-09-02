import {BitStream} from 'bit-buffer';
import {handleDataTable} from '../PacketHandler/DataTable';
import {handleGameEvent} from '../PacketHandler/GameEvent';
import {handleGameEventList} from '../PacketHandler/GameEventList';
import {handlePacketEntities} from '../PacketHandler/PacketEntities';
import {handleSayText2} from '../PacketHandler/SayText2';
import {handleStringTable, handleStringTables, handleStringTableUpdate} from '../PacketHandler/StringTable';
import {Building} from './Building';
import {Death} from './Death';
import {GameEventDefinition} from './GameEvent';
import {EntityId, PacketEntity} from './PacketEntity';
import {Player} from './Player';
import {PlayerResource} from './PlayerResource';
import {SendTable} from './SendTable';
import {ServerClass} from './ServerClass';
import {StringTable} from './StringTable';
import {Team, TeamNumber} from './Team';
import {UserInfo} from './UserInfo';
import {Weapon} from './Weapon';
import {World} from './World';

export class Match {
	public tick: number;
	public chat: any[];
	public users: Map<number, UserInfo>;
	public deaths: Death[];
	public rounds: any[];
	public startTick: number;
	public intervalPerTick: number;
	public staticBaseLines: BitStream[];
	public eventDefinitions: Map<number, GameEventDefinition>;
	public world: World;
	public playerEntityMap: Map<EntityId, Player>;
	public entityClasses: Map<EntityId, ServerClass> = new Map();
	public sendTables: Map<string, SendTable> = new Map();
	public baseLineCache: Map<ServerClass, PacketEntity> = new Map();
	public weaponMap: {[entityId: string]: Weapon};
	public outerMap: {[outer: number]: number};
	public teams: Map<TeamNumber, Team> = new Map();
	public teamEntityMap: Map<EntityId, Team>;
	public version: number;
	public buildings: {[entityId: string]: Building} = {};
	public playerResources: PlayerResource[] = [];
	public stringTables: StringTable[];
	public serverClasses: ServerClass[];

	constructor() {
		this.tick = 0;
		this.chat = [];
		this.users = new Map();
		this.deaths = [];
		this.rounds = [];
		this.startTick = 0;
		this.intervalPerTick = 0;
		this.stringTables = [];
		this.serverClasses = [];
		this.staticBaseLines = [];
		this.eventDefinitions = new Map();
		this.playerEntityMap = new Map();
		this.world = {
			boundaryMin: {x: 0, y: 0, z: 0},
			boundaryMax: {x: 0, y: 0, z: 0},
		};
		this.weaponMap = {};
		this.outerMap = {};
		this.teamEntityMap = new Map();
		this.version = 0;
	}

	public getSendTable(name) {
		const table = this.sendTables.get(name);
		if (table) {
			return table;
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
		for (const [key, user] of this.users.entries()) {
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
				handleStringTables(packet, this);
				break;
			case 'createStringTable':
				handleStringTable(packet, this);
				break;
			case 'updateStringTable':
				handleStringTableUpdate(packet, this);
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
		const user = this.users.get(userId);
		if (!user) {
			const newUser = {
				name: '',
				userId,
				steamId: '',
				classes: {},
				entityId: 0,
				team: '',
			};
			this.users.set(userId, newUser);
			return newUser;
		}
		return user;
	}

	public getUserInfoForEntity(entity: PacketEntity): UserInfo {
		for (const user of this.users.values()) {
			if (user && user.entityId === entity.entityIndex) {
				return user;
			}
		}
		throw new Error('User not found for entity ' + entity.entityIndex);
	}

	public getPlayerByUserId(userId: number): Player {
		for (const player of this.playerEntityMap.values()) {
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
