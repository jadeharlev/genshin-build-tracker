import { useState, useEffect, useMemo, type FormEvent } from "react";
import type { BuildWithDetails, UpdateBuildRequest } from "../../lib/api/buildsInterfaces";
import type { Character } from "../../lib/api/charactersInterfaces";
import type { BaseArtifactSet, BaseCharacter, BaseWeapon } from "../../lib/api/gameDataAPIInterfaces";
import type { Artifact } from "../../lib/api/artifactsInterfaces";
import type { Weapon } from "../../lib/api/weaponsInterfaces";

interface EditBuildModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (buildID: number, data: UpdateBuildRequest) => void;
    build: BuildWithDetails | null;
    characters: Character[];
    baseCharacters: BaseCharacter[];
    weapons: Weapon[];
    baseWeapons: BaseWeapon[];
    artifacts: Artifact[];
    baseArtifactSets: BaseArtifactSet[];
    isSubmitting?: boolean;
}

export function EditBuildModal({
    isOpen,
    onClose,
    onSubmit,
    build,
    characters,
    baseCharacters,
    weapons,
    baseWeapons,
    artifacts,
    baseArtifactSets,
    isSubmitting = false
}: EditBuildModalProps) {
    const [buildName, setBuildName] = useState<string>('');
    const [selectedCharacterID, setSelectedCharacterID] = useState<number | null>(null);
    const [selectedWeaponID, setSelectedWeaponID] = useState<number | null>(null);
    const [selectedFlowerID, setSelectedFlowerID] = useState<number | null>(null);
    const [selectedFeatherID, setSelectedFeatherID] = useState<number | null>(null);
    const [selectedSandsID, setSelectedSandsID] = useState<number | null>(null);
    const [selectedGobletID, setSelectedGobletID] = useState<number | null>(null);
    const [selectedCircletID, setSelectedCircletID] = useState<number | null>(null);

    useEffect(() => {
        if(build) {
            setBuildName(build.buildName);
            setSelectedCharacterID(build.characterID);
            setSelectedWeaponID(build.weaponID);
            setSelectedFlowerID(build.flowerID);
            setSelectedFeatherID(build.featherID);
            setSelectedSandsID(build.sandsID);
            setSelectedGobletID(build.gobletID);
            setSelectedCircletID(build.circletID);
        }
    }, [build]);

    const getWeaponName = (baseWeaponKey: string) => {
        const baseWeapon = baseWeapons.find(baseWeapon => baseWeapon.key === baseWeaponKey);
        return baseWeapon ? baseWeapon.name : baseWeaponKey;
    }

    const getArtifactSetName = (artifactSetKey: string) => {
        const artifactSet = baseArtifactSets.find(set => set.key === artifactSetKey);
        return artifactSet ? artifactSet.name : artifactSetKey;
    }

    const formatArtifactSubstats = (artifact: Artifact) : string => {
        if(!artifact.firstStat) return '';
        let returnString = "";
        returnString += artifact.firstStat.statType + ": " + artifact.firstStat.value;
        if(artifact.firstStat.statType.includes("%")) returnString += "%";
        if(artifact.secondStat) {
            returnString += ", ";
            returnString += artifact.secondStat.statType + ": " + artifact.secondStat.value;
            if(artifact.secondStat.statType.includes("%")) returnString += "%";
        }
        if(artifact.thirdStat) {
            returnString += ", ";
            returnString += artifact.thirdStat.statType + ": " + artifact.thirdStat.value;
            if(artifact.thirdStat.statType.includes("%")) returnString += "%";
        }
        if(artifact.fourthStat) {
            returnString += ", ";
            returnString += artifact.fourthStat.statType + ": " + artifact.fourthStat.value;
            if(artifact.fourthStat.statType.includes("%")) returnString += "%";
        }

        return returnString;
    }

    const formatArtifactOption = (artifact: Artifact) : string => {
        const setName = getArtifactSetName(artifact.setKey);
        const substats = formatArtifactSubstats(artifact);
        const rarity = '★'.repeat(artifact.rarity);

        let label = `${setName} +${artifact.level} ${rarity} | ${artifact.mainStatType} | ${substats}`;
        return label;
    }

    const selectedCharacterWeaponType = useMemo(() => {
        if(!selectedCharacterID) return null;
        const character = characters.find(character => character.characterID === selectedCharacterID);
        if(!character) return null;
        const baseCharacter = baseCharacters.find(baseCharacter => baseCharacter.key === character.baseCharacterKey);
        return baseCharacter ? baseCharacter.weaponType : null;
    }, [selectedCharacterID, characters, baseCharacters]);

    const filteredWeapons = useMemo(() => {
        if(!selectedCharacterWeaponType) return [];
        return weapons.filter(weapon => {
            const baseWeapon = baseWeapons.find(baseWeapon => baseWeapon.key === weapon.baseWeaponKey);
            return baseWeapon?.weaponType.toLowerCase() === selectedCharacterWeaponType.toLowerCase();
        });
    }, [weapons, baseWeapons, selectedCharacterWeaponType]);

    const flowerArtifacts = useMemo(() => {
        return artifacts.filter(artifact => artifact.artifactType === 'Flower');
    }, [artifacts]);

    const featherArtifacts = useMemo(() => {
        return artifacts.filter(artifact => artifact.artifactType === 'Feather');
    }, [artifacts]);

    const sandsArtifacts = useMemo(() => {
        return artifacts.filter(artifact => artifact.artifactType === 'Sands');
    }, [artifacts]);

    const gobletArtifacts = useMemo(() => {
        return artifacts.filter(artifact => artifact.artifactType === 'Goblet');
    }, [artifacts]);

    const circletArtifacts = useMemo(() => {
        return artifacts.filter(artifact => artifact.artifactType === 'Circlet');
    }, [artifacts]);

    const sortedCharacters = useMemo(() => {
        return [...characters].sort((a, b) => a.name.localeCompare(b.name));
    }, [characters]);

    const handleClose = () => {
        onClose();
    }

    const handleCharacterChange = (value: string) => {
        const characterID = parseInt(value);
        if(isNaN(characterID)) {
            setSelectedCharacterID(null);
        } else {
            setSelectedCharacterID(characterID);
            setSelectedWeaponID(null);
        }
    }

    const handleSubmit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if(!build || !buildName.trim() || !selectedCharacterID) {
            return;
        }

        onSubmit(build.buildID, {
            buildName: buildName.trim(),
            characterID: selectedCharacterID,
            weaponID: selectedWeaponID,
            flowerID: selectedFlowerID,
            featherID: selectedFeatherID,
            sandsID: selectedSandsID,
            gobletID: selectedGobletID,
            circletID: selectedCircletID,
        });
    };

    if(!isOpen || !build) return null;

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="modalContent modalContentWide" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Edit Build</h2>
                    <button className="modalCloseButton" onClick={handleClose}>x</button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">
                    <div className="formGroup">
                        <label htmlFor="editBuildName">Build Name</label>
                        <input
                            type="text" id="editBuildName" value={buildName}
                            onChange={(e) => setBuildName(e.target.value)}
                            placeholder="Enter build name..."
                            maxLength={255}
                            required />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="editBuildCharacter">Character *</label>
                        <select
                            id="editBuildCharacter"
                            value={selectedCharacterID ?? ''}
                            onChange={(e) => handleCharacterChange(e.target.value)}
                            required>
                            <option value="">Select a character...</option>
                            {sortedCharacters.map((character) => (
                                <option key={character.characterID} value={character.characterID}>
                                    {character.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="editBuildWeapon">
                            Weapon {selectedCharacterWeaponType && `(${selectedCharacterWeaponType})`}
                        </label>
                        <select
                            id="editBuildWeapon"
                            value={selectedWeaponID ?? ''}
                            onChange={(e) => {
                                const weaponID = parseInt(e.target.value);
                                if(isNaN(weaponID)) {
                                    setSelectedWeaponID(null);
                                } else {
                                    setSelectedWeaponID(weaponID);
                                }
                            }} disabled={!selectedCharacterID}
                            className="buildSelectWide">
                            <option value="">No weapon selected</option>
                            {filteredWeapons.map((weapon) => (
                                <option key={weapon.weaponID} value={weapon.weaponID}>
                                    {getWeaponName(weapon.baseWeaponKey)} (Lv.{weapon.level} R{weapon.refinement})
                                </option>
                            ))}
                        </select>
                        {selectedCharacterID && filteredWeapons.length === 0 && (
                            <p className="formHint">No {selectedCharacterWeaponType}s available.</p>
                        )}
                    </div>

                    <div className="formGroup">
                        <label>Artifacts</label>
                    </div>

                    <div className="buildArtifactSelects">
                        <div className="formGroup">
                            <label htmlFor="editBuildFlower">Flower</label>
                            <select
                                id="editBuildFlower"
                                value={selectedFlowerID ?? ''}
                                onChange={(e) => {
                                    const artifactID = parseInt(e.target.value);
                                    if(isNaN(artifactID)) {
                                        setSelectedFlowerID(null);
                                    } else {
                                        setSelectedFlowerID(artifactID);
                                    }
                                }}
                                className="buildSelectWide"
                                >
                                <option value="">None</option>
                                {flowerArtifacts.map((artifact) => (
                                    <option key={artifact.artifactId} value={artifact.artifactId}>
                                        {formatArtifactOption(artifact)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="editBuildFeather">Feather</label>
                            <select
                                id="editBuildFeather"
                                value={selectedFeatherID ?? ''}
                                onChange={(e) => {
                                    const artifactID = parseInt(e.target.value);
                                    if(isNaN(artifactID)) {
                                        setSelectedFeatherID(null);
                                    } else {
                                        setSelectedFeatherID(artifactID);
                                    }
                                }}
                                className="buildSelectWide"
                                >
                                <option value="">None</option>
                                {featherArtifacts.map((artifact) => (
                                    <option key={artifact.artifactId} value={artifact.artifactId}>
                                        {formatArtifactOption(artifact)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="editBuildSands">Sands</label>
                            <select
                                id="editBuildSands"
                                value={selectedSandsID ?? ''}
                                onChange    ={(e) => {
                                    const artifactID = parseInt(e.target.value);
                                    if(isNaN(artifactID)) {
                                        setSelectedSandsID(null);
                                    } else {
                                        setSelectedSandsID(artifactID);
                                    }
                                }}
                                className="buildSelectWide"
                                >
                                <option value="">None</option>
                                {sandsArtifacts.map((artifact) => (
                                    <option key={artifact.artifactId} value={artifact.artifactId}>
                                        {formatArtifactOption(artifact)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="editBuildGoblet">Goblet</label>
                            <select
                                id="editBuildGoblet"
                                value={selectedGobletID ?? ''}
                                onChange={(e) => {
                                    const artifactID = parseInt(e.target.value);
                                    if(isNaN(artifactID)) {
                                        setSelectedGobletID(null);
                                    } else {
                                        setSelectedGobletID(artifactID);
                                    }
                                }}
                                className="buildSelectWide"
                                >
                                <option value="">None</option>
                                {gobletArtifacts.map((artifact) => (
                                    <option key={artifact.artifactId} value={artifact.artifactId}>
                                        {formatArtifactOption(artifact)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="editBuildCirclet">Circlet</label>
                            <select
                                id="editBuildCirclet"
                                value={selectedCircletID ?? ''}
                                onChange={(e) => {
                                    const artifactID = parseInt(e.target.value);
                                    if(isNaN(artifactID)) {
                                        setSelectedCircletID(null);
                                    } else {
                                        setSelectedCircletID(artifactID);
                                    }
                                }}
                                className="buildSelectWide"
                                >
                                <option value="">None</option>
                                {circletArtifacts.map((artifact) => (
                                    <option key={artifact.artifactId} value={artifact.artifactId}>
                                        {formatArtifactOption(artifact)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modalActions">
                        <button type="button" className="cancelButton" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="submitButton" disabled={!buildName.trim() || isSubmitting || !selectedCharacterID}>
                            {isSubmitting ? 'Saving...' : 'Save Build'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}