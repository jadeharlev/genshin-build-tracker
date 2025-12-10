import type { ArtifactType } from "../../lib/api/artifactsInterfaces";
import type { BuildWithDetails } from "../../lib/api/buildsInterfaces";
import type { BaseArtifactSet, BaseWeapon } from "../../lib/api/gameDataAPIInterfaces";

interface BuildCardProps {
    build: BuildWithDetails;
    onEdit: (build: BuildWithDetails) => void;
    onDelete: (buildID: number) => void;
    baseWeapons: BaseWeapon[];
    baseArtifactSets: BaseArtifactSet[];
}

interface ArtifactSlotProps {
    setKey: string | null;
    mainStat: string | null;
    level: number | null;
    rarity: number | null;
    slotType: ArtifactType;
    setName: string | null;
}

function ArtifactSlot({ setKey, mainStat, level, rarity, slotType, setName }: ArtifactSlotProps) {
    const slotLabels: Record<string, string> = {
        Flower: "Flower",
        Feather: "Feather",
        Sands: "Sands",
        Goblet: "Goblet",
        Circlet: "Circlet"
    };

    if(!setKey) {
        return (
            <div className="buildArtifactSlot buildArtifactSlotEmpty" title={`${slotLabels[slotType]}: Empty`}>
                <div className="buildArtifactPlaceholder">{slotLabels[slotType]}</div>
            </div>
        );
    }

    const slotTypeToSuffix: Record<string, string> = {
        Flower: "flower-of-life",
        Feather: "plume-of-death",
        Sands: "sands-of-eon",
        Goblet: "goblet-of-eonothem",
        Circlet: "circlet-of-logos"
    };

    const iconName = `${setKey}_${slotTypeToSuffix[slotType]}.png`;

    const tooltipText = `${setName ?? setKey}\n+${level} | ${mainStat}\n${'★'.repeat(rarity ?? 5)}`;

    return (
        <div className="buildArtifactSlot buildArtifactSlotFilled" title={tooltipText}>
            <img src={`/images/artifacts/${iconName}`} alt={`${setName ?? setKey} ${slotType}`} className="buildArtifactIcon"/>
            <div className="buildArtifactInfo">
                <span className="buildArtifactLevel">+{level}</span>
            </div>
        </div>
    );
}

export function BuildCard({ build, onEdit, onDelete, baseWeapons, baseArtifactSets }: BuildCardProps) {
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(build);
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(build.buildID);
    }

    const handleCardClick = () => {
        onEdit(build);
    }

    const weaponName = build.weaponKey ?
        baseWeapons.find(weapon => weapon.key === build.weaponKey)?.name ?? build.weaponKey 
        : null;

    const getSetName = (setKey: string | null): string | null => {
        if(!setKey) return null;
        return baseArtifactSets.find(set => set.key === setKey)?.name || setKey;
    }

    return (
        <div className="buildCard" onClick={handleCardClick}>
            <div className="buildCardHeader">
                <h3 className="buildCardName">{build.buildName}</h3>
                <div className="buildCardActions">
                    <button className="buildCardActionButton" onClick={handleEditClick} title="Edit build">✎</button>
                    <button className="buildCardActionButton" onClick={handleDeleteClick} title="Delete build">x</button>
                </div>
            </div>
            <div className="buildCardBody">
                <div className="buildMainRow">
                    <div className="buildCharacter">
                        <img src={`/images/characters/${build.characterKey}.png`} alt={build.characterName} className="buildCharacterIcon" />
                        <div className="buildCharacterInfo">
                            <span className="buildCharacterName">{build.characterName}</span>
                            <span className="buildCharacterLevel">Level: {build.characterLevel}</span>
                        </div>
                    </div>

                    <div className="buildWeapon">
                        {build.weaponKey ? (
                            <>
                                <img src={`/images/weapons/${build.weaponKey}.png`} alt={build.weaponKey} className="buildWeaponIcon" />

                                <div className="buildWeaponInfo">
                                    <span className="buildWeaponName">{weaponName}</span>
                                    <span className="buildWeaponStats">Lv.{build.weaponLevel}, R{build.weaponRefinement}</span>
                                </div>
                            </>
                        ) : (
                            <div className="buildWeaponEmpty">
                                <div className="buildWeaponPlaceholder">No Weapon</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="buildArtifactsRow">
                    <ArtifactSlot
                        slotType="Flower"
                        setKey={build.flowerSetKey}
                        mainStat={build.flowerMainStat}
                        level={build.flowerLevel}
                        rarity={build.flowerRarity}
                        setName={getSetName(build.flowerSetKey)}
                    />
                    <ArtifactSlot
                        slotType="Feather"
                        setKey={build.featherSetKey}
                        mainStat={build.featherMainStat}
                        level={build.featherLevel}
                        rarity={build.featherRarity}
                        setName={getSetName(build.featherSetKey)}
                    />
                    <ArtifactSlot
                        slotType="Sands"
                        setKey={build.sandsSetKey}
                        mainStat={build.sandsMainStat}
                        level={build.sandsLevel}
                        rarity={build.sandsRarity}
                        setName={getSetName(build.sandsSetKey)}
                    />
                    <ArtifactSlot
                        slotType="Goblet"
                        setKey={build.gobletSetKey}
                        mainStat={build.gobletMainStat}
                        level={build.gobletLevel}
                        rarity={build.gobletRarity}
                        setName={getSetName(build.gobletSetKey)}
                    />
                    <ArtifactSlot
                        slotType="Circlet"
                        setKey={build.circletSetKey}
                        mainStat={build.circletMainStat}
                        level={build.circletLevel}
                        rarity={build.circletRarity}
                        setName={getSetName(build.circletSetKey)}
                    />
                </div>
            </div>
        </div>
    );
}