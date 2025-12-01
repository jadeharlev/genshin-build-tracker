export interface Artifact {
    artifactID: number;
    artifactType: string;
    rarity: 1 | 2 | 3 | 4 | 5;
    setKey: string;
    level: number;
    mainStatType: string;
    userID: number;
    firstStat: ArtifactStat;
    secondStat: ArtifactStat | null;
    thirdStat: ArtifactStat | null;
    fourthStat: ArtifactStat | null;
}

export interface ArtifactWithSetData extends Artifact {
    setName: string;
    icon: string;
}

export interface CreateArtifactRequest {
    artifactType: ArtifactType;
    rarity: 1 | 2 | 3 | 4 | 5;
    setKey: string;
    level: number;
    mainStatType: string;
    firstStat: CreateArtifactStatRequest;
    secondStat?: CreateArtifactStatRequest;
    thirdStat?: CreateArtifactStatRequest;
    fourthStat?: CreateArtifactStatRequest;
}

export interface UpdateArtifactRequest {
    artifactID: number;
    artifactType: ArtifactType;
    rarity: 1 | 2 | 3 | 4 | 5;
    setKey: string;
    level: number;
    mainStatType: string;
    firstStat: CreateArtifactStatRequest;
    secondStat?: CreateArtifactStatRequest;
    thirdStat?: CreateArtifactStatRequest;
    fourthStat?: CreateArtifactStatRequest;
}

export type ArtifactType = "Flower" | "Feather" | "Sands" | "Goblet" | "Circlet";
export type MainStatType = "HP" | "ATK" | "DEF" | "HP%" | "ATK%" | "DEF%" | "EM" | "ER%" | "Physical%" | "Pyro%" | "Hydro%" | "Electro%" | "Cryo%" | "Anemo%" | "Geo%" | "Dendro%" | "CritRate" | "CritDMG" | "HealingBonus";
export type SubStatType = "HP" | "ATK" | "DEF" | "HP%" | "ATK%" | "DEF%" | "EM" | "ER%" | "CritRate" | "CritDMG";

export interface CreateArtifactStatRequest {
    statType: string;
    value: number;
}

export interface ArtifactStat {
    artifactStatID: number;
    statType: string;
    value: number;
}

export const VALID_MAIN_STATS: Record<ArtifactType, MainStatType[]> = {
    "Flower": ["HP"],
    "Feather": ["ATK"],
    "Sands": ["HP%", "ATK%", "DEF%", "EM", "ER%"],
    "Goblet": ["HP%", "ATK%", "DEF%", "EM", "Physical%", "Pyro%", "Hydro%", "Electro%", "Cryo%", "Anemo%", "Geo%", "Dendro%"],
    "Circlet": ["HP%", "ATK%", "DEF%", "EM", "CritRate", "CritDMG", "HealingBonus"]
};

export const VALID_SUBSTATS: SubStatType[] = [
    "HP",
    "ATK",
    "DEF",
    "HP%",
    "ATK%",
    "DEF%",
    "EM",
    "ER%",
    "CritRate",
    "CritDMG"
];

export const ARTIFACT_TYPES: ArtifactType[] = ["Flower", "Feather", "Sands", "Goblet", "Circlet"];
export const ARTIFACT_RARITIES = [1, 2, 3, 4, 5] as const;