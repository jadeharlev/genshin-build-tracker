import { useEffect, useState, type FormEvent } from "react";
import { VALID_SUBSTATS, type ArtifactType, type ArtifactWithSetData, type UpdateArtifactRequest } from "../../lib/api/artifactsInterfaces";

interface EditArtifactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (artifactID: number, data: UpdateArtifactRequest) => void;
    artifact: ArtifactWithSetData | null;
    isSubmitting?: boolean;
}

export function EditArtifactModal({
    isOpen,
    onClose,
    onSubmit,
    artifact,
    isSubmitting = false,
}: EditArtifactModalProps) {
    const [level, setLevel] = useState<string>('0');

    const [stat1Type, setStat1Type] = useState<string>('ATK');
    const [stat1Value, setStat1Value] = useState<string>('0');
    const [stat2Type, setStat2Type] = useState<string>('');
    const [stat2Value, setStat2Value] = useState<string>('');
    const [stat3Type, setStat3Type] = useState<string>('');
    const [stat3Value, setStat3Value] = useState<string>('');
    const [stat4Type, setStat4Type] = useState<string>('');
    const [stat4Value, setStat4Value] = useState<string>('');

    useEffect(() => {
        if(artifact) {
            setLevel(artifact.level.toString());
            setStat1Type(artifact.firstStat.statType);
            setStat1Value(artifact.firstStat.value.toString());
            setStat2Type(artifact.secondStat?.statType || '');
            setStat2Value(artifact.secondStat?.value.toString() || '');
            setStat3Type(artifact.thirdStat?.statType || '');
            setStat3Value(artifact.thirdStat?.value.toString() || '');
            setStat4Type(artifact.fourthStat?.statType || '');
            setStat4Value(artifact.fourthStat?.value.toString() || '');
        }
    }, [artifact]);

    const handleClose = () => {
        onClose();
    }

    const handleSubmit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if(!artifact) return;
        const levelNumber = parseInt(level) || 1;

        onSubmit(artifact.artifactId, {
            rarity: artifact.rarity,
            artifactID: artifact.artifactId,
            artifactType: artifact.artifactType as ArtifactType,
            setKey: artifact.setKey,
            level: levelNumber,
            mainStatType: artifact.mainStatType,
            firstStat: {
                artifactStatID: artifact.firstStat.artifactStatID,
                statType: stat1Type,
                value: parseFloat(stat1Value) || 0,
            },
            secondStat: (stat2Type && artifact.secondStat?.artifactStatID !== undefined) ? {
                artifactStatID: artifact.secondStat.artifactStatID,
                statType: stat2Type,
                value: parseFloat(stat2Value) || 0,
            } : undefined,
            thirdStat: (stat3Type && artifact.thirdStat?.artifactStatID !== undefined) ? {
                artifactStatID: artifact.thirdStat.artifactStatID,
                statType: stat3Type,
                value: parseFloat(stat3Value) || 0,
            } : undefined,
            fourthStat: (stat4Type && artifact.fourthStat?.artifactStatID !== undefined) ? {
                artifactStatID: artifact.fourthStat.artifactStatID,
                statType: stat4Type,
                value: parseFloat(stat4Value) || 0,
            } : undefined,
        });
    }


    if(!isOpen || !artifact) return null;

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Add Artifact</h2>
                    <button className="modalCloseButton" onClick={handleClose}>x</button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">

                    {/*  Level */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label htmlFor="level">Level</label>
                            <input type="number" id="level" min={0} max={20} value={level} onChange={(e) => setLevel(e.target.value)} required/>
                        </div>
                    </div>

                    {/* Substats */}
                    <div className="formGroup">
                        <label>Substats</label>
                    </div>

                    {/* Substat 1 (Required) */}
                    <div className="formRow">
                        <div className="formGroup">
                            <select value={stat1Type} onChange={(e) => setStat1Type(e.target.value)}required>
                                {VALID_SUBSTATS.map((substat) => (
                                    <option key={substat} value={substat}>{substat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="formGroup">
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Value"
                                value={stat1Value}
                                onChange={(e) => setStat1Value(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Substat 2 (Optional) */}
                    <div className="formRow">
                        <div className="formGroup">
                            <select value={stat2Type} onChange={(e) => setStat2Type(e.target.value)}>
                                <option value="">None</option>
                                {VALID_SUBSTATS.map((substat) => (
                                    <option key={substat} value={substat}>{substat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="formGroup">
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Value"
                                value={stat2Value}
                                onChange={(e) => setStat2Value(e.target.value)}
                                disabled={!stat2Type}
                            />
                        </div>
                    </div>

                    {/* Substat 3 (Optional) */}
                    <div className="formRow">
                        <div className="formGroup">
                            <select value={stat3Type} onChange={(e) => setStat3Type(e.target.value)}>
                                <option value="">None</option>
                                {VALID_SUBSTATS.map((substat) => (
                                    <option key={substat} value={substat}>{substat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="formGroup">
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Value"
                                value={stat3Value}
                                onChange={(e) => setStat3Value(e.target.value)}
                                disabled={!stat3Type}
                            />
                        </div>
                    </div>

                    {/* Substat 4 (Optional) */}
                    <div className="formRow">
                        <div className="formGroup">
                            <select value={stat4Type} onChange={(e) => setStat4Type(e.target.value)}>
                                <option value="">None</option>
                                {VALID_SUBSTATS.map((substat) => (
                                    <option key={substat} value={substat}>{substat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="formGroup">
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Value"
                                value={stat4Value}
                                onChange={(e) => setStat4Value(e.target.value)}
                                disabled={!stat4Type}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="modalActions">
                        <button type="button" className="cancelButton" onClick={handleClose}>
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