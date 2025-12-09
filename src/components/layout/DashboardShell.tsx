"use client";

import { useSidebar } from "@/components/providers/SidebarProvider";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Sidebar />
            <div
                className={cn(
                    "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    isCollapsed ? "pl-20" : "pl-64"
                )}
            >
                <Header />
                <main className="flex-1 p-6 lg:p-10">
                    {children}
                </main>
                <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
                    &copy; {new Date().getFullYear()} Arffy Technologies. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
