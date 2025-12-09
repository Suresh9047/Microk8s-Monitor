import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardShell>
                {children}
            </DashboardShell>
        </SidebarProvider>
    );
}
