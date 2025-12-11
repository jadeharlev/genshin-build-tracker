import api from "./api";
import type { LevelStats, RarityStat } from "./statsInterfaces";

export const statsAPI = {
    getRarityStats: async (): Promise<RarityStat[]> => {
        const response = await api.get<RarityStat[]>('/stats/raritystats');
        return response.data;
    },

    getLevelStats: async (): Promise<LevelStats> => {
        const response = await api.get<LevelStats>('/stats/levelstats');
        return response.data;
    },
};