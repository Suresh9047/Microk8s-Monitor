"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {

        const variants = {
            primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30",
            secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
            outline: "border-2 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10",
            ghost: "hover:bg-slate-800/50 text-slate-400 hover:text-white",
            danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs font-semibold rounded-lg",
            md: "h-11 px-6 text-sm font-semibold rounded-xl",
            lg: "h-14 px-8 text-base font-bold rounded-2xl",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "relative inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading}
                {...props}
            >
                {isLoading && (
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </span>
                )}
                <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
                    {children as React.ReactNode}
                </span>
            </motion.button>
        );
    }
);
Button.displayName = "Button";
