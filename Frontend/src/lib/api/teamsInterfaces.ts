export interface Team {
    teamID: number;
    teamName: string;
    userID: number;

    firstCharacterID: number | null;
    secondCharacterID: number | null;
    thirdCharacterID: number | null;
    fourthCharacterID: number | null;
}

export interface TeamCharacterSlot {
    characterID: number | null;
    baseCharacterKey: string | null;
    name: string | null;
    level: number | null;
}

export interface TeamWithCharacters {
    teamID: number;
    teamName: string;
    userID: number;

    firstCharacterID: number | null;
    firstCharacterKey: string | null;
    firstCharacterName: string | null;
    firstCharacterLevel: number | null;

    secondCharacterID: number | null;
    secondCharacterKey: string | null;
    secondCharacterName: string | null;
    secondCharacterLevel: number | null;

    thirdCharacterID: number | null;
    thirdCharacterKey: string | null;
    thirdCharacterName: string | null;
    thirdCharacterLevel: number | null;

    fourthCharacterID: number | null;
    fourthCharacterKey: string | null;
    fourthCharacterName: string | null;
    fourthCharacterLevel: number | null;
}

export interface CreateTeamRequest {
    teamName: string;

    firstCharacterID?: number | null;
    secondCharacterID?: number | null;
    thirdCharacterID?: number | null;
    fourthCharacterID?: number | null;
}

export interface UpdateTeamRequest {
    teamName: string;

    firstCharacterID?: number | null;
    secondCharacterID?: number | null;
    thirdCharacterID?: number | null;
    fourthCharacterID?: number | null;
}