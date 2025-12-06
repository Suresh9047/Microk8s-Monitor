"use client";

import { useRole } from "@/hooks/useRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const MOCK_NAMESPACES = [
    { id: '1', name: 'default', status: 'Active', age: '12d' },
    { id: '2', name: 'kube-system', status: 'Active', age: '12d' },
    { id: '3', name: 'ingress', status: 'Active', age: '12d' },
    { id: '4', name: 'monitoring', status: 'Active', age: '10d' },
];

export default function NamespacesPage() {
    const { isAdmin } = useRole();
    const [namespaces, setNamespaces] = useState(MOCK_NAMESPACES);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this namespace?")) {
            setNamespaces(namespaces.filter(n => n.id !== id));
        }
    };

    const handleCreate = () => {
        const name = prompt("Enter Namespace Name:");
        if (name) {
            setNamespaces([...namespaces, { id: Date.now().toString(), name, status: 'Active', age: '1s' }]);
        }
    };

    return (
        <>
            <PageHeader
                title="Namespaces"
                description="Logical isolation for your cluster resources."
                action={isAdmin && (
                    <Button size="sm" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Namespace
                    </Button>
                )}
            />

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Age</th>
                            {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {namespaces.map((ns) => (
                            <tr key={ns.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{ns.name}</td>
                                <td className="px-6 py-4"><StatusBadge status={ns.status} /></td>
                                <td className="px-6 py-4">{ns.age}</td>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(ns.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Delete Namespace"
                                        >
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
