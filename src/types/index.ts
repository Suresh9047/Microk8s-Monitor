export type Status = "Coming soon" | "Active" | "Pending" | "Failed" | "Succeeded" | "Unknown";

export interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    disabled?: boolean;
}

export interface K8sResource {
    id: string;
    name: string;
    namespace: string;
    age: string;
    status: Status;
}

export interface Pod extends K8sResource {
    restarts: number;
    cpu: string;
    memory: string;
}

export interface Deployment extends K8sResource {
    replicas: string; // e.g., "3/3"
}

export interface Service extends K8sResource {
    type: "ClusterIP" | "NodePort" | "LoadBalancer";
    clusterIP: string;
    ports: string;
}
