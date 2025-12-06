import { apiClient } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/api-config";

export const authService = {
    
    async login(payload: any) {
        return apiClient<any>(ENDPOINTS.AUTH.LOGIN, {
            method: "POST",
            body: payload,
        });
    },

    async register(payload: any) {
        return apiClient<any>(ENDPOINTS.AUTH.REGISTER, {
            method: "POST",
            body: payload,
        });
    },

    logout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.location.href = "/";
    },

    getUser() {
        if (typeof window === 'undefined') return null;
        return {
            name: localStorage.getItem("userName"),
            role: localStorage.getItem("userRole"),
            email: localStorage.getItem("userEmail")
        };
    }
};
