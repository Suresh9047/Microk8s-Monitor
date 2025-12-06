"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Activity, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="h-screen w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 transition-colors duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Arffy Technologies</h1>
                        <p className="text-xs text-slate-500">Cluster Monitor System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "block",
                                item.disabled && "cursor-not-allowed opacity-50 pointer-events-none"
                            )}
                        >
                            <div
                                className={cn(
                                    "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "text-indigo-600 dark:text-white"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <Icon size={18} className={cn("relative z-10", isActive ? "text-indigo-600 dark:text-indigo-400" : "group-hover:text-indigo-500 dark:group-hover:text-indigo-300")} />
                                <span className="relative z-10 text-sm font-medium">{item.title}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800/50">
                <UserProfile />
            </div>
        </div>
    );
}

function UserProfile() {
    const [user, setUser] = useState({ name: "Guest", email: "guest@arffy.tech", initials: "GU" });

    useEffect(() => {
        // Client-side only to access localStorage
        const name = localStorage.getItem("userName") || "Suresh";
        const email = localStorage.getItem("userEmail") || "suresh@gmail.com";
        const initials = name.slice(0, 2).toUpperCase();
        setUser({ name, email, initials });
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {user.initials}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
            </div>

            <button
                onClick={() => authService.logout()}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-colors mt-2"
            >
                <LogOut size={14} />
                Sign Out
            </button>
        </div>
    );
}
