"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LoginFormProps {
    onSubmit: (data: any) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        onSubmit({ email, password });
        // Keep loading state until parent resolves or error occurs
        // Parent should handle setIsLoading(false) if passed or we just rely on unmount/redirect
        setTimeout(() => setIsLoading(false), 3000); // Safety fallback
    };

    return (
        <motion.form
            key="user-login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
            onSubmit={handleSubmit}
        >
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold">Welcome Back</h3>
                <p className="text-slate-400 text-sm">
                    Enter your credentials to access the dashboard
                </p>
            </div>
            <Input
                label="Username or Email"
                placeholder="suresh@gmail.com"
                icon={<User size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full mt-2" size="lg" isLoading={isLoading}>
                Sign In <ArrowRight className="w-4 h-4" />
            </Button>
        </motion.form>
    );
}
