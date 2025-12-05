import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { artifactsApi } from '../lib/api/artifactsAPI';
import { gameDataApi } from '../lib/api/gameDataAPI';
import { useMemo, useState } from 'react';
import type { Artifact, ArtifactType, ArtifactWithSetData, UpdateArtifactRequest } from '../lib/api/artifactsInterfaces';
import type { BaseArtifactSet } from '../lib/api/gameDataAPIInterfaces';
import toast from 'react-hot-toast';
import { ArtifactsFilterBar } from '../components/ArtifactsFilterBar';
import { ArtifactsTable } from '../components/ArtifactsTable';
import { AddArtifactModal } from '../components/AddModals/AddArtifactModal';
import { EditArtifactModal } from '../components/UpdateModals/EditArtifactModal';

export const Route = createFileRoute('/artifacts')({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient();
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

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
    const [selectedSets, setSelectedSets] = useState<string[]>([]);

    const combinedArtifacts = useMemo(() => {
        if (!artifacts || !artifactSets) return [];

        const setMap = new Map<string, BaseArtifactSet>(
            artifactSets.map((set: BaseArtifactSet) => [set.key, set])
        );

        return artifacts.map((artifact: Artifact) => {
            const set = setMap.get(artifact.setKey);
            const artifactWithSet = artifact as ArtifactWithSetData;
            artifactWithSet.setName = set?.name ?? "Unknown Set";

            switch (artifact.artifactType) {
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
            if (selectedTypes.length > 0 && !selectedTypes.includes(artifact.artifactType as ArtifactType)) return false;
            if (selectedRarities.length > 0 && !selectedRarities.includes(artifact.rarity)) return false;
            if (selectedSets.length > 0 && !selectedSets.includes(artifact.setKey)) return false;
            return true;
        });
    }, [combinedArtifacts, selectedTypes, selectedRarities, selectedSets]);

    const deleteArtifactMutation = useMutation({
        mutationFn: artifactsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artifacts'] });
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


    const handleSetToggle = (selectedOptions: readonly BaseArtifactSet[]) => {
        const setKeys = selectedOptions.map((set) => set.key);
        setSelectedSets(setKeys);
    };

    const updateArtifactMutation = useMutation({
        mutationFn: ({ artifactId, data }: { artifactId: number, data: UpdateArtifactRequest }) => artifactsApi.update(artifactId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artifacts'] });
            toast.success('Artifact updated successfully!');
            handleEditModalClose();
        },
        onError: () => {
            toast.error('Failed to update artifact.');
        }
    });

    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [selectedArtifact, setSelectedArtifact] = useState<ArtifactWithSetData | null>(null);

    const handleEditModalClose = () => {
        setEditModalIsOpen(false);
        setSelectedArtifact(null);
    };

    const handleCreateModalClose = () => {
        setCreateModalIsOpen(false);
    }

    const handleUpdateArtifact = (artifactId: number, data: UpdateArtifactRequest) => {
        updateArtifactMutation.mutate({ artifactId, data });
    };

    const handleCreateClick = () => {
        setCreateModalIsOpen(true);
    }

    const handleRowClick = (artifact: ArtifactWithSetData) => {
        setSelectedArtifact(artifact);
        setEditModalIsOpen(true);
    }

    const handleDelete = (artifactId: number) => {
        if (window.confirm("Are you sure you want to delete this artifact?")) {
            deleteArtifactMutation.mutate(artifactId);
        }
    };

    if (artifactsLoading || setsLoading) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Artifacts</h1>
                <div className="dataTableContainer">
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                </div>
            </div>
        );
    }

    if (artifactsError) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Artifacts</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">Error loading artifacts.</h2>
                    <p className="emptyStateMessage">Please try refreshing.</p>
                </div>
            </div>
        )
    }

    if (combinedArtifacts.length === 0) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Artifacts</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">No artifacts yet.</h2>
                    <p className="emptyStateMessage">Add an artifact to get started!</p>
                    <button className="createCharacterButton" onClick={handleCreateClick}>+ Add Artifact</button>
                </div>
                <AddArtifactModal isOpen={createModalIsOpen} onClose={() => setCreateModalIsOpen(false)} artifactSets={artifactSets ?? []} />
            </div>
        )
    }

    return (
        <div className="dataPage">
            <h1 className="dataPageHeader">Artifacts</h1>
            <ArtifactsFilterBar
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                selectedRarities={selectedRarities}
                onRarityToggle={handleRarityToggle}
                onCreateClick={handleCreateClick}
                artifactSets={artifactSets}
                onSetChange={handleSetToggle} selectedSets={selectedSets} />
            <ArtifactsTable artifacts={filteredArtifacts} onRowClick={handleRowClick} onDelete={handleDelete} />
            <AddArtifactModal isOpen={createModalIsOpen} onClose={handleCreateModalClose} artifactSets={artifactSets ?? []} />
            <EditArtifactModal isOpen={editModalIsOpen} onClose={handleEditModalClose} onSubmit={handleUpdateArtifact} artifact={selectedArtifact} isSubmitting={updateArtifactMutation.isPending} />
        </div>
    )
}
