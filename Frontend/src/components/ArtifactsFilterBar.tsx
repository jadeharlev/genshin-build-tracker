import Select from "react-select";
import { ARTIFACT_RARITIES, ARTIFACT_TYPES, type ArtifactType } from "../lib/api/artifactsInterfaces";
import type { BaseArtifactSet } from "../lib/api/gameDataAPIInterfaces";

interface ArtifactsFilterBarProps {
    selectedTypes: ArtifactType[];
    onTypeToggle: (type: ArtifactType) => void;
    selectedRarities: number[];
    onRarityToggle: (rarity: number) => void;
    onCreateClick: () => void;
    artifactSets: BaseArtifactSet[];
    selectedSets: string[];
    onSetChange: (setKey: readonly BaseArtifactSet[]) => void;
}

const selectStyles = {
    // outer box
    control: (defaultStyles: any) => ({
        ...defaultStyles,
        minWidth: 200,
        backgroundColor: '#1c1c1cff',
        border: '1px solid #4a4a4aff',
        color: '#fff',
        '&:hover': {
            borderColor: '#6c6c6cff',
        },
    }),

    // dropdown menu itself
    option: (defaultStyles: any, state: any) => ({
        ...defaultStyles,
        backgroundColor: state.isSelected ? '#333333ff' : '#1c1c1cff',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#2a2a2aff',
        },
    }),

    // line at the top of the select menu
    menuList: (defaultStyles: any) => ({
        ...defaultStyles,
        background: "#1c1c1cff"
    }),

    // selected options in multi-select
    multiValue: (defaultStyles: any) => ({
        ...defaultStyles,
        backgroundColor: '#333333ff',
        color: '#fff',
    }),

    // label inside selected options
    multiValueLabel: (defaultStyles: any) => ({
        ...defaultStyles,
        color: '#fff',
    }),

    // typed text
    input: (defaultStyles: any) => ({
        ...defaultStyles,
        color: '#fff',
    }),
}

export function ArtifactsFilterBar({selectedTypes, onTypeToggle, selectedRarities, onRarityToggle, onCreateClick, artifactSets, selectedSets, onSetChange}: ArtifactsFilterBarProps) {
    const currentlySelectedSet = artifactSets.filter((set) => selectedSets.includes(set.key));
    return (
        <div className="characterFiltersBar">
            <div className="filterGroup">
                <div className="filterLabel">Set:</div>
                <Select defaultValue={currentlySelectedSet} onChange={(newValue) => onSetChange(newValue)} options={artifactSets}
                getOptionValue={(option) => option.key}
                getOptionLabel={(option) => option.name}
                isClearable
                isMulti={true}
                styles={selectStyles}
                />
            </div>
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