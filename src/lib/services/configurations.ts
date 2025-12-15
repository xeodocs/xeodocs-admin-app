import { api } from "@/lib/api";

export interface Configuration {
    key: string;
    value: string;
}

export interface ConfigurationResponse {
    data: Configuration;
}

export interface ConfigurationsListResponse {
    data: Configuration[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export const configurationsService = {
    getAll: async () => {
        const response = await api.get<ConfigurationsListResponse>("/configurations");
        return response.data;
    },
    get: async (key: string) => {
        const response = await api.get<ConfigurationResponse>(`/configurations/${key}`);
        return response.data;
    },
    update: async (key: string, value: string) => {
        const response = await api.patch<ConfigurationResponse>(`/configurations/${key}`, { value });
        return response.data;
    },
    create: async (key: string, value: string) => {
        const response = await api.post<ConfigurationResponse>("/configurations", { key, value });
        return response.data;
    },
    // Generic upsert helper
    upsert: async (key: string, value: string) => {
        try {
            return await configurationsService.update(key, value);
        } catch (error: any) {
            if (error.response?.status === 404) {
                return await configurationsService.create(key, value);
            }
            throw error;
        }
    }
};
