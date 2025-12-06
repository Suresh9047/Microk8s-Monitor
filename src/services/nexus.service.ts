import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/api-config";

export interface NexusImage {
    image: string;
    tags: string[];
}

export interface NexusResponse {
    success: boolean;
    message: string;
    data: NexusImage[];
}

export interface NexusRepositoryResponse {
    success: boolean;
    message: string;
    data: string[];
}

export const nexusService = {
    async getImages(): Promise<NexusResponse> {
        return apiClient<NexusResponse>(ENDPOINTS.NEXUS.IMAGES);
    },

    async getRepositories(): Promise<NexusRepositoryResponse> {
        return apiClient<NexusRepositoryResponse>(ENDPOINTS.NEXUS.REPOSITORIES);
    },

    async deleteImageTag(name: string, tag: string): Promise<{ success: boolean; message: string }> {
        return apiClient<{ success: boolean; message: string }>(`${ENDPOINTS.NEXUS.IMAGES}/${name}/tags/${tag}`, {
            method: 'DELETE'
        });
    }
};
