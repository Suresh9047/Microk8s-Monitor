export type Status =
  | "Coming soon"
  | "Active"
  | "Pending"
  | "Failed"
  | "Succeeded"
  | "Unknown";

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

// Pod-specific types
export type PodPhase =
  | "Running"
  | "Pending"
  | "Failed"
  | "Succeeded"
  | "Unknown"
  | "CrashLoopBackOff";

export interface PodCondition {
  type: string;
  status: string;
  lastProbeTime?: string;
  lastTransitionTime: string;
  reason?: string;
  message?: string;
}

export interface PodContainer {
  name: string;
  image: string;
  state: "running" | "waiting" | "terminated";
  ready: boolean;
  restartCount: number;
  ports?: Array<{
    name?: string;
    containerPort: number;
    protocol: string;
  }>;
  resources?: {
    requests?: { cpu?: string; memory?: string };
    limits?: { cpu?: string; memory?: string };
  };
}

export interface PodEvent {
  type: "Normal" | "Warning";
  reason: string;
  message: string;
  timestamp: string;
  count?: number;
}

export interface OwnerReference {
  kind: string;
  name: string;
  uid: string;
}

export interface PodDetails extends Pod {
  uid: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  phase: PodPhase;
  conditions: PodCondition[];
  containers: PodContainer[];
  events: PodEvent[];
  ownerReferences?: OwnerReference[];
  qosClass?: string;
  nodeName?: string;
  podIP?: string;
  hostIP?: string;
  createdAt: string;
}

export interface PodFilters {
  namespace?: string;
  phase?: PodPhase;
  labels?: Record<string, string>;
  nodeName?: string;
}

export interface PodLog {
  timestamp: string;
  message: string;
}
