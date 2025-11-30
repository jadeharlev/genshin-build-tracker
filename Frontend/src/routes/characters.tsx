import { createFileRoute } from '@tanstack/react-router'
import { charactersApi } from '../lib/api/charactersAPI'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { gameDataApi } from '../lib/api/gameDataAPI';
import type { BaseCharacter } from '../lib/api/gameDataAPIInterfaces';
import type { Character, CharacterWithBaseData, CreateCharacterRequest } from '../lib/api/charactersInterfaces';
import { CharactersFilterBar } from '../components/CharactersFiltersBar';
import { CharactersTable } from '../components/CharactersTable';
import toast from 'react-hot-toast';
import { AddCharacterModal } from '../components/AddCharacterModal';

export const Route = createFileRoute('/characters')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        data: characters,
        isLoading: charactersLoading,
        isError: charactersError
    } = useQuery({
        queryKey: ['characters'],
        queryFn: charactersApi.getAll
    });

    const {
        data: baseCharacters,
        isLoading: baseCharactersLoading,
    } = useQuery({
        queryKey: ['baseCharacters'],
        queryFn: gameDataApi.getAllCharacters
    });

    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [selectedRarities, setSelectedRarities] = useState<number[]>([]);
    const [selectedWeaponTypes, setSelectedWeaponTypes] = useState<string[]>([]);
    const [modalIsOpen, setModelOpen] = useState(false);

    const combinedCharacters = useMemo(() => {

        if(!characters || !baseCharacters) return [];

        const baseCharacterMap = new Map<string, BaseCharacter>(
            baseCharacters.map((baseCharacter) => [baseCharacter.key, baseCharacter])
        );

        return characters.map((character: Character) => {
            const baseCharacter = baseCharacterMap.get(character.baseCharacterKey);
            let returnValue = character as CharacterWithBaseData;
            returnValue.element = baseCharacter?.element ?? "Unknown";
            returnValue.weaponType = baseCharacter?.weaponType ?? "Unknown";
            returnValue.region = baseCharacter?.region ?? "Unknown";
            returnValue.icon = baseCharacter?.icon ?? "";
            return returnValue;
        });
    }, [characters, baseCharacters]);

    const filteredCharacters = useMemo(() => {
        return combinedCharacters.filter((character) => {
            if(searchQuery && !character.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if(selectedElements.length > 0 && !selectedElements.includes(character.element)) return false;
            if(selectedRarities.length > 0 && !selectedRarities.includes(parseInt(character.rarity))) return false;
            if(selectedWeaponTypes.length > 0 && !selectedWeaponTypes.includes(character.weaponType)) return false;
            return true;
        })
    }, [combinedCharacters, searchQuery, selectedElements, selectedRarities, selectedWeaponTypes]);

    const createCharacterMutation = useMutation({
        mutationFn: charactersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['characters']});
            setModelOpen(false);
            toast.success('Added character successfully!');
        },
        onError: (error) => {
            console.error("Failed to create character:", error);
            toast.error("Failed to add character.");
        }
    });

    const handleCreateClick = () => {
        setModelOpen(true);
    }

    const handleModalClose = () => {
        setModelOpen(false);
    }

    const handleCreateCharacter = (data: CreateCharacterRequest) => {
        createCharacterMutation.mutate(data);
    };

    const handleElementToggle = (element: string) => {
        setSelectedElements((previous) =>
            previous.includes(element)
            ? previous.filter((e) => e !== element)
            : [...previous, element]
        );
    };

    const handleRarityToggle = (rarity: number) => {
        setSelectedRarities((previous) =>
            previous.includes(rarity)
            ? previous.filter((r) => r !== rarity)
            : [...previous, rarity]
        );
    };

    const handleWeaponTypeToggle = (weaponType: string) => {
        setSelectedWeaponTypes((previous) =>
            previous.includes(weaponType)
            ? previous.filter((w) => w !== weaponType)
            : [...previous, weaponType]
        );
    };

    const handleRowClick = (character: CharacterWithBaseData) => {
        // TODO navigate
        console.log('Character clicked:', character);
    };

    if(charactersLoading || baseCharactersLoading) {
        return(
            <div className="charactersPage">
                <h1 className="charactersPageHeader">Characters</h1>
                <div className="charactersTableContainer">
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                </div>
            </div>
        );
    }

    if(charactersError) {
        return (
            <div className="charactersPage">
                <h1 className="charactersPageHeader">Characters</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">Error loading characters.</h2>
                    <p className="emptyStateMessage">Please try refreshing.</p>
                </div>
            </div>
        )
    }

    if(combinedCharacters.length === 0) {
        return (
            <div className="charactersPage">
                <h1 className="charactersPageHeader">Characters</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">No characters yet.</h2>
                    <p className="emptyStateMessage">Create a character to get started!</p>
                    <button className="createCharacterButton" onClick={handleCreateClick}>+ Create a Character</button>
                </div>
            </div>
        )
    }

    return (
        <div className="charactersPage">
            <h1 className="charactersPageHeader">Characters</h1>
            <CharactersFilterBar searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedElements={selectedElements}
            onElementToggle={handleElementToggle}
            selectedRarities={selectedRarities}
            onRarityToggle={handleRarityToggle}
            selectedWeaponTypes={selectedWeaponTypes}
            onWeaponTypeToggle={handleWeaponTypeToggle}
            onCreateClick={handleCreateClick} />
            <CharactersTable characters={filteredCharacters} onRowClick={handleRowClick} />
            <AddCharacterModal isOpen={modalIsOpen} onClose={handleModalClose} onSubmit={handleCreateCharacter} baseCharacters={baseCharacters ?? []} isSubmitting={createCharacterMutation.isPending}></AddCharacterModal>
        </div>
    )
}
