"use client";

import { useEffect, useState } from "react";

export type Role = "admin" | "user" | null;

export function useRole() {
    const [role, setRole] = useState<Role>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would come from a secure HTTP-only cookie or JWT payload
        const storedRole = localStorage.getItem("userRole") as Role;
        setRole(storedRole || "user"); // Default to user if unknown for safety
        setIsLoading(false);
    }, []);

    const isAdmin = role === "admin";

    return { role, isAdmin, isLoading };
}
