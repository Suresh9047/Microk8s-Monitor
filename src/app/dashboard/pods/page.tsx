"use client";

import { useRole } from "@/hooks/useRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { RefreshCw, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

const MOCK_PODS = [
    { id: '1', name: 'nginx-ingress-cntr-984', namespace: 'ingress', status: 'Active', age: '4d', cpu: '12m', memory: '142Mi' },
    { id: '2', name: 'coredns-6f5f9b5d74-29z4', namespace: 'kube-system', status: 'Active', age: '12d', cpu: '4m', memory: '45Mi' },
    { id: '3', name: 'dashboard-metrics-scraper', namespace: 'kube-system', status: 'Pending', age: '1m', cpu: '-', memory: '-' },
    { id: '4', name: 'redis-cart-749d9b5', namespace: 'default', status: 'Failed', age: '3h', cpu: '0m', memory: '0Mi' },
    { id: '5', name: 'payment-service-v32', namespace: 'default', status: 'Active', age: '4h', cpu: '45m', memory: '412Mi' },
];

export default function PodsPage() {
    const { isAdmin } = useRole();
    const [pods, setPods] = useState(MOCK_PODS);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this pod?")) {
            setPods(pods.filter(p => p.id !== id));
        }
    };

    const handleViewLogs = (podName: string) => {
        alert(`Viewing logs for ${podName}...\n[INFO] Starting container...\n[INFO] Connected to DB...`);
    };

    return (
        <>
            <PageHeader
                title="Pods"
                description="Manage and monitor your cluster workloads."
                action={
                    <Button variant="secondary" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                }
            />

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Namespace</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">CPU</th>
                            <th className="px-6 py-4">Memory</th>
                            <th className="px-6 py-4">Age</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {pods.map((pod) => (
                            <tr key={pod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{pod.name}</td>
                                <td className="px-6 py-4">{pod.namespace}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={pod.status} />
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{pod.cpu}</td>
                                <td className="px-6 py-4 font-mono text-xs">{pod.memory}</td>
                                <td className="px-6 py-4">{pod.age}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleViewLogs(pod.name)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            title="View Logs"
                                        >
                                            <FileText size={16} />
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(pod.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete Pod"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
