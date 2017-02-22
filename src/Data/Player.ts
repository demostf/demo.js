import {UserInfo} from "./UserInfo";
import {Vector} from "./Vector";
import {PlayerCondition} from "./PlayerCondition";

export enum LifeState {
	ALIVE       = 0,
	DYING       = 1,
	DEATH       = 2,
	RESPAWNABLE = 3
}

export interface Player {
	user: UserInfo;
	position: Vector;
	health: number;
	maxHealth: number;
	classId: number;
	team: number;
	viewAngle: number;
	weapons: number[];
	ammo: number[];
	lifeState: LifeState
}
