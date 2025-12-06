import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Status } from "@/types";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
    status: Status | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Running: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Succeeded: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        Failed: "bg-red-500/10 text-red-400 border-red-500/20",
        Unknown: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };

    const normalizedStatus = (status in styles ? status : "Unknown") as keyof typeof styles;

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            styles[normalizedStatus] || styles["Unknown"]
        )}>
            {status}
        </span>
    );
}
