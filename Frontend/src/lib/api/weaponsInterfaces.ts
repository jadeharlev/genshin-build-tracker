export interface Weapon {
    weaponID: number;
    baseWeaponKey: string;
    level: number;
    ascension: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    refinement: 1 | 2 | 3 | 4 | 5;
    userID: number;
}

export interface WeaponWithBaseData extends Weapon {
    name: string;
    weaponType: WeaponType;
    rarity: number;
    substatType: string;
    substatValue: number;
    icon: string;
}

export type WeaponType = "Sword" | "Claymore" | "Polearm" | "Bow" | "Catalyst";
export const WEAPON_TYPES: WeaponType[] = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];
export const WEAPON_RARITIES = [1,2,3,4,5] as const;