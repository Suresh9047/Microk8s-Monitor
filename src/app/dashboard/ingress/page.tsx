"use client";

import { useRole } from "@/hooks/useRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { Trash2, ExternalLink } from "lucide-react";

const MOCK_INGRESS = [
    { id: '1', name: 'main-ingress', namespace: 'default', hosts: 'monitor.arffy.tech', address: '10.109.20.1', ports: '80, 443' },
    { id: '2', name: 'api-gateway', namespace: 'default', hosts: 'api.arffy.tech', address: '10.109.20.2', ports: '80, 443' },
];

export default function IngressPage() {
    const { isAdmin } = useRole();

    return (
        <>
            <PageHeader
                title="Ingress Rules"
                description="External access to the services in a cluster."
            />

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Namespace</th>
                            <th className="px-6 py-4">Hosts</th>
                            <th className="px-6 py-4">Address</th>
                            <th className="px-6 py-4">Ports</th>
                            {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {MOCK_INGRESS.map((ing) => (
                            <tr key={ing.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{ing.name}</td>
                                <td className="px-6 py-4">{ing.namespace}</td>
                                <td className="px-6 py-4 font-mono text-indigo-600 dark:text-indigo-400">
                                    <a href={`https://${ing.hosts}`} target="_blank" className="flex items-center hover:underline">
                                        {ing.hosts} <ExternalLink size={12} className="ml-1" />
                                    </a>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{ing.address}</td>
                                <td className="px-6 py-4 font-mono text-xs">{ing.ports}</td>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
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
