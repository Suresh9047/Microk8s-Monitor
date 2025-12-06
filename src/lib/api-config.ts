export const API_BASE_URL = "http://localhost:8000/api";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  KUBERNETES: {
    PODS: "/k8s/pods",
    POD_DETAILS: "/k8s/pods/:namespace/:name",
    POD_LOGS: "/k8s/pods/:namespace/:name/logs",
    DEPLOYMENTS: "/k8s/deployments",
    SERVICES: "/k8s/services",
    NAMESPACES: "/k8s/namespaces",
    INGRESS: "/k8s/ingress",
    SECRETS: "/k8s/secrets",
  },
  NEXUS: {
    IMAGES: "/nexus/images",
    REPOSITORIES: "/nexus/repositories",
  },
};
