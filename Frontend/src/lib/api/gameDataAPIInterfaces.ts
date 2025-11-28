export interface BaseCharacter {
    key: string;
    name: string;
    element: string;
    weaponType: string;
    rarity: number;
    region: string;
    title: string;
    description: string;
    icon: string;
}

export interface BaseWeapon {
    key: string;
    name: string;
    weaponType: string;
    rarity: number;
    mainStatType: string;
    mainStatValue: number;
    subStatType: string;
    subStatValue: number;
    description: string;
    icon: string;
}

export interface BaseArtifactSet {
    key: string;
    name: string;
    maxRarity: number;
    twoPieceEffect: string;
    fourPieceEffect: string;
    flowerIcon: string;
    featherIcon: string;
    sandsIcon: string;
    gobletIcon: string;
    circletIcon: string;
}