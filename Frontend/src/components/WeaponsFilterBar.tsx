import type { WeaponType } from "../lib/api/weaponsInterfaces";

interface WeaponsFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedTypes: string[];
    onTypeToggle: (type: WeaponType) => void;
    selectedRarities: number[];
    onRarityToggle: (rarity: number) => void;
    onCreateClick: () => void;
}

export function WeaponsFilterBar({
    searchQuery,
    onSearchChange,
    selectedTypes,
    onTypeToggle,
    selectedRarities,
    onRarityToggle,
    onCreateClick
} : WeaponsFilterBarProps) {
    return (
        <>
        <div className="dataFiltersBar">
            <input type="text" placeholder="Search weapons..." className="dataSearchInput" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />

        <div className="filterGroup">
            <span className="filterLabel">Type:</span>
            {["Sword", "Claymore", "Polearm", "Bow", "Catalyst"].map((type) => (
                <button key={type} className={`filterPill weapon ${selectedTypes.includes(type) ? 'active' : ''}`} onClick={() => onTypeToggle(type as WeaponType)}>{type}</button>
            ))}
        </div>

        <div className="filterGroup">
            <span className="filterLabel">Rarity:</span>
            {[1,2,3,4,5].map((rarity) => (
                <button key={rarity} className={`filterPill rarity${rarity} ${selectedRarities.includes(rarity) ? 'active' : ''}`} onClick={() => onRarityToggle(rarity)}>{rarity}★</button>
            ))}
        </div>

        <button className="createDataButton" onClick={onCreateClick}>+</button>
        </div>
        </>
    )
}