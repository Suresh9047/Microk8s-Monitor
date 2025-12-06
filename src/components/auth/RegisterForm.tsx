"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RegisterFormProps {
    onSubmit: (data: any) => void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState(""); // Adding explicit username field if needed, or mapping email? User request has "username" in body.
    // The UI had First/Last Name, Email, Password. 
    // I should add a user name field or assume email is username? 
    // User request: { "username": "exampleUser", ... } -> explicit username field is safer.
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
        // Construct payload matching the API requirement structure + extra UI fields if useful
        onSubmit({ username, password, email, firstName, lastName });
        // Parent handles loading state stop or redirect
        setTimeout(() => setIsLoading(false), 2000); // safety timeout
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
                <h3 className="text-xl font-bold">Create Account</h3>
                <p className="text-slate-400 text-sm">
                    Apply for access to the MicroK8s cluster
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <Input
                label="Username"
                placeholder="johndoe"
                icon={<User size={18} />}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                label="Email Address"
                placeholder="name@arffy.tech"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                label="Create Password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button className="w-full mt-2" size="lg" variant="primary" isLoading={isLoading}>
                Register Account
            </Button>
        </motion.form>
    );
}
