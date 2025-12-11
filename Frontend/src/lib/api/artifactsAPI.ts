import api from "./api";
import type { Artifact, CreateArtifactRequest, UpdateArtifactRequest } from "./artifactsInterfaces";
export const artifactsApi = {
    getAll: async(): Promise<Artifact[]> => {
        const response = await api.get<Artifact[]>('/artifacts');
        return response.data;
    },

    getById: async(artifactID: number): Promise<Artifact> => {
        const response = await api.get<Artifact>(`/artifacts/${artifactID}`);
        return response.data;
    },

    create: async(data: CreateArtifactRequest): Promise<Artifact> => {
        const response = await api.post<Artifact>('/artifacts', data);
        return response.data;
    },

    update: async(artifactID: number, data: UpdateArtifactRequest): Promise<void> => {
        await api.put<Artifact>(`/artifacts/${artifactID}`, data);
    },

    delete: async(artifactID: number): Promise<void> => {
        await api.delete<void>(`/artifacts/${artifactID}`);
    },

    exportCSV: async() => {
        const response = await api.get<Blob>('/artifacts/export', {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'artifacts.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}