interface CharacterFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedElements: string[];
    onElementToggle: (element: string) => void;
    selectedRarities: number[];
    onRarityToggle: (rarity: number) => void;
    selectedWeaponTypes: string[];
    onWeaponTypeToggle: (weaponType: string) => void;
    onCreateClick: () => void;
}

const ELEMENTS = ['Pyro', 'Cryo', 'Hydro', 'Electro', 'Dendro', 'Geo', 'Anemo'];
const RARITIES = [4, 5];
const WEAPON_TYPES = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];

export function CharactersFilterBar({
    searchQuery,
    onSearchChange,
    selectedElements,
    onElementToggle,
    selectedRarities,
    onRarityToggle,
    selectedWeaponTypes,
    onWeaponTypeToggle,
    onCreateClick
} : CharacterFilterBarProps) {
    return (
        <>
        <div className="characterFiltersBar">
            <input type="text" placeholder="Search characters..." className="characterSearchInput" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
        <div className="filterGroup">
            <span className="filterLabel">Element:</span>
            {ELEMENTS.map((element) => (
                <button key={element} className={`filterPill element${element.toLowerCase()} ${selectedElements.includes(element) ? 'active' : ''}`} onClick={() => onElementToggle(element)}>{element}</button>
            ))}
        </div>

        <div className="filterGroup">
            <span className="filterLabel">Rarity:</span>
            {RARITIES.map((rarity) => (
                <button key={rarity} className={`filterPill rarity${rarity} ${selectedRarities.includes(rarity) ? 'active' : ''}`} onClick={() => onRarityToggle(rarity)}>{rarity}★</button>
            ))}
        </div>

        <div className="filterGroup">
            <span className="filterLabel">Weapon:</span>
            {WEAPON_TYPES.map((weaponType) => (
                <button key={weaponType} className={`filterPill weapon ${selectedWeaponTypes.includes(weaponType) ? 'active' : ''}`} onClick={() => onWeaponTypeToggle(weaponType)}>{weaponType}</button>
            ))}
        </div>

        <button className="createCharacterButton" onClick={onCreateClick}>+</button>
        </div>
        </>

    )
}