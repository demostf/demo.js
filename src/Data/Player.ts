import {UserInfo} from "./UserInfo";
import {Vector} from "./Vector";
export interface Player {
	user: UserInfo;
	position: Vector;
	health: number;
	maxHealth: number;
	classId: number;
}
