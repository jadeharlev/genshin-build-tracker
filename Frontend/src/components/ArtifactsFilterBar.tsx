import { ARTIFACT_RARITIES, ARTIFACT_TYPES, type ArtifactType } from "../lib/api/artifactsInterfaces";

interface ArtifactsFilterBarProps {
    selectedTypes: ArtifactType[];
    onTypeToggle: (type: ArtifactType) => void;
    selectedRarities: number[];
    onRarityToggle: (rarity: number) => void;
    onCreateClick: () => void;
}

export function ArtifactsFilterBar({selectedTypes, onTypeToggle, selectedRarities, onRarityToggle, onCreateClick}: ArtifactsFilterBarProps) {
    return (
        <div className="characterFiltersBar">
            <div className="filterGroup">
                <span className="filterLabel">Type:</span>
                {ARTIFACT_TYPES.map((type) => (
                    <button
                    key={type}
                    className={`filterPill artifact ${selectedTypes.includes(type) ? 'active' : ''}`}
                    onClick={() => onTypeToggle(type)}>
                        {type}
                    </button>
                ))}
            </div>

            <div className="filterGroup">
                <span className="filterLabel">Rarity:</span>
                {ARTIFACT_RARITIES.map((rarity) => (
                    <button
                    key={rarity}
                    className={`filterPill rarity${rarity} ${selectedRarities.includes(rarity) ? 'active' : ''}`}
                    onClick={() => onRarityToggle(rarity)}>
                        {rarity}★
                    </button>
                ))}
            </div>

            <button className="createCharacterButton" onClick={onCreateClick}>
                +
            </button>
        </div>
    )
}