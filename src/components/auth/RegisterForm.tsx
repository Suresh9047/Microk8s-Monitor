"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RegisterFormProps {
    onSubmit: (data: any) => void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setIsLoading(true);
        onSubmit({ username, password, email, firstName, lastName });
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <motion.form
            key="register"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
            onSubmit={handleSubmit}
        >
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-300 mb-3 border border-slate-700">
                    <UserPlus size={24} />
                </div>
                <h3 className="text-xl font-bold font-white">Create Account</h3>
                <p className="text-slate-400 text-sm">
                    Apply for access to the MicroK8s cluster
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                
                <Input
                    placeholder="First Name"
                    className="border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 bg-slate-900/50"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <Input
                    placeholder="Last Name"
                    className="border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 bg-slate-900/50"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>

            <Input
                label="Username"
                placeholder="johndoe"
                icon={<User size={18} />}
                className="border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 bg-slate-900/50"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <Input
                label="Email Address"
                placeholder="name@arffy.tech"
                icon={<Mail size={18} />}
                className="border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 bg-slate-900/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                type="password"
                label="Create Password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                className="border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 bg-slate-900/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                className="border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/10 bg-slate-900/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button className="w-full mt-2 bg-slate-800 hover:bg-slate-700" size="lg" variant="primary" isLoading={isLoading}>
                Register Account
            </Button>

        </motion.form>
    );
}
