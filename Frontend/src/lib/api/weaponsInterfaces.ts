export interface Weapon {
    WeaponID: number;
    BaseWeaponKey: string;
    Level: number;
    Ascension: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    Refinement: 1 | 2 | 3 | 4 | 5;
    UserID: number;
}

export interface WeaponWithBaseData extends Weapon {
    Name: string;
    WeaponType: WeaponType;
    Rarity: number;
    SubstatType: string;
    Icon: string;
}

export type WeaponType = "Sword" | "Claymore" | "Polearm" | "Bow" | "Catalyst";
export const WEAPON_TYPES: WeaponType[] = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];
export const WEAPON_RARITIES = [1,2,3,4,5] as const;