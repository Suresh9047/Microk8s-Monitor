"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function BrandingPanel() {
    return (
        <div className="hidden lg:flex flex-1 flex-col justify-center items-start p-16 xl:p-24 relative z-10 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl"
            >
                <div className="flex items-center gap-3 mb-8">
                    <Image
                        src="/assets/images/arffy.webp"
                        alt="Arffy Technologies"
                        width={180}
                        height={180}
                        className="rounded-xl"
                    />
                    <span className="text-xl font-medium tracking-tight text-slate-400">
                        Arffy Technologies
                    </span>
                </div>

                <h1 className="text-5xl xl:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                    MicroK8s <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Cluster Monitor
                    </span>
                </h1>

                <p className="text-lg text-slate-400 leading-relaxed mb-10 text-balance">
                    Complete observability for your pods, namespaces, deployments, and
                    more. Role-based access control included.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                        <div className="text-sm font-medium text-slate-500 mb-1">
                            Status
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-emerald-400 font-medium">
                                System Operational
                            </span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                        <div className="text-sm font-medium text-slate-500 mb-1">
                            Security
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-400" />
                            <span className="text-indigo-400 font-medium">RBAC Enabled</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
