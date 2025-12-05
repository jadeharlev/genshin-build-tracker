import { useState, type FormEvent } from "react";
import type { BaseWeapon } from "../../lib/api/gameDataAPIInterfaces";
import type { Weapon } from "../../lib/api/weaponsInterfaces";

interface AddWeaponModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Weapon) => void;
    baseWeapons: BaseWeapon[];
    isSubmitting?: boolean;
}

export function AddWeaponModal({
    isOpen,
    onClose,
    onSubmit,
    baseWeapons,
    isSubmitting = false
}: AddWeaponModalProps) {
    const [selectedBaseWeaponKey, setSelectedBaseWeaponKey] = useState<string>('');
    const [level, setLevel] = useState<string>('1');
    const [ascension, setAscension] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
    const [refinement, setRefinement] = useState<1 | 2 | 3 | 4 | 5>(1);

    const selectedBaseWeapon = baseWeapons.find((weapon: BaseWeapon) => weapon.key === selectedBaseWeaponKey);

    const resetForm = () => {
        setSelectedBaseWeaponKey('');
        setLevel('1');
        setAscension(0);
        setRefinement(1);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const handleSubmit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if(!selectedBaseWeaponKey) return;
        const levelNumber = parseInt(level) || 1;
        onSubmit({
            weaponID: 0, // overridden anyways
            baseWeaponKey: selectedBaseWeapon!.key,
            level: levelNumber,
            ascension: ascension,
            refinement: refinement,
            userID: 0, // automatically handled anyways
        });
    }

    if(!isOpen) return null;

    const alphabeticallySortedWeapons = [...baseWeapons].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Add Weapon</h2>
                    <button className="modalCloseButton" onClick={handleClose}>x</button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">

                    {/* Weapon Selection */}
                    <div className="formGroup">
                        <label htmlFor="weapon">Weapon:</label>
                        <select name="weapon" value={selectedBaseWeaponKey} id="weapon" onChange={(e) => setSelectedBaseWeaponKey(e.target.value)} required>
                            <option value="">Select a weapon</option>
                            {alphabeticallySortedWeapons.map((weapon: BaseWeapon) => (
                                <option key={weapon.key} value={weapon.key}>{weapon.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level and Ascension */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label htmlFor="level">Level</label>
                            <input type="number" id="level" min={0} max={90} value={level} onChange={(e) => setLevel(e.target.value)} required/>
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

                    {/* Refinement */}
                    <div className="formGroup">
                        <label htmlFor="refinement">Refinement</label>
                        <select name="refinement" id="refinement" value={refinement} onChange={(e) => setRefinement(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)} required>
                            {[1,2,3,4,5].map((refinement) => (
                                <option key={refinement} value={refinement}>{refinement}</option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="modalActions">
                        <button type="button" className="cancelButton" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submitButton" disabled={!selectedBaseWeaponKey || isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Weapon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
