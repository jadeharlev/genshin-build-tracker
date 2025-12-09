import api from "./api";
import type { TeamWithCharacters, CreateTeamRequest, UpdateTeamRequest } from "./teamsInterfaces";

export const teamsAPI = {
    getAll: async (): Promise<TeamWithCharacters[]> => {
        const response = await api.get<TeamWithCharacters[]>('/teams');
        return response.data;
    },

    getByID: async (teamID: number): Promise<TeamWithCharacters> => {
        const response = await api.get<TeamWithCharacters>(`/teams/${teamID}`);
        return response.data;
    },

    create: async (teamData: CreateTeamRequest): Promise<TeamWithCharacters> => {
        const response = await api.post('/teams', teamData);
        return response.data;
    },

    update: async (teamID: number, teamData: UpdateTeamRequest) => {
        const response = await api.put(`/teams/${teamID}`, teamData);
        return response.data;
    },

    delete: async (teamID: number): Promise<void> => {
        await api.delete(`/teams/${teamID}`);
    }
};