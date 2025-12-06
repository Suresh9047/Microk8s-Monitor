import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
    return (
        <>
            <PageHeader
                title="Cluster Overview"
                description="Real-time metrics for your MicroK8s cluster."
                action={
                    <Button variant="secondary" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Cluster Status", value: "Healthy", color: "text-emerald-500 dark:text-emerald-400" },
                    { label: "Total Nodes", value: "3", color: "text-slate-900 dark:text-white" },
                    { label: "Active Pods", value: "24", color: "text-indigo-600 dark:text-indigo-400" },
                    { label: "Services", value: "12", color: "text-slate-900 dark:text-white" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none transition-colors duration-300">
                        <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-12 text-center shadow-sm dark:shadow-none transition-colors duration-300">
                <p className="text-slate-500">Resource usage charts will appear here.</p>
            </div>
        </>
    );
}
