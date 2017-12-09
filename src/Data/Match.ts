import {handleGameEvent} from '../PacketHandler/GameEvent';
import {handlePacketEntities} from '../PacketHandler/PacketEntities';
import {handleSayText2} from '../PacketHandler/SayText2';
import {Building} from './Building';
import {Chat} from './Chat';
import {Death} from './Death';
import {Packet} from './Packet';
import {EntityId, PacketEntity} from './PacketEntity';
import {ParserState} from './ParserState';
import {Player} from './Player';
import {PlayerResource} from './PlayerResource';
import {Round} from './Round';
import {Team, TeamNumber} from './Team';
import {UserInfo} from './UserInfo';
import {Weapon} from './Weapon';
import {World} from './World';

export class Match {
	public tick: number = 0;
	public chat: Chat[] = [];
	public users: Map<number, UserInfo> = new Map();
	public deaths: Death[] = [];
	public rounds: Round[] = [];
	public startTick: number = 0;
	public intervalPerTick: number = 0;
	public world: World = {
		boundaryMin: {x: 0, y: 0, z: 0},
		boundaryMax: {x: 0, y: 0, z: 0}
	};
	public playerEntityMap: Map<EntityId, Player> = new Map();
	public weaponMap: Map<EntityId, Weapon> = new Map();
	public outerMap: Map<number, EntityId> = new Map();
	public teams: Map<TeamNumber, Team> = new Map();
	public teamEntityMap: Map<EntityId, Team> = new Map();
	public buildings: Map<EntityId, Building> = new Map();
	public playerResources: PlayerResource[] = [];
	public readonly parserState: ParserState;

	constructor(parserState: ParserState) {
		this.parserState = parserState;
	}

	public getState() {
		const users = {};
		for (const userEntity of this.parserState.userInfo.values()) {
			this.getUserInfo(userEntity.userId);
		}
		for (const [key, user] of this.users.entries()) {
			users[key] = {
				classes: user.classes,
				name: user.name,
				steamId: user.steamId,
				userId: user.userId
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
			intervalPerTick: this.intervalPerTick
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
				break;
			case 'userMessage':
				switch (packet.userMessageType) {
					case 'sayText2':
						handleSayText2(packet, this);
						break;
				}
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
			const entityInfo = this.parserState.getUserEntityInfo(userId);
			const newUser = {
				classes: {},
				team: '',
				...entityInfo
			};
			this.users.set(userId, newUser);
			return newUser;
		} else if (!user.steamId) {
			const entityInfo = this.parserState.getUserEntityInfo(userId);
			if (entityInfo.steamId) {
				user.steamId = entityInfo.steamId;
				user.entityId = entityInfo.entityId;
				user.name = entityInfo.name;
			}
		}
		return user;
	}

	public getUserInfoForEntity(entity: PacketEntity): UserInfo | null {
		for (const userEntity of this.parserState.userInfo.values()) {
			if (userEntity && userEntity.entityId === entity.entityIndex) {
				return this.getUserInfo(userEntity.userId);
			}
		}
		return null;
	}
}
