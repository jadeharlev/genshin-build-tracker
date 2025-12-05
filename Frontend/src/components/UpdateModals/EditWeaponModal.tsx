import { useEffect, useState, type FormEvent } from "react";
import type { Weapon, WeaponWithBaseData } from "../../lib/api/weaponsInterfaces";

interface EditWeaponModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Weapon) => void;
    weapon: WeaponWithBaseData | null;
    isSubmitting?: boolean;
}

export function EditWeaponModal({
    isOpen,
    onClose,
    onSubmit,
    weapon,
    isSubmitting = false
}: EditWeaponModalProps) {
    const [level, setLevel] = useState<string>('1');
    const [ascension, setAscension] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
    const [refinement, setRefinement] = useState<1 | 2 | 3 | 4 | 5>(1);

    useEffect(() => {
        if(weapon) {
            setLevel(weapon.level.toString());
            setAscension(weapon.ascension);
            setRefinement(weapon.refinement);
        }
    }, [weapon]);

    if(!isOpen) return null;

    const handleClose = () => {
        onClose();
    }

    const handleSubmit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if(!weapon) return;
        const levelNumber = parseInt(level) || 1;

        onSubmit({
            weaponID: weapon.weaponID,
            baseWeaponKey: weapon.baseWeaponKey,
            level: levelNumber,
            ascension: ascension,
            refinement: refinement,
            userID: weapon.userID,
        });
    }

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Add Weapon</h2>
                    <button className="modalCloseButton" onClick={handleClose}>x</button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">

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
                        <button type="submit" className="submitButton" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
