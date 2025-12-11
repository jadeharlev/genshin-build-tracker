import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { AddBuildModal } from '../components/AddModals/AddBuildModal';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { buildsAPI } from '../lib/api/buildsApi';
import type { BuildWithDetails, UpdateBuildRequest, CreateBuildRequest } from '../lib/api/buildsInterfaces';
import { charactersApi } from '../lib/api/charactersAPI';
import { gameDataApi } from '../lib/api/gameDataAPI';
import { artifactsApi } from '../lib/api/artifactsAPI';
import { weaponsApi } from '../lib/api/weaponsAPI';
import { BuildCard } from '../components/Cards/BuildCard';
import { EditBuildModal } from '../components/UpdateModals/EditBuildModal';

export const Route = createFileRoute('/builds')({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient();

    const {data: builds, isLoading: buildsLoading, isError: buildsError} = useQuery({
        queryKey: ['builds'],
        queryFn: buildsAPI.getAll
    });

    const {data: characters, isLoading: charactersLoading} = useQuery({
        queryKey: ['characters'],
        queryFn: charactersApi.getAll
    });

    const {data: baseCharacters, isLoading: baseCharactersLoading} = useQuery({
        queryKey: ['baseCharacters'],
        queryFn: gameDataApi.getAllCharacters
    });

    const { data: weapons, isLoading: weaponsLoading } = useQuery({
        queryKey: ['weapons'],
        queryFn: weaponsApi.getAll
    });

    const { data: baseWeapons, isLoading: baseWeaponsLoading } = useQuery({
        queryKey: ['baseWeapons'],
        queryFn: gameDataApi.getAllWeapons
    });

    const {data: baseArtifactSets, isLoading: baseArtifactSetsLoading} = useQuery({
        queryKey: ['artifactSets'],
        queryFn: gameDataApi.getAllArtifactSets
    });

    const { data: artifacts, isLoading: artifactsLoading } = useQuery({
        queryKey: ['artifacts'],
        queryFn: artifactsApi.getAll
    });

    const [addModalIsOpen, setAddModalOpen] = useState(false);
    const [editModalIsOpen, setEditModalOpen] = useState(false);
    const [selectedBuild, setSelectedBuild] = useState<BuildWithDetails | null>(null);
    const [characterFilter, setCharacterFilter] = useState<number | null>(null);

    const filteredBuilds = useMemo(() => {
        if(!builds) return [];
        if(!characterFilter) return builds;
        return builds.filter(build => build.characterID === characterFilter);
    }, [builds, characterFilter]);

    const charactersWithBuilds = useMemo(() => {
        if(!builds || !characters) return [];
        const characterIDs = Array.from(new Set(builds.map(build => build.characterID)));
        return characters.filter(character => characterIDs.includes(character.characterID)).sort((a, b) => a.name.localeCompare(b.name));
    }, [builds, characters]);

    const createBuildMutation = useMutation({
        mutationFn: buildsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['builds'] });
            setAddModalOpen(false);
            toast.success("Build created successfully!");
        },
        onError: (error) => {
            console.error("Failed to create build:", error);
            toast.error("Failed to create build.");
        }
    });

    const updateBuildMutation = useMutation({
        mutationFn: ({ buildID, buildData }: { buildID: number, buildData: UpdateBuildRequest }) => buildsAPI.update(buildID, buildData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['builds'] });
            setEditModalOpen(false);
            setSelectedBuild(null);
            toast.success("Build updated successfully!");
        }, onError: (error) => {
            console.error("Failed to update build:", error);
            toast.error("Failed to update build.");
        }
    });

    const deleteBuildMutation = useMutation({
        mutationFn: buildsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['builds'] });
            toast.success("Build deleted successfully!");
        },
        onError: (error) => {
            console.error("Failed to delete build:", error);
            toast.error("Failed to delete build.");
        }
    });

    const handleCreateClick = () => {
        setAddModalOpen(true);
    }

    const handleAddModalClose = () => {
        setAddModalOpen(false);
    }

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setSelectedBuild(null);
    }

    const handleCreateBuild = (buildData: CreateBuildRequest) => {
        createBuildMutation.mutate(buildData);
    }

    const handleEditBuild = (buildData: BuildWithDetails) => {
        setSelectedBuild(buildData);
        setEditModalOpen(true);
    }

    const handleUpdateBuild = (buildID: number, buildData: UpdateBuildRequest) => {
        updateBuildMutation.mutate({ buildID, buildData });
    }

    const handleDeleteBuild = (buildID: number) => {
        if(window.confirm("Are you sure you want to delete this build?")) {
            deleteBuildMutation.mutate(buildID);
        }
    }

    const handleCharacterFilterChange = (value: string) => {
        if(value === '') {
            setCharacterFilter(null);
        } else {
            setCharacterFilter(parseInt(value));
        }
    }

    const isLoading = buildsLoading || charactersLoading || baseCharactersLoading || weaponsLoading || artifactsLoading || baseWeaponsLoading || baseArtifactSetsLoading;

    if (isLoading) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Builds</h1>
                <div className="buildsGrid">
                    <div className="loadingSkeleton SkeletonCard"></div>
                    <div className="loadingSkeleton SkeletonCard"></div>
                    <div className="loadingSkeleton SkeletonCard"></div>
                </div>
            </div>
        );
    }

    if (buildsError) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Builds</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">Error loading builds.</h2>
                    <p className="emptyStateMessage">Please try refreshing.</p>
                </div>
            </div>
        );
    }

    if(!builds || builds.length === 0) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Builds</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">No builds found.</h2>
                    <p className="emptyStateMessage">Create a build to get started!</p>
                    <button className="createCharacterButton" onClick={handleCreateClick}>+ Create Build</button>
                </div>
                <AddBuildModal
                    isOpen={addModalIsOpen}
                    onClose={handleAddModalClose}
                    onSubmit={handleCreateBuild}
                    characters={characters ?? []}
                    baseCharacters={baseCharacters ?? []}
                    weapons={weapons ?? []}
                    baseWeapons={baseWeapons ?? []}
                    artifacts={artifacts ?? []}
                    baseArtifactSets={baseArtifactSets ?? []}
                    isSubmitting={createBuildMutation.isPending}
                />
            </div>
        );
    }

    return (
        <div className="dataPage">
            <h1 className="dataPageHeader">Builds</h1>
            <div className="buildsToolbar">
                <div className="buildsFilter">
                    <label htmlFor="characterFilter">Filter by Character:</label>
                    <select id="characterFilter" value={characterFilter ?? ''} onChange={(e) => handleCharacterFilterChange(e.target.value)}>
                        <option value=''>All Characters</option>
                        {charactersWithBuilds.map(character => (
                            <option key={character.characterID} value={character.characterID}>{character.name}</option>
                        ))}
                    </select>
                </div>
                <button className="createCharacterButton" onClick={handleCreateClick}>+ Create Build</button>
            </div>

            <div className="buildsGrid">
                {filteredBuilds.map(build => (
                    <BuildCard key={build.buildID} build={build} onEdit={handleEditBuild} onDelete={handleDeleteBuild} baseWeapons={baseWeapons ?? []} baseArtifactSets={baseArtifactSets ?? []} />
                ))}
            </div>

            {filteredBuilds.length === 0 && characterFilter && (
                <div className="emptyState">
                    <p className="emptyStateMessage">No builds found for this character.</p>
                </div>
            )}

            <AddBuildModal
                isOpen={addModalIsOpen}
                onClose={handleAddModalClose}
                onSubmit={handleCreateBuild}
                characters={characters ?? []}
                baseCharacters={baseCharacters ?? []}
                weapons={weapons ?? []}
                baseWeapons={baseWeapons ?? []}
                artifacts={artifacts ?? []}
                baseArtifactSets={baseArtifactSets ?? []}
                isSubmitting={createBuildMutation.isPending}
            />

            <EditBuildModal
                isOpen={editModalIsOpen}
                onClose={handleEditModalClose}
                onSubmit={handleUpdateBuild}
                build={selectedBuild}
                characters={characters ?? []}
                baseCharacters={baseCharacters ?? []}
                weapons={weapons ?? []}
                baseWeapons={baseWeapons ?? []}
                artifacts={artifacts ?? []}
                baseArtifactSets={baseArtifactSets ?? []}
                isSubmitting={updateBuildMutation.isPending}
            />
        </div>
    )
}
