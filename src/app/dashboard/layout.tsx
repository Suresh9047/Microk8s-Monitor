import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen">
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
