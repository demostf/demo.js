import {Match} from './Match';
import {EntityId} from './PacketEntity';
import {PlayerCondition} from './PlayerCondition';
import {UserInfo} from './UserInfo';
import {Vector} from './Vector';
import {Weapon} from './Weapon';

export enum LifeState {
	ALIVE = 0,
	DYING = 1,
	DEATH = 2,
	RESPAWNABLE = 3
}

export class Player {
	public match: Match;
	public user: UserInfo;
	public position: Vector = new Vector(0, 0, 0);
	public viewAngles: Vector = new Vector(0, 0, 0);
	public health: number = 0;
	public maxHealth: number = 0;
	public classId: number = 0;
	public team: number = 0;
	public viewAngle: number = 0;
	public weaponIds: number[] = [];
	public ammo: number[] = [];
	public lifeState: LifeState = LifeState.DEATH;
	public activeWeapon: number = 0;

	constructor(match: Match, userInfo: UserInfo) {
		this.match = match;
		this.user = userInfo;
	}

	get weapons(): Weapon[] {
		return this.weaponIds
			.map((id) => this.match.outerMap.get(id) as EntityId)
			.filter((entityId) => entityId > 0)
			.map((entityId) => this.match.weaponMap.get(entityId) as Weapon);
	}
}
