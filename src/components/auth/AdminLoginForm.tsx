"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AdminLoginFormProps {
    onSubmit: (data: any) => void;
}

export function AdminLoginForm({ onSubmit }: AdminLoginFormProps) {
    const [adminId, setAdminId] = useState("");
    const [passkey, setPasskey] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        onSubmit({ adminId, passkey });
        setTimeout(() => setIsLoading(false), 3000); // Safety fallback
    };

    return (
        <motion.form
            key="admin-login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
            onSubmit={handleSubmit}
        >
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mb-3 border border-red-500/20">
                    <Fingerprint size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Administrator Access</h3>
                <p className="text-slate-400 text-sm">Root level privileges required</p>
            </div>
            <Input
                label="Admin ID"
                placeholder="root"
                icon={<ShieldCheck size={18} />}
                className="border-red-900/30 focus:border-red-500/50 focus:ring-red-500/10"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
            />
            <Input
                type="password"
                label="Passkey"
                placeholder="••••••••••••"
                icon={<Lock size={18} />}
                className="border-red-900/30 focus:border-red-500/50 focus:ring-red-500/10"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
            />
            <Button
                className="w-full mt-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-500/20"
                size="lg"
                isLoading={isLoading}
            >
                Authenticate
            </Button>
        </motion.form>
    );
}
