import { API_BASE_URL } from "./api-config";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  // Retrieve token from storage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

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

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // If it's an error but text, try to use the text as message
      const errorMessage =
        typeof data === "object" ? data.message || data.detail : data;
      throw new Error(errorMessage || "API Request failed");
    }

    return data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
}
