"use client";

import { useRole } from "@/hooks/useRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { Trash2, Settings } from "lucide-react";

export default function ServicesPage() {
    const { isAdmin } = useRole();

    const services = [
        { id: '1', name: 'kubernetes', namespace: 'default', type: 'ClusterIP', clusterIP: '10.96.0.1', ports: '443/TCP' },
        { id: '2', name: 'frontend-svc', namespace: 'default', type: 'NodePort', clusterIP: '10.101.45.12', ports: '80:30001/TCP' },
        { id: '3', name: 'db-svc', namespace: 'default', type: 'ClusterIP', clusterIP: '10.103.22.11', ports: '5432/TCP' },
    ];

    return (
        <>
            <PageHeader
                title="Services"
                description="Abstract way to expose an application running on a set of Pods."
            />

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Namespace</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Cluster IP</th>
                            <th className="px-6 py-4">Ports</th>
                            {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {services.map((svc) => (
                            <tr key={svc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{svc.name}</td>
                                <td className="px-6 py-4">{svc.namespace}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                                        {svc.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{svc.clusterIP}</td>
                                <td className="px-6 py-4 font-mono text-xs">{svc.ports}</td>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Edit YAML">
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
