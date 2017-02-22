import {UserInfo} from "./UserInfo";
import {Vector} from "./Vector";
import {PlayerCondition} from "./PlayerCondition";
import {Weapon} from "./Weapon";
import {Match} from "./Match";

export enum LifeState {
	ALIVE       = 0,
	DYING       = 1,
	DEATH       = 2,
	RESPAWNABLE = 3
}

export class Player {
	match: Match;
	user: UserInfo;
	position: Vector     = new Vector(0, 0, 0);
	health: number       = 0;
	maxHealth: number    = 0;
	classId: number      = 0;
	team: number         = 0;
	viewAngle: number    = 0;
	weaponIds: number[]  = [];
	ammo: number[]       = [];
	lifeState: LifeState = LifeState.DEATH;
	activeWeapon: number = 0;

	constructor(match: Match, userInfo: UserInfo) {
		this.match = match;
		this.user  = userInfo;
	}

	get weapons(): Weapon[] {
		return this.weaponIds.map(id => this.match.weaponMap[this.match.outerMap[id]]);
	}
}
