export interface BaseCombatWeapon {
	className: string;
	owner: number;
}

export interface CWeaponMedigun {
	className: 'CWeaponMedigun';
	healTarget: number;
	chargeLevel: number;
}

export type Weapon = BaseCombatWeapon|
	CWeaponMedigun;
