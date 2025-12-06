"use client";

import { useRole } from "@/hooks/useRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Settings, Trash2 } from "lucide-react";

const MOCK_DEPLOYMENTS = [
    { id: '1', name: 'nginx-deployment', namespace: 'default', replicas: '3/3', image: 'nginx:1.14.2', age: '2d' },
    { id: '2', name: 'redis-cache', namespace: 'default', replicas: '1/1', image: 'redis:alpine', age: '1d' },
];

export default function DeploymentsPage() {
    const { isAdmin } = useRole();

    return (
        <>
            <PageHeader
                title="Deployments"
                description="Manage your stateless application deployments."
            />

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Namespace</th>
                            <th className="px-6 py-4">Replicas</th>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Age</th>
                            {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {MOCK_DEPLOYMENTS.map((d) => (
                            <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{d.name}</td>
                                <td className="px-6 py-4">{d.namespace}</td>
                                <td className="px-6 py-4 font-mono">{d.replicas}</td>
                                <td className="px-6 py-4 font-mono text-xs">{d.image}</td>
                                <td className="px-6 py-4">{d.age}</td>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Scale/Edit">
                                                <Settings size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
