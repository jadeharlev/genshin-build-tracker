import { useState, type FormEvent } from "react";
import type { BaseCharacter } from "../../lib/api/gameDataAPIInterfaces";
import type { CreateCharacterRequest } from "../../lib/api/charactersInterfaces";

interface AddCharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCharacterRequest) => void;
    baseCharacters: BaseCharacter[];
    isSubmitting?: boolean;
}

export function AddCharacterModal({
    isOpen,
    onClose,
    onSubmit,
    baseCharacters,
    isSubmitting = false
}: AddCharacterModalProps) {
    const [selectedCharacterKey, setSelectedCharacterKey] = useState<string>('');
    const [level, setLevel] = useState<string>('1');
    const [ascension, setAscension] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
    const [constellationLevel, setConstellation] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
    const [talentLevel1, setTalentLevel1] = useState<string>('1');
    const [talentLevel2, setTalentLevel2] = useState<string>('1');
    const [talentLevel3, setTalentLevel3] = useState<string>('1');

    const selectedCharacter = baseCharacters.find((character: BaseCharacter) => character.key === selectedCharacterKey);

    const resetForm = () => {
        setSelectedCharacterKey('');
        setLevel('1');
        setAscension(0);
        setConstellation(0);
        setTalentLevel1('1');
        setTalentLevel2('1');
        setTalentLevel3('1');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const handleSubmit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if(!selectedCharacterKey) return;
        const levelNumber = parseInt(level) || 1;
        const talentLevel1Number = parseInt(talentLevel1) || 1;
        const talentLevel2Number = parseInt(talentLevel2) || 1;
        const talentLevel3Number = parseInt(talentLevel3) || 1;

        onSubmit({
            baseCharacterKey: selectedCharacterKey,
            name: selectedCharacter!.name,
            rarity: selectedCharacter!.rarity.toString() as "4" | "5",
            level: levelNumber,
            ascension,
            constellationLevel,
            talentLevel1: talentLevel1Number,
            talentLevel2: talentLevel2Number,
            talentLevel3: talentLevel3Number
        });
    }

    if(!isOpen) return null;

    const alphabeticallySortedCharacters = [...baseCharacters].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="modalOverlay" onClick={handleClose}>
            {/* stopPropagation prevents the modal from closing when clicking on modal content */}
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Add Character</h2>
                    <button className="modalCloseButton" onClick={handleClose}>x</button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">

                    {/* Character Selection */}
                    <div className="formGroup">
                        <label htmlFor="character">Character</label>
                        <select name="character" value={selectedCharacterKey} id="character" onChange={(e) => setSelectedCharacterKey(e.target.value)} required>
                            <option value="">Select a character...</option>
                            {alphabeticallySortedCharacters.map((character: BaseCharacter) => (
                                <option value={character.key} key={character.key}>
                                    {character.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Level and Ascension */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label htmlFor="level">Level</label>
                            <input type="number" id="level" min={0} max={100} value={level} onChange={(e) => setLevel(e.target.value)} required/>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="ascension">Ascension</label>
                            <select name="ascension" id="ascension" value={ascension} onChange={(e) => setAscension(parseInt(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6)} required>
                                {[0,1,2,3,4,5,6].map((ascension) => (
                                    <option key={ascension} value={ascension}>{ascension}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Constellation */}
                    <div className="formGroup">
                        <label htmlFor="constellation">Constellation</label>
                        <select id="constellation" value={constellationLevel} onChange={(e) => setConstellation(parseInt(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6)} required>
                            {[0,1,2,3,4,5,6].map((constellation) => (
                                    <option key={constellation} value={constellation}>C{constellation}</option>
                                ))}
                        </select>
                    </div>

                    {/* Talent Levels */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label htmlFor="talent1">Normal Attack</label>
                            <input type="number" id="talent1" min={1} max={13} value={talentLevel1} onChange={(e) => setTalentLevel1(e.target.value)} required />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="talent2">Elemental Skill</label>
                            <input type="number" id="talent2" min={1} max={13} value={talentLevel2} onChange={(e) => setTalentLevel2(e.target.value)} required />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="talent3">Elemental Burst</label>
                            <input type="number" id="talent3" min={1} max={13} value={talentLevel3} onChange={(e) => setTalentLevel3(e.target.value)} required />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="modalActions">
                        <button type="button" className="cancelButton" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submitButton" disabled={!selectedCharacterKey || isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Character"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}