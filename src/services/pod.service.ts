import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/api-config";
import { PodDetails, PodFilters, PodPhase } from "@/types";

export interface Pod {
  id: string;
  name: string;
  namespace: string;
  status: string;
  phase: PodPhase;
  age: string;
  cpu: string;
  memory: string;
  restarts: number;
  nodeName?: string;
}

export const podService = {
  /**
   * Get all pods with optional filtering
   */
  async getAllPods(filters?: PodFilters): Promise<Pod[]> {
    const params = new URLSearchParams();

    if (filters?.namespace) {
      params.append("namespace", filters.namespace);
    }
    if (filters?.phase) {
      params.append("phase", filters.phase);
    }
    if (filters?.nodeName) {
      params.append("nodeName", filters.nodeName);
    }
    if (filters?.labels) {
      Object.entries(filters.labels).forEach(([key, value]) => {
        params.append(`label.${key}`, value);
      });
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${ENDPOINTS.KUBERNETES.PODS}?${queryString}`
      : ENDPOINTS.KUBERNETES.PODS;

    return apiClient<Pod[]>(endpoint);
  },

  /**
   * Get detailed information for a specific pod
   */
  async getPodDetails(namespace: string, name: string): Promise<PodDetails> {
    const endpoint = ENDPOINTS.KUBERNETES.POD_DETAILS.replace(
      ":namespace",
      namespace
    ).replace(":name", name);

    const response = await apiClient<PodDetails>(endpoint);
    console.log(
      "🔍 Raw Pod Details Response:",
      JSON.stringify(response, null, 2)
    );
    return response;
  },

  /**
   * Get logs for a specific pod container
   */
  async getPodLogs(
    namespace: string,
    name: string,
    options?: {
      container?: string;
      tailLines?: number;
      timestamps?: boolean;
      follow?: boolean;
    }
  ): Promise<string> {
    const params = new URLSearchParams();

    if (options?.container) {
      params.append("container", options.container);
    }
    if (options?.tailLines) {
      params.append("tailLines", options.tailLines.toString());
    }
    if (options?.timestamps !== undefined) {
      params.append("timestamps", options.timestamps.toString());
    }
    if (options?.follow !== undefined) {
      params.append("follow", options.follow.toString());
    }

    const endpoint = ENDPOINTS.KUBERNETES.POD_LOGS.replace(
      ":namespace",
      namespace
    ).replace(":name", name);

    const queryString = params.toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    return apiClient<string>(fullEndpoint);
  },

  /**
   * Delete a pod
   */
  async deletePod(namespace: string, name: string): Promise<void> {
    const endpoint = ENDPOINTS.KUBERNETES.POD_DETAILS.replace(
      ":namespace",
      namespace
    ).replace(":name", name);

    return apiClient<void>(endpoint, { method: "DELETE" });
  },
};
