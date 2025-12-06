"use client";

import { useRole } from "@/hooks/useRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { RefreshCw, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";

const MOCK_CERTS = [
    { id: '1', name: 'api.arffy.tech-tls', domain: 'api.arffy.tech', expiry: '2025-01-15', status: 'Active', autoRenew: true },
    { id: '2', name: 'dashboard-tls', domain: 'monitor.arffy.tech', expiry: '2024-12-20', status: 'Warning', autoRenew: false },
];

export default function SecretsPage() {
    const { isAdmin } = useRole();
    const [certs, setCerts] = useState(MOCK_CERTS);

    const handleRenew = (id: string) => {
        alert("Triggering Certbot renewal process...");
        // Mock API Call
        setCerts(certs.map(c => c.id === id ? { ...c, status: 'Active', expiry: '2025-03-01' } : c));
    };

    return (
        <>
            <PageHeader
                title="Secrets & Certificates"
                description="Manage SSL/TLS certificates and sensitive keys."
            />

            <div className="space-y-8">
                {/* Certificates Section */}
                {/* Certificates Section */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-bold text-slate-900 dark:text-white">SSL Certificates (Certbot)</h3>
                    </div>
                    <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-medium border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Domain</th>
                                <th className="px-6 py-4">Expiry Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Auto-Renew</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {certs.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.name}</td>
                                    <td className="px-6 py-4">{c.domain}</td>
                                    <td className="px-6 py-4 font-mono">{c.expiry}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${c.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                            'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.autoRenew ? (
                                            <span className="text-emerald-600 dark:text-emerald-400 text-xs">Enabled</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs">Disabled</span>
                                        )}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <Button size="sm" variant="outline" onClick={() => handleRenew(c.id)}>
                                                <RefreshCw className="w-3 h-3 mr-2" />
                                                Renew
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Generic Secrets Section (Mock view) */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden opacity-75 shadow-sm dark:shadow-none transition-colors duration-300">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-bold text-slate-900 dark:text-white">Opaque Secrets</h3>
                    </div>
                    <div className="p-6 text-center text-slate-500 text-sm">
                        4 secrets hidden for security.
                    </div>
                </div>
            </div>
        </>
    );
}
