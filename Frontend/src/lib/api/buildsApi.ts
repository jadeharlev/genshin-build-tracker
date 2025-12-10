import api from "./api";
import type { BuildWithDetails, CreateBuildRequest, UpdateBuildRequest } from "./buildsInterfaces";

export const buildsAPI = {
    getAll: async(): Promise<BuildWithDetails[]> => {
        const response = await api.get<BuildWithDetails[]>('/builds');
        return response.data;
    },

    getById: async(buildID: number): Promise<BuildWithDetails> => {
        const response = await api.get<BuildWithDetails>(`/builds/${buildID}`);
        return response.data;
    },

    create: async(data: CreateBuildRequest): Promise<BuildWithDetails> => {
        const response = await api.post<BuildWithDetails>('/builds', data);
        return response.data;
    },

    update: async(buildID: number, data: UpdateBuildRequest): Promise<void> => {
        await api.put(`/builds/${buildID}`, data);
    },

    delete: async(buildID: number): Promise<void> => {
        await api.delete(`/builds/${buildID}`);
    }
}