import api from "./api";
import type { Character, CreateCharacterRequest, UpdateCharacterRequest } from "./charactersInterfaces";

export const charactersApi = {
    getAll: async(): Promise<Character[]> => {
        const response = await api.get<Character[]>('/characters');
        return response.data;
    },

    getById: async(characterID: number): Promise<Character> => {
        const response = await api.get<Character>(`/characters/${characterID}`);
        return response.data;
    },

    create: async(data: CreateCharacterRequest): Promise<Character> => {
        const response = await api.post<Character>('/characters', data);
        return response.data;
    },

    update: async(characterID: number, data: UpdateCharacterRequest): Promise<void> => {
        await api.put<Character>(`/characters/${characterID}`, data);
    },

    delete: async(characterID: number): Promise<void> => {
        await api.delete<void>(`/characters/${characterID}`);
    }
}