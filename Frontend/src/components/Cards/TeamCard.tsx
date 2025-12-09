import type { TeamWithCharacters } from "../../lib/api/teamsInterfaces";

interface TeamCardProps {
    team: TeamWithCharacters;
    onEdit: (team: TeamWithCharacters) => void;
    onDelete: (teamID: number) => void;
}

interface CharacterSlotProps {
    characterKey: string | null;
    characterName: string | null;
    characterLevel: number | null;
}

function CharacterSlot({ characterKey, characterName, characterLevel }: CharacterSlotProps) {
    if(!characterKey || !characterName) {
        return (
            <div className="teamSlot teamSlotEmpty">
                <div className="teamSlotPlaceholder">+</div>
            </div>
        );
    }

    return (
        <div className="teamSlot teamSlotFilled">
            <img
                src={`/images/characters/${characterKey}.png`}
                alt={characterName}
                className="teamSlotIcon"
            />
            <span className="teamSlotName">{characterName}</span>
            <span className="teamSlotLevel">Lv. {characterLevel}</span>
        </div>
    );
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
    console.log("Team Data:",team);
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(team);
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(team.teamID);
    }

    const handleCardClick = () => {
        onEdit(team);
    }

    return (
        <div className="teamCard" onClick={handleCardClick}>
            <div className="teamCardHeader">
                <h3 className="teamCardName">{team.teamName}</h3>
                <div className="teamCardActions">
                    <button className="teamCardActionButton" onClick={handleEditClick} title="Edit Team">✎</button>
                    <button className="teamCardActionButton" onClick={handleDeleteClick} title="Delete Team">x</button>
                </div>
            </div>
            <div className="teamCardSlots">
                <CharacterSlot
                    characterKey={team.firstCharacterKey}
                    characterName={team.firstCharacterName}
                    characterLevel={team.firstCharacterLevel}
                />
                <CharacterSlot
                    characterKey={team.secondCharacterKey}
                    characterName={team.secondCharacterName}
                    characterLevel={team.secondCharacterLevel}
                />
                <CharacterSlot
                    characterKey={team.thirdCharacterKey}
                    characterName={team.thirdCharacterName}
                    characterLevel={team.thirdCharacterLevel}
                />
                <CharacterSlot
                    characterKey={team.fourthCharacterKey}
                    characterName={team.fourthCharacterName}
                    characterLevel={team.fourthCharacterLevel}
                />
            </div>
        </div>
    );
}