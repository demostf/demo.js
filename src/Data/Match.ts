import {BitStream} from 'bit-buffer';
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
import {StringTableEntry} from './StringTable';
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
			case 'createStringTable':
				if (packet.table.name === 'userinfo') {
					this.calculateUserInfo();
				}
				break;
			case 'sayText2':
				handleSayText2(packet, this);
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
				team: ''
			};
			this.users.set(userId, newUser);
			return newUser;
		}
		return user;
	}

	public getUserInfoForEntity(entity: PacketEntity): UserInfo | null {
		for (const user of this.users.values()) {
			if (user && user.entityId === entity.entityIndex) {
				return user;
			}
		}
		return this.calculateUserInfoByEntityId(entity.entityIndex);
	}

	private calculateUserInfo() {
		for (const [text, extraData] of this.parserState.userInfoEntries.entries()) {
			this.calculateUserInfoFromEntry(text, extraData);
		}
	}

	private calculateUserInfoByEntityId(entityId: number) {
		const text = `${entityId - 1}`;
		const extraData = this.parserState.userInfoEntries.get(text);
		if (!extraData) {
			throw new Error(`No user info in stringable for entity id ${entityId}`);
		}
		return this.calculateUserInfoFromEntry(text, extraData);
	}

	private calculateUserInfoFromEntry(text: string, extraData: BitStream): UserInfo {
		if (extraData.bitsLeft > (32 * 8)) {
			const name = extraData.readUTF8String(32);
			const userId = extraData.readUint32();
			const steamId = extraData.readUTF8String();
			if (steamId) {
				const userState = this.getUserInfo(userId);
				userState.name = name;
				userState.steamId = steamId;
				userState.entityId = parseInt(text, 10) + 1;
				return userState;
			} else {
				throw new Error(`No steamid for user info ${text}`);
			}
		} else {
			throw new Error();
		}
	}
}
