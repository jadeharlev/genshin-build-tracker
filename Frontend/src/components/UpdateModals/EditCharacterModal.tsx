import { useEffect, useState, type FormEvent } from "react";
import type { CharacterWithBaseData, UpdateCharacterRequest } from "../../lib/api/charactersInterfaces";

interface EditCharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (characterID: number, data: UpdateCharacterRequest) => void;
    character: CharacterWithBaseData | null;
    isSubmitting?: boolean;
}

export function EditCharacterModal({
    isOpen,
    onClose,
    onSubmit,
    character,
    isSubmitting = false,
}: EditCharacterModalProps) {
    const [level, setLevel] = useState<string>('1');
    const [ascension, setAscension] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
    const [constellationLevel, setConstellation] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
    const [talentLevel1, setTalentLevel1] = useState<string>('1');
    const [talentLevel2, setTalentLevel2] = useState<string>('1');
    const [talentLevel3, setTalentLevel3] = useState<string>('1');

    useEffect(() => {
        if(character) {
            setLevel(character.level.toString());
            setAscension(character.ascension);
            setConstellation(character.constellationLevel);
            setTalentLevel1(character.talentLevel1.toString());
            setTalentLevel2(character.talentLevel2.toString());
            setTalentLevel3(character.talentLevel3.toString());
        }
    }, [character]);

    const handleClose = () => {
        onClose();
    }

    const handleSubmit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if(!character) return;
        const levelNumber = parseInt(level) || 1;
        const talentLevel1Number = parseInt(talentLevel1) || 1;
        const talentLevel2Number = parseInt(talentLevel2) || 1;
        const talentLevel3Number = parseInt(talentLevel3) || 1;

        onSubmit(character.characterID, {
            baseCharacterKey: character.baseCharacterKey,
            name: character.name,
            rarity: character.rarity,
            characterID: character.characterID,
            level: levelNumber,
            ascension,
            constellationLevel,
            talentLevel1: talentLevel1Number,
            talentLevel2: talentLevel2Number,
            talentLevel3: talentLevel3Number,
        });
    }

    if(!isOpen || !character) return null;

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Edit {character.name}</h2>
                    <button className="modalCloseButton" onClick={handleClose}>x</button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">
                    {/* Level and Ascension */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label htmlFor="editLevel">Level</label>
                            <input type="number" id="editLevel" value={level} onChange={(e) => setLevel(e.target.value)} min={1} max={100} required/>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="editAscension">Ascension</label>
                            <select id="editAscension" value={ascension} onChange={(e) => setAscension(parseInt(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6)}>
                                {[0, 1, 2, 3, 4, 5, 6].map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="editConstellation">Constellation Level</label>
                        <select id="editConstellation" value={constellationLevel} onChange={(e) => setConstellation(parseInt(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6)} required>
                            {[0, 1, 2, 3, 4, 5, 6].map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    {/* Talent Levels */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label htmlFor="editTalentLevel1">Normal Attack</label>
                            <input type="number" id="editTalentLevel1" value={talentLevel1} onChange={(e) => setTalentLevel1(e.target.value)} min={1} max={13} required/>
                        </div>
                        <div className="formGroup">
                            <label htmlFor="editTalentLevel2">Elemental Skill</label>
                            <input type="number" id="editTalentLevel2" value={talentLevel2} onChange={(e) => setTalentLevel2(e.target.value)} min={1} max={13} required/>
                        </div>
                        <div className="formGroup">
                            <label htmlFor="editTalentLevel3">Elemental Burst</label>
                            <input type="number" id="editTalentLevel3" value={talentLevel3} onChange={(e) => setTalentLevel3(e.target.value)} min={1} max={13} required/>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="modalActions">
                        <button type="button" className="cancelButton" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="submitButton" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}