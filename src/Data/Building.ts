import {Vector} from './Vector';

export interface BaseBuilding {
	builder: number;
	position: Vector;
	level: number;
	maxHealth: number;
	health: number;
	isBuilding: boolean;
	isSapped: boolean;
	team: number;
	angle: number;
}

export interface Sentry extends BaseBuilding {
	type: 'sentry';
	shieldLevel: number;
	playerControlled: boolean;
	autoAimTarget: number;
	ammoShells: number;
	ammoRockets: number;
	isMini: boolean;
}

export interface Dispenser extends BaseBuilding {
	type: 'dispenser';
	healing: number[];
	metal: number;
}

export interface Teleporter extends BaseBuilding {
	type: 'teleporter';
	isEntrance: boolean;
	otherEnd: number;
	rechargeTime: number;
	rechargeDuration: number;
	timesUsed: number;
	yawToExit: number;
}

export type Building = Sentry | Dispenser | Teleporter;
