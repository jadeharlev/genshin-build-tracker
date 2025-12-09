import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { teamsAPI } from '../lib/api/teamsAPI';
import { charactersApi } from '../lib/api/charactersAPI';
import toast from 'react-hot-toast';
import type { CreateTeamRequest, TeamWithCharacters, UpdateTeamRequest } from '../lib/api/teamsInterfaces';
import { TeamCard } from '../components/Cards/TeamCard';
import { AddTeamModal } from '../components/AddModals/AddTeamModal';
import { EditTeamModal } from '../components/UpdateModals/EditTeamModal';
import { useState } from 'react';

export const Route = createFileRoute('/teams')({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient();

    const {
        data: teams,
        isLoading: teamsLoading,
        isError: teamsError
    } = useQuery({
        queryKey: ['teams'],
        queryFn: teamsAPI.getAll
    });

    const {
        data: characters,
        isLoading: charactersLoading
    } = useQuery({
        queryKey: ['characters'],
        queryFn: charactersApi.getAll
    });

    const [addModalIsOpen, setAddModalOpen] = useState(false);
    const [editModalIsOpen, setEditModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<TeamWithCharacters | null>(null);

    const createTeamMutation = useMutation({
        mutationFn: teamsAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            setAddModalOpen(false);
            toast.success("Team created successfully!");
        },
        onError: (error) => {
            console.error("Failed to create team:", error);
            toast.error("Failed to create team.");
        }
    });

    const updateTeamMutation = useMutation({
        mutationFn: ({ teamID, teamData }: { teamID: number, teamData: UpdateTeamRequest }) => teamsAPI.update(teamID, teamData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            setEditModalOpen(false);
            setSelectedTeam(null);
            toast.success("Team updated successfully!");
        }, onError: (error) => {
            console.error("Failed to update team:", error);
            toast.error("Failed to update team.");
        }
    });

    const deleteTeamMutation = useMutation({
        mutationFn: teamsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            toast.success("Team deleted successfully!");
        },
        onError: (error) => {
            console.error("Failed to delete team:", error);
            toast.error("Failed to delete team.");
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
        setSelectedTeam(null);
    }

    const handleCreateTeam = (teamData: CreateTeamRequest) => {
        createTeamMutation.mutate(teamData);
    }

    const handleEditTeam = (teamData: TeamWithCharacters) => {
        setSelectedTeam(teamData);
        setEditModalOpen(true);
    }

    const handleUpdateTeam = (teamID: number, teamData: UpdateTeamRequest) => {
        updateTeamMutation.mutate({ teamID, teamData });
    }

    const handleDeleteTeam = (teamID: number) => {
        if (window.confirm("Are you sure you want to delete this team?")) {
            deleteTeamMutation.mutate(teamID);
        }
    }

    if (teamsLoading || charactersLoading) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Teams</h1>
                <div className="dataTableContainer">
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                </div>
            </div>
        );
    }

    if (teamsError) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Teams</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">Error loading teams.</h2>
                    <p className="emptyStateMessage">Please try refreshing.</p>
                </div>
            </div>
        )
    }

    if (!teams || teams.length === 0) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Teams</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">No teams yet.</h2>
                    <p className="emptyStateMessage">Add a team to get started!</p>
                    <button className="createCharacterButton" onClick={handleCreateClick}>+ Create Team</button>
                </div>
                <AddTeamModal
                    isOpen={addModalIsOpen}
                    onClose={handleAddModalClose}
                    onSubmit={handleCreateTeam}
                    characters={characters ?? []}
                    isSubmitting={createTeamMutation.isPending}
                />
            </div>
        )
    }

    return (
        <div className="dataPage">
            <h1 className="dataPageHeader">Teams</h1>
            <div className="teamsToolbar">
                <button className="createCharacterButton" onClick={handleCreateClick}>+ Create Team</button>
            </div>

            <div className="teamsGrid">
                {teams.map((team) => (
                    <TeamCard key={team.teamID} team={team} onEdit={handleEditTeam} onDelete={handleDeleteTeam} />
                ))}
            </div>

            <AddTeamModal
                isOpen={addModalIsOpen}
                onClose={handleAddModalClose}
                onSubmit={handleCreateTeam}
                characters={characters ?? []}
                isSubmitting={createTeamMutation.isPending}
            />

            <EditTeamModal
                isOpen={editModalIsOpen}
                onClose={handleEditModalClose}
                onSubmit={handleUpdateTeam}
                team={selectedTeam}
                characters={characters ?? []}
                isSubmitting={updateTeamMutation.isPending}
            />
        </div>

    )
}
