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
import {SendTable, SendTableName} from './SendTable';
import {ServerClass, ServerClassId} from './ServerClass';
import {StringTable} from './StringTable';
import {Team, TeamNumber} from './Team';
import {UserInfo} from './UserInfo';
import {Weapon} from './Weapon';
import {World} from './World';
import {Round} from './Round';
import {Chat} from './Chat';
import {Packet} from './Packet';
import {GameEventType} from './GameEventTypes';
import {ParserState} from './ParserState';
import {SendProp} from './SendProp';

export class Match implements ParserState {
	public tick: number = 0;
	public chat: Chat[] = [];
	public users: Map<number, UserInfo> = new Map();
	public deaths: Death[] = [];
	public rounds: Round[] = [];
	public startTick: number = 0;
	public intervalPerTick: number = 0;
	public staticBaseLines: Map<ServerClassId, BitStream> = new Map();
	public staticBaselineCache: Map<ServerClassId, SendProp[]> = new Map();
	public eventDefinitions: Map<number, GameEventDefinition<GameEventType>> = new Map();
	public world: World = {
		boundaryMin: {x: 0, y: 0, z: 0},
		boundaryMax: {x: 0, y: 0, z: 0},
	};
	public playerEntityMap: Map<EntityId, Player> = new Map();
	public entityClasses: Map<EntityId, ServerClass> = new Map();
	public sendTables: Map<SendTableName, SendTable> = new Map();
	public instanceBaselines: [Map<EntityId, SendProp[]>, Map<EntityId, SendProp[]>] = [new Map(), new Map()];
	public weaponMap: Map<EntityId, Weapon> = new Map();
	public outerMap: Map<number, EntityId> = new Map();
	public teams: Map<TeamNumber, Team> = new Map();
	public teamEntityMap: Map<EntityId, Team> = new Map();
	public version: number = 0;
	public buildings: Map<EntityId, Building> = new Map();
	public playerResources: PlayerResource[] = [];
	public stringTables: StringTable[] = [];
	public serverClasses: ServerClass[] = [];

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

	public handlePacket(packet: Packet) {
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
}
