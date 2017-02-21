import {UserInfo} from "./UserInfo";
import {Vector} from "./Vector";
import {PlayerCondition} from "./PlayerCondition";
export interface Player {
	user: UserInfo;
	position: Vector;
	health: number;
	maxHealth: number;
	classId: number;
	team: number;
	viewAngle: number;
}
