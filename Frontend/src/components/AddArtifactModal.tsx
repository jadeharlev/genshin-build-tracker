import { useState, type FormEvent } from "react";
import type { BaseArtifactSet } from "../lib/api/gameDataAPIInterfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ARTIFACT_TYPES, type ArtifactType, VALID_MAIN_STATS, VALID_SUBSTATS, type CreateArtifactRequest } from "../lib/api/artifactsInterfaces";
import { artifactsApi } from "../lib/api/artifactsAPI";
import toast from "react-hot-toast";

interface AddArtifactModalProps {
    isOpen: boolean;
    onClose: () => void;
    artifactSets: BaseArtifactSet[];
}

export function AddArtifactModal({
    isOpen,
    onClose,
    artifactSets
}: AddArtifactModalProps) {
    const queryClient = useQueryClient();

    const [setKey, setSetKey] = useState<string>('');
    const [artifactType, setArtifactType] = useState<ArtifactType>('Flower');
    const [rarity, setRarity] = useState<string>('5');
    const [level, setLevel] = useState<string>('0');
    const [mainStatType, setMainStatType] = useState<string>('HP');

    const [stat1Type, setStat1Type] = useState<string>('ATK');
    const [stat1Value, setStat1Value] = useState<string>('0');
    const [stat2Type, setStat2Type] = useState<string>('');
    const [stat2Value, setStat2Value] = useState<string>('');
    const [stat3Type, setStat3Type] = useState<string>('');
    const [stat3Value, setStat3Value] = useState<string>('');
    const [stat4Type, setStat4Type] = useState<string>('');
    const [stat4Value, setStat4Value] = useState<string>('');

    const createMutation = useMutation({
        mutationFn: artifactsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['artifacts']});
            toast.success('Artifact added successfully!');
            resetForm();
            onClose();
        },
        onError: () => {
            toast.error('Failed to add artifact.');
        }
    });

    const resetForm = () => {
        setSetKey('');
        setArtifactType('Flower');
        setRarity('5');
        setLevel('0');
        setMainStatType('HP');
        setStat1Type('ATK');
        setStat1Value('0');
        setStat2Type('');
        setStat2Value('')
        setStat3Type('');
        setStat3Value('');
        setStat4Type('');
        setStat4Value('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const handleSubmit = (formEvent: FormEvent) => {
        formEvent.preventDefault();
        if(!setKey) {
            toast.error('Please select an artifact set.')
            return;
        }

        const request: CreateArtifactRequest = {
            artifactType,
            rarity: parseInt(rarity) as 1 | 2 | 3 | 4 | 5,
            setKey,
            level: parseInt(level) || 0,
            mainStatType,
            firstStat: {
                statType: stat1Type,
                value: parseFloat(stat1Value) || 0,
            },
        };

        if(stat2Type) {
            request.secondStat = {
                statType: stat2Type,
                value: parseFloat(stat2Value) || 0,
            };
        }
        if(stat3Type) {
            request.thirdStat = {
                statType: stat3Type,
                value: parseFloat(stat3Value) || 0,
            };
        }
        if(stat4Type) {
            request.fourthStat = {
                statType: stat4Type,
                value: parseFloat(stat4Value) || 0,
            };
        }

        createMutation.mutate(request);
    };

    const validMainStats = VALID_MAIN_STATS[artifactType] || [];

    const handleTypeChange = (newType: ArtifactType) => {
        setArtifactType(newType);
        const newValidStats = VALID_MAIN_STATS[newType];
        if(!newValidStats.includes(mainStatType as any)) {
            setMainStatType(newValidStats[0]);
        }
    };

    if(!isOpen) return null;

    const sortedSets = [...artifactSets].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="modalOverlay" onClick={handleClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Add Artifact</h2>
                    <button className="modalCloseButton" onClick={handleClose}>x</button>
                </div>

                <form onSubmit={handleSubmit} className="modalForm">

                    {/* Set Selection */}
                    <div className="formGroup">
                        <label htmlFor="setKey">Artifact Set</label>
                        <select name="setKey" value={setKey} id="setKey" onChange={(e) => setSetKey(e.target.value)} required>
                            <option value="">Select an artifact set...</option>
                            {sortedSets.map((set) => (
                                <option value={set.key} key={set.key}>
                                    {set.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Type, Rarity, Level */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label htmlFor="artifactType">Type</label>
                            <select name="artifactType" id="artifactType" value={artifactType} onChange={(e) => handleTypeChange(e.target.value as ArtifactType)} required>
                                {ARTIFACT_TYPES.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="rarity">Rarity</label>
                            <select name="rarity" id="rarity" value={rarity} onChange={(e) => setRarity(e.target.value)} required>
                                {[1,2,3,4,5].map((rarity) => (
                                    <option key={rarity} value={rarity.toString()}>{rarity}★</option>
                                ))}
                            </select>
                        </div>
                        <div className="formGroup">
                            <label htmlFor="level">Level</label>
                            <input type="number" id="level" min={0} max={20} value={level} onChange={(e) => setLevel(e.target.value)} required/>
                        </div>
                    </div>

                    {/* Main Stat */}
                    <div className="formGroup">
                        <label htmlFor="mainStat">Main Stat</label>
                        <select id="mainStat" value={mainStatType} onChange={(e) => setMainStatType(e.target.value)} required>
                            {validMainStats.map((stat) => (
                                    <option key={stat} value={stat}>{stat}</option>
                                ))}
                        </select>
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
                        <button type="submit" className="submitButton" disabled={!setKey || createMutation.isPending}>
                            {createMutation.isPending ? "Adding..." : "Add Artifact"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}