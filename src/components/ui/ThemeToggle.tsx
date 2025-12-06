"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    // Ensure we are mounted to avoid hydration mismatch
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="grid place-content-center w-9 h-9 opacity-0">
                <span className="sr-only">Toggle theme</span>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 text-slate-400 hover:text-white dark:hover:text-white transition-colors"
            title="Toggle Theme"
        >
            {theme === 'dark' ? (
                <Sun size={20} className="hover:text-yellow-400 transition-colors" />
            ) : (
                <Moon size={20} className="hover:text-indigo-400 transition-colors" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
