import { Match } from './Match';
import { UserInfo } from './UserInfo';
import { Vector } from './Vector';
import { Weapon } from './Weapon';
export declare enum LifeState {
    ALIVE = 0,
    DYING = 1,
    DEATH = 2,
    RESPAWNABLE = 3
}
export declare class Player {
    match: Match;
    user: UserInfo;
    position: Vector;
    viewAngles: Vector;
    health: number;
    maxHealth: number;
    classId: number;
    team: number;
    viewAngle: number;
    weaponIds: number[];
    ammo: number[];
    lifeState: LifeState;
    activeWeapon: number;
    constructor(match: Match, userInfo: UserInfo);
    readonly weapons: Weapon[];
}
