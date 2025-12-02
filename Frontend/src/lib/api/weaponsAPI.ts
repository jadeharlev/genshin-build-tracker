import api from "./api";
import type { Weapon } from "./weaponsInterfaces";
export const weaponsApi = {
    getAll: async(): Promise<Weapon[]> => {
        const response = await api.get<Weapon[]>('/weapons');
        return response.data;
    },

    getById: async(weaponID: number): Promise<Weapon> => {
        const response = await api.get<Weapon>(`/weapons/${weaponID}`);
        return response.data;
    },

    create: async(data: Weapon): Promise<Weapon> => {
        const response = await api.post<Weapon>('/weapons', data);
        return response.data;
    },

    update: async(weaponID: number, data: Weapon): Promise<void> => {
        await api.put<void>(`/weapons/${weaponID}`, data);
    },

    delete: async(weaponID: number): Promise<void> => {
        await api.delete<void>(`/weapons/${weaponID}`);
    }
};