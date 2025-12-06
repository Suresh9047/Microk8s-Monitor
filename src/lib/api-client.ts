import { API_BASE_URL } from "./api-config";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
    method?: RequestMethod;
    body?: any;
    headers?: Record<string, string>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    // Retrieve token from storage
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.detail || "API Request failed");
        }

        return data;
    } catch (error: any) {
        console.error("API Error:", error);
        throw error;
    }
}
