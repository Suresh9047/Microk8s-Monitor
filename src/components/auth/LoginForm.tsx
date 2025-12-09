"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LoginFormProps {
    onSubmit: (data: any) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Unified payload structure
        onSubmit({ username, password });
        setTimeout(() => setIsLoading(false), 3000); // Safety fallback
    };

    return (
        <motion.form
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
            onSubmit={handleSubmit}
        >
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 mb-3 border border-indigo-500/20">
                    <Fingerprint size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">System Access</h3>
                <p className="text-slate-400 text-sm">
                    Authenticate to continue
                </p>
            </div>

            <Input
                label="Username"
                placeholder="Enter username"
                icon={<User size={18} />}
                className="border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 bg-slate-900/50"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                className="border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 bg-slate-900/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                size="lg"
                isLoading={isLoading}
            >
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </motion.form>
    );
}
