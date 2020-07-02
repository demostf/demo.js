export interface BaseCombatWeapon {
    className: string;
    owner: number;
}
export interface CWeaponMedigun {
    className: 'CWeaponMedigun';
    healTarget: number;
    chargeLevel: number;
}
export declare type Weapon = BaseCombatWeapon | CWeaponMedigun;
