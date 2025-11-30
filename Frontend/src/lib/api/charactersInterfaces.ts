export interface Character {
    characterID: number;
    baseCharacterKey: string;
    rarity: "4" | "5";
    name: string;
    level: number;
    ascension: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    constellationLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    talentLevel1: number;
    talentLevel2: number;
    talentLevel3: number;
    userID: number;
}

export interface CreateCharacterRequest {
    baseCharacterKey: string;
    level: number;
    name: string;
    rarity: "4" | "5";
    ascension: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    constellation: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    talentLevel1: number;
    talentLevel2: number;
    talentLevel3: number;
}

export interface UpdateCharacterRequest {
    characterID: number;
    level: number;
    ascension: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    constellation: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    talentLevel1: number;
    talentLevel2: number;
    talentLevel3: number;
}

export interface CharacterWithBaseData extends Character {
    element: string;
    weaponType: string;
    region: string;
    icon: string;
}