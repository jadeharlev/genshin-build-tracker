import api from "./api";
import type { BaseCharacter } from "./gameDataAPIInterfaces";

export const gameDataApi = {
    getAllCharacters: async (): Promise<BaseCharacter[]> => {
        const response = await api.get('/gamedata/characters');
        return response.data;
    },

    getCharacter: async(key: string): Promise<BaseCharacter> => {
        const response = await api.get(`/gamedata/characters/${key}`);
        return response.data;
    },

    getAllWeapons: async () => {
        const response = await api.get('/gamedata/weapons');
        return response.data;
    },

    getWeapon: async (key: string) => {
        const response = await api.get(`/gamedata/weapons/${key}`);
        return response.data;
    },

    getAllArtifactSets: async () => {
        const response = await api.get('/gamedata/artifacts');
        return response.data;
    },

    getArtifactSet: async (key: string) => {
        const response = await api.get(`/gamedata/artifacts/${key}`);
        return response.data;
    },

    getValidationRules: async () => {
        const response = await api.get('/gamedata/validation-rules');
        return response.data;
    },
}