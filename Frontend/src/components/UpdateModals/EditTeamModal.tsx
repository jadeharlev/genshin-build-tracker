import { useState, useEffect, useMemo, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { UpdateTeamRequest, TeamWithCharacters } from "../../lib/api/teamsInterfaces";
import type { Character } from "../../lib/api/charactersInterfaces";

interface EditTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (teamID: number, data: UpdateTeamRequest) => void;
    team: TeamWithCharacters | null;
    characters: Character[];
    isSubmitting?: boolean;
}

export function EditTeamModal({
    isOpen,
    onClose,
    onSubmit,
    team,
    characters,
    isSubmitting = false
}: EditTeamModalProps) {
    const [teamName, setTeamName] = useState<string>('');
    const [slot1, setSlot1] = useState<number | null>(null);
    const [slot2, setSlot2] = useState<number | null>(null);
    const [slot3, setSlot3] = useState<number | null>(null);
    const [slot4, setSlot4] = useState<number | null>(null);

    useEffect(() => {
        if(team) {
            setTeamName(team.teamName);
            setSlot1(team.firstCharacterID);
            setSlot2(team.secondCharacterID);
            setSlot3(team.thirdCharacterID);
            setSlot4(team.fourthCharacterID);
        }
    }, [team]);

    const selectedCharacterIDs = useMemo(() => {
        return [slot1, slot2, slot3, slot4].filter((id): id is number => id !== null);
    }, [slot1, slot2, slot3, slot4]);

    const getAvailableCharacters = (currentSlotValue: number | null) => {
        return characters.filter(
            (character) => character.characterID === currentSlotValue || !selectedCharacterIDs.includes(character.characterID)
        )
    }

    const handleClose = () => {
        onClose();
    }

    const handleSubmit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if(!team || !teamName.trim()) {
            toast.error("Please enter a team name.");
            return;
        }

        onSubmit(team.teamID, {
            teamName: teamName.trim(),
            firstCharacterID: slot1,
            secondCharacterID: slot2,
            thirdCharacterID: slot3,
            fourthCharacterID: slot4,
        });
    };

    const handleSlotChange = (setter: React.Dispatch<React.SetStateAction<number | null>>) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if(value === '') {
            setter(null);
        } else {
            setter(parseInt(value));
        }
    }

    if(!isOpen) return null;

    const availableCharactersSlot1 = getAvailableCharacters(slot1);
    const availableCharactersSlot2 = getAvailableCharacters(slot2);
    const availableCharactersSlot3 = getAvailableCharacters(slot3);
    const availableCharactersSlot4 = getAvailableCharacters(slot4);

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Edit Team</h2>
                    <button className="modalCloseButton" onClick={handleClose}>x</button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">
                    <div className="formGroup">
                        <label htmlFor="teamName">Team Name</label>
                        <input
                            type="text" id="teamName" value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter team name..."
                            maxLength={255}
                            required />
                    </div>

                    <div className="formGroup">
                        <label>Team Members</label>
                    </div>

                    <div className="teamSlotsGrid">
                        <div className="teamSlotSelect">
                            <label htmlFor="editSlot1">Slot 1</label>
                            <select id="editSlot1" value={slot1 ?? ''} onChange={handleSlotChange(setSlot1)}>
                                <option value="">-- Empty --</option>
                                {availableCharactersSlot1.sort((a, b) => a.name.localeCompare(b.name)).map((character) => (
                                    <option key={character.characterID} value={character.characterID}>
                                        {character.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="teamSlotSelect">
                            <label htmlFor="editSlot2">Slot 2</label>
                            <select id="editSlot2" value={slot2 ?? ''} onChange={handleSlotChange(setSlot2)}>
                                <option value="">-- Empty --</option>
                                {availableCharactersSlot2.sort((a, b) => a.name.localeCompare(b.name)).map((character) => (
                                    <option key={character.characterID} value={character.characterID}>
                                        {character.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="teamSlotSelect">
                            <label htmlFor="editSlot3">Slot 3</label>
                            <select id="editSlot3" value={slot3 ?? ''} onChange={handleSlotChange(setSlot3)}>
                                <option value="">-- Empty --</option>
                                {availableCharactersSlot3.sort((a, b) => a.name.localeCompare(b.name)).map((character) => (
                                    <option key={character.characterID} value={character.characterID}>
                                        {character.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="teamSlotSelect">
                            <label htmlFor="editSlot4">Slot 4</label>
                            <select id="editSlot4" value={slot4 ?? ''} onChange={handleSlotChange(setSlot4)}>
                                <option value="">-- Empty --</option>
                                {availableCharactersSlot4.sort((a, b) => a.name.localeCompare(b.name)).map((character) => (
                                    <option key={character.characterID} value={character.characterID}>
                                        {character.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modalActions">
                        <button type="button" className="cancelButton" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="submitButton" disabled={!teamName.trim() || isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}