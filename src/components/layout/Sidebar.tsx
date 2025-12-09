"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Activity, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { useSidebar } from "@/components/providers/SidebarProvider";

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
        <aside
            className={cn(
                "h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 transition-all duration-300 ease-in-out z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800/50 flex items-center justify-between overflow-hidden">
                <div className={cn("flex items-center gap-3 transition-opacity duration-200", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                    {!isCollapsed && (
                        <>
                            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shrink-0">
                                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="whitespace-nowrap">
                                <h1 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Arffy Tech</h1>
                                <p className="text-xs text-slate-500">Monitor System</p>
                            </div>
                        </>
                    )}
                </div>
                {/* Collapsed Logo View (Optional, or just hide everything)
                    If collapsed, maybe show just the logo centered?
                 */}
                {isCollapsed && (
                    <div className="absolute left-0 right-0 flex justify-center w-full">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Toggle Button - positioned absolutely overlapping the border or inside */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm z-50"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
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
                            title={isCollapsed ? item.title : undefined}
                        >
                            <div
                                className={cn(
                                    "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "text-indigo-600 dark:text-white"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50",
                                    isCollapsed ? "justify-center" : ""
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

                                <Icon size={20} className={cn("relative z-10 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "group-hover:text-indigo-500 dark:group-hover:text-indigo-300")} />

                                <span className={cn(
                                    "relative z-10 text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden",
                                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                )}>
                                    {item.title}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800/50">
                <UserProfile isCollapsed={isCollapsed} />
            </div>
        </aside>
    );
}

function UserProfile({ isCollapsed }: { isCollapsed: boolean }) {
    const [user, setUser] = useState({ name: "Guest", email: "guest@arffy.tech", initials: "GU" });

    useEffect(() => {
        // Client-side only to access localStorage
        const name = localStorage.getItem("userName") || "Suresh";
        const email = localStorage.getItem("userEmail") || "suresh@gmail.com";
        const initials = name.slice(0, 2).toUpperCase();
        setUser({ name, email, initials });
    }, []);

    return (
        <div className={cn(
            "bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-300",
            isCollapsed ? "p-2 flex flex-col items-center" : "p-4"
        )}>
            <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "mb-2")}>
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {user.initials}
                </div>
                <div className={cn("overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block")}>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
            </div>

            <button
                onClick={() => authService.logout()}
                className={cn(
                    "flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-colors",
                    isCollapsed ? "mt-2 p-2 justify-center w-full" : "w-full px-2 py-1.5 mt-2"
                )}
                title={isCollapsed ? "Sign Out" : undefined}
            >
                <LogOut size={16} />
                <span className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>Sign Out</span>
            </button>
        </div>
    );
}

