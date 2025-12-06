import {
    LayoutDashboard,
    Box,
    Layers,
    Network,
    Globe,
    Settings,
    Users,
    Shield,
    Lock
} from "lucide-react";
import { NavItem } from "@/types";


export const APP_NAME = "Arffy Technologies";
export const APP_DESCRIPTION = "Cluster Monitor System";

export const NAV_ITEMS: NavItem[] = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Namespaces",
        href: "/dashboard/namespaces",
        icon: Layers,
    },
    {
        title: "Pods",
        href: "/dashboard/pods",
        icon: Box,
    },
    {
        title: "Deployments",
        href: "/dashboard/deployments",
        icon: Network,
    },
    {
        title: "Services",
        href: "/dashboard/services",
        icon: Globe,
    },
    {
        title: "Ingress",
        href: "/dashboard/ingress",
        icon: Shield,
    },
    {
        title: "Secrets & Certs",
        href: "/dashboard/secrets",
        icon: Lock,
    },
    {
        title: "Image Registry",
        href: "/dashboard/registry",
        icon: Box,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        disabled: true,
    },
];
