import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { artifactsApi } from '../lib/api/artifactsAPI';
import { gameDataApi } from '../lib/api/gameDataAPI';
import { useMemo, useState } from 'react';
import type { Artifact, ArtifactType, ArtifactWithSetData } from '../lib/api/artifactsInterfaces';
import type { BaseArtifactSet } from '../lib/api/gameDataAPIInterfaces';
import toast from 'react-hot-toast';
import { ArtifactsFilterBar } from '../components/ArtifactsFilterBar';
import { ArtifactsTable } from '../components/ArtifactsTable';
import { AddArtifactModal } from '../components/AddArtifactModal';

export const Route = createFileRoute('/artifacts')({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const {
        data: artifacts,
        isLoading: artifactsLoading,
        isError: artifactsError
    } = useQuery({
        queryKey: ['artifacts'],
        queryFn: artifactsApi.getAll
    });

    const {
        data: artifactSets,
        isLoading: setsLoading
    } = useQuery({
        queryKey: ['artifactSets'],
        queryFn: gameDataApi.getAllArtifactSets
    });

    const [selectedTypes, setSelectedTypes] = useState<ArtifactType[]>([]);
    const [selectedRarities, setSelectedRarities] = useState<number[]>([]);
    // TODO add set filtering
    const [selectedSets, _] = useState<string[]>([]);

    const combinedArtifacts = useMemo(() => {
        if(!artifacts || !artifactSets) return [];

        const setMap = new Map<string, BaseArtifactSet>(
            artifactSets.map((set: BaseArtifactSet) => [set.key, set])
        );

        return artifacts.map((artifact: Artifact) => {
            const set = setMap.get(artifact.setKey);
            const artifactWithSet = artifact as ArtifactWithSetData;
            artifactWithSet.setName = set?.name ?? "Unknown Set";

            switch(artifact.artifactType) {
                case 'Flower':
                    artifactWithSet.icon = set?.flowerIcon ?? "";
                    break;
                case 'Feather':
                    artifactWithSet.icon = set?.featherIcon ?? "";
                    break;
                case 'Sands':
                    artifactWithSet.icon = set?.sandsIcon ?? "";
                    break;
                case 'Goblet':
                    artifactWithSet.icon = set?.gobletIcon ?? "";
                    break;
                case 'Circlet':
                    artifactWithSet.icon = set?.circletIcon ?? "";
                    break;
                default:
                    artifactWithSet.icon = "";
            }

            return artifactWithSet;
        });
    }, [artifactSets, artifacts]);

    const filteredArtifacts = useMemo(() => {
        return combinedArtifacts.filter((artifact) => {
                if(selectedTypes.length > 0 && !selectedTypes.includes(artifact.artifactType as ArtifactType)) return false;
                if(selectedRarities.length > 0 && !selectedRarities.includes(artifact.rarity)) return false;
                if(selectedSets.length > 0 && !selectedSets.includes(artifact.setKey)) return false;
                return true;
        });
    }, [combinedArtifacts, selectedTypes, selectedRarities, selectedSets]);

    const deleteArtifactMutation = useMutation({
        mutationFn: artifactsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['artifacts']});
            toast.success('Artifact deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete artifact.');
        }
    });

    const handleTypeToggle = (type: ArtifactType) => {
        setSelectedTypes((previous) =>
            previous.includes(type)
            ? previous.filter((e) => e !== type)
            : [...previous, type]);
    };

    const handleRarityToggle = (rarity: number) => {
        setSelectedRarities((previous) =>
            previous.includes(rarity)
            ? previous.filter((e) => e !== rarity)
            : [...previous, rarity]);
    };

    // const handleSetToggle = (set: string) => {
    //     setSelectedSets((previous) =>
    //         previous.includes(set)
    //         ? previous.filter((e) => e !== set)
    //         : [...previous, set]);
    // };

    const handleCreateClick = () => {
        setModalIsOpen(true);
    }

    const handleRowClick = (artifact: ArtifactWithSetData) => {
        console.log("Clicked artifact", artifact);
    }

    const handleDelete = (artifactId: number) => {
        if(window.confirm("Are you sure you want to delete this artifact?" + artifactId)) {
            deleteArtifactMutation.mutate(artifactId);
        }
    };

    if(artifactsLoading || setsLoading) {
        return (
            <div className="charactersPage">
                <h1 className="charactersPageHeader">Artifacts</h1>
                <div className="charactersTableContainer">
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                </div>
            </div>
        );
    }

    if(artifactsError) {
            return (
                <div className="charactersPage">
                    <h1 className="charactersPageHeader">Artifacts</h1>
                    <div className="emptyState">
                        <div className="emptyStateIcon">X</div>
                        <h2 className="emptyStateTitle">Error loading artifacts.</h2>
                        <p className="emptyStateMessage">Please try refreshing.</p>
                    </div>
                </div>
            )
        }

        if(combinedArtifacts.length === 0) {
            return (
                <div className="charactersPage">
                    <h1 className="charactersPageHeader">Artifacts</h1>
                    <div className="emptyState">
                        <div className="emptyStateIcon">X</div>
                        <h2 className="emptyStateTitle">No artifacts yet.</h2>
                        <p className="emptyStateMessage">Add an artifact to get started!</p>
                        <button className="createCharacterButton" onClick={handleCreateClick}>+ Add Artifact</button>
                    </div>
                    <AddArtifactModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} artifactSets={artifactSets ?? []} />
                </div>
            )
        }

        return (
            <div className="charactersPage">
                <h1 className="charactersPageHeader">Artifacts</h1>
                <ArtifactsFilterBar
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                selectedRarities={selectedRarities}
                onRarityToggle={handleRarityToggle}
                onCreateClick={handleCreateClick} />
                <ArtifactsTable artifacts={filteredArtifacts} onRowClick={handleRowClick} onDelete={handleDelete}/>
                <AddArtifactModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} artifactSets={artifactSets ?? []} />
            </div>
        )
}
