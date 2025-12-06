"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Bell, Search } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6 transition-colors duration-300">
            {/* Left: Search (Global) */}
            <div className="w-64">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border-none rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                </button>
            </div>
        </header>
    );
}
