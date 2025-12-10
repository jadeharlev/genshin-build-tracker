export interface Build {
    buildID: number;
    buildName: string;
    userID: number;
    characterID: number;
    weaponID: number | null;
    flowerID: number | null;
    featherID: number | null;
    sandsID: number | null;
    gobletID: number | null;
    circletID: number | null;
}

export interface BuildWithDetails {
    buildID: number;
    buildName: string;
    userID: number;

    characterID: number;
    characterName: string;
    characterKey: string;
    characterLevel: number;

    weaponID: number | null;
    weaponKey: string | null;
    weaponLevel: number | null;
    weaponRefinement: number | null;

    flowerID: number | null;
    featherID: number | null;
    sandsID: number | null;
    gobletID: number | null;
    circletID: number | null;

    flowerSetKey: string | null;
    featherSetKey: string | null;
    sandsSetKey: string | null;
    gobletSetKey: string | null;
    circletSetKey: string | null;

    flowerMainStat: string | null;
    featherMainStat: string | null;
    sandsMainStat: string | null;
    gobletMainStat: string | null;
    circletMainStat: string | null;

    flowerLevel: number | null;
    featherLevel: number | null;
    sandsLevel: number | null;
    gobletLevel: number | null;
    circletLevel: number | null;

    flowerRarity: number | null;
    featherRarity: number | null;
    sandsRarity: number | null;
    gobletRarity: number | null;
    circletRarity: number | null;
}

export interface CreateBuildRequest {
    buildName: string;
    characterID: number;
    weaponID?: number | null;
    flowerID?: number | null;
    featherID?: number | null;
    sandsID?: number | null;
    gobletID?: number | null;
    circletID?: number | null;
}

export interface UpdateBuildRequest {
    buildName?: string;
    characterID?: number;
    weaponID?: number | null;
    flowerID?: number | null;
    featherID?: number | null;
    sandsID?: number | null;
    gobletID?: number | null;
    circletID?: number | null;
}