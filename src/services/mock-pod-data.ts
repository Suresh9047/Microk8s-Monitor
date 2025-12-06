import { PodDetails } from "@/types";

export const MOCK_POD_DETAILS: Record<string, PodDetails> = {
  "nginx-ingress-cntr-984": {
    id: "1",
    name: "nginx-ingress-cntr-984",
    namespace: "ingress",
    status: "Active",
    phase: "Running",
    age: "4d",
    cpu: "12m",
    memory: "142Mi",
    restarts: 0,
    nodeName: "node-1",
    uid: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    labels: {
      app: "nginx-ingress",
      version: "v1.2.3",
      tier: "frontend",
    },
    annotations: {
      "kubernetes.io/created-by": "deployment-controller",
      "prometheus.io/scrape": "true",
    },
    conditions: [
      {
        type: "Ready",
        status: "True",
        lastTransitionTime: new Date(
          Date.now() - 4 * 24 * 60 * 60 * 1000
        ).toISOString(),
        reason: "ContainersReady",
        message: "All containers are ready",
      },
      {
        type: "Initialized",
        status: "True",
        lastTransitionTime: new Date(
          Date.now() - 4 * 24 * 60 * 60 * 1000
        ).toISOString(),
        reason: "PodInitialized",
        message: "Pod has been initialized",
      },
    ],
    containers: [
      {
        name: "nginx",
        image: "nginx:1.21.3",
        state: "running",
        ready: true,
        restartCount: 0,
        ports: [
          { containerPort: 80, protocol: "TCP", name: "http" },
          { containerPort: 443, protocol: "TCP", name: "https" },
        ],
        resources: {
          requests: { cpu: "100m", memory: "128Mi" },
          limits: { cpu: "200m", memory: "256Mi" },
        },
      },
    ],
    events: [
      {
        type: "Normal",
        reason: "Scheduled",
        message:
          "Successfully assigned ingress/nginx-ingress-cntr-984 to node-1",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        count: 1,
      },
      {
        type: "Normal",
        reason: "Pulled",
        message: "Container image nginx:1.21.3 already present on machine",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        count: 1,
      },
      {
        type: "Normal",
        reason: "Created",
        message: "Created container nginx",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        count: 1,
      },
      {
        type: "Normal",
        reason: "Started",
        message: "Started container nginx",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        count: 1,
      },
    ],
    ownerReferences: [
      {
        kind: "Deployment",
        name: "nginx-ingress",
        uid: "x1y2z3a4-b5c6-7d8e-9f0g-h1i2j3k4l5m6",
      },
    ],
    qosClass: "Burstable",
    podIP: "10.244.0.5",
    hostIP: "192.168.1.10",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "coredns-6f5f9b5d74-29z4": {
    id: "2",
    name: "coredns-6f5f9b5d74-29z4",
    namespace: "kube-system",
    status: "Active",
    phase: "Running",
    age: "12d",
    cpu: "4m",
    memory: "45Mi",
    restarts: 0,
    nodeName: "node-1",
    uid: "b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7",
    labels: {
      "k8s-app": "kube-dns",
      "pod-template-hash": "6f5f9b5d74",
    },
    annotations: {},
    conditions: [
      {
        type: "Ready",
        status: "True",
        lastTransitionTime: new Date(
          Date.now() - 12 * 24 * 60 * 60 * 1000
        ).toISOString(),
        reason: "ContainersReady",
      },
    ],
    containers: [
      {
        name: "coredns",
        image: "k8s.gcr.io/coredns/coredns:v1.8.6",
        state: "running",
        ready: true,
        restartCount: 0,
        ports: [
          { containerPort: 53, protocol: "UDP", name: "dns" },
          { containerPort: 53, protocol: "TCP", name: "dns-tcp" },
        ],
        resources: {
          requests: { cpu: "100m", memory: "70Mi" },
          limits: { cpu: "100m", memory: "170Mi" },
        },
      },
    ],
    events: [],
    ownerReferences: [
      {
        kind: "ReplicaSet",
        name: "coredns-6f5f9b5d74",
        uid: "y2z3a4b5-c6d7-8e9f-0g1h-i2j3k4l5m6n7",
      },
    ],
    qosClass: "Guaranteed",
    podIP: "10.244.0.2",
    hostIP: "192.168.1.10",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "payment-service-v32": {
    id: "5",
    name: "payment-service-v32",
    namespace: "default",
    status: "Active",
    phase: "Running",
    age: "4h",
    cpu: "45m",
    memory: "412Mi",
    restarts: 1,
    nodeName: "node-2",
    uid: "c3d4e5f6-g7h8-9i0j-1k2l-m3n4o5p6q7r8",
    labels: {
      app: "payment-service",
      version: "v3.2",
      environment: "production",
    },
    annotations: {
      "prometheus.io/scrape": "true",
      "prometheus.io/port": "8080",
    },
    conditions: [
      {
        type: "Ready",
        status: "True",
        lastTransitionTime: new Date(
          Date.now() - 3.5 * 60 * 60 * 1000
        ).toISOString(),
        reason: "ContainersReady",
      },
    ],
    containers: [
      {
        name: "payment-service",
        image: "myregistry.io/payment-service:v3.2",
        state: "running",
        ready: true,
        restartCount: 1,
        ports: [
          { containerPort: 8080, protocol: "TCP", name: "http" },
          { containerPort: 9090, protocol: "TCP", name: "metrics" },
        ],
        resources: {
          requests: { cpu: "200m", memory: "256Mi" },
          limits: { cpu: "500m", memory: "512Mi" },
        },
      },
      {
        name: "sidecar-proxy",
        image: "envoyproxy/envoy:v1.20.0",
        state: "running",
        ready: true,
        restartCount: 0,
        ports: [{ containerPort: 15001, protocol: "TCP", name: "proxy" }],
        resources: {
          requests: { cpu: "50m", memory: "64Mi" },
          limits: { cpu: "100m", memory: "128Mi" },
        },
      },
    ],
    events: [
      {
        type: "Warning",
        reason: "BackOff",
        message: "Back-off restarting failed container",
        timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
        count: 2,
      },
      {
        type: "Normal",
        reason: "Started",
        message: "Started container payment-service",
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        count: 1,
      },
    ],
    ownerReferences: [
      {
        kind: "Deployment",
        name: "payment-service",
        uid: "z3a4b5c6-d7e8-9f0g-1h2i-j3k4l5m6n7o8",
      },
    ],
    qosClass: "Burstable",
    podIP: "10.244.1.15",
    hostIP: "192.168.1.11",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
};

export const MOCK_POD_LOGS: Record<string, string> = {
  "nginx-ingress-cntr-984": `2024-12-06T14:30:15.123Z 192.168.1.50 - - [06/Dec/2024:14:30:15 +0000] "GET /api/health HTTP/1.1" 200 25 "-" "kube-probe/1.25"
2024-12-06T14:30:20.456Z 192.168.1.51 - - [06/Dec/2024:14:30:20 +0000] "GET /api/status HTTP/1.1" 200 45 "-" "Mozilla/5.0"
2024-12-06T14:30:25.789Z [INFO] nginx: configuration reload successful
2024-12-06T14:30:30.012Z 192.168.1.52 - - [06/Dec/2024:14:30:30 +0000] "POST /api/login HTTP/1.1" 200 512 "-" "axios/0.21.1"
2024-12-06T14:30:35.345Z 192.168.1.53 - - [06/Dec/2024:14:30:35 +0000] "GET /api/users/123 HTTP/1.1" 200 1024 "-" "axios/0.21.1"
2024-12-06T14:30:40.678Z [INFO] nginx: worker process started
2024-12-06T14:30:45.901Z 192.168.1.54 - - [06/Dec/2024:14:30:45 +0000] "GET /api/products HTTP/1.1" 200 2048 "-" "axios/0.21.1"`,

  "coredns-6f5f9b5d74-29z4": `2024-12-06T14:28:10.123Z [INFO] plugin/reload: Running configuration MD5 = 4e235fcc3696966e76d107cf535b7e4
2024-12-06T14:28:15.456Z [INFO] CoreDNS-1.8.6
2024-12-06T14:28:20.789Z [INFO] linux/amd64, go1.17.1, 13a9191
2024-12-06T14:28:25.012Z [INFO] Reloading
2024-12-06T14:28:30.345Z [INFO] plugin/health: Still healthy ("Waiting for connection to become ready")
2024-12-06T14:28:35.678Z [INFO] 127.0.0.1:45892 - 1234 "A IN kubernetes.default.svc.cluster.local. udp 54 false 512" NOERROR qr,aa,rd 107 0.000123s
2024-12-06T14:28:40.901Z [INFO] 127.0.0.1:45893 - 1235 "A IN api.default.svc.cluster.local. udp 48 false 512" NOERROR qr,aa,rd 101 0.000098s`,

  "payment-service-v32": `2024-12-06T14:25:00.123Z [INFO] Starting payment service v3.2
2024-12-06T14:25:01.456Z [INFO] Connecting to database at postgres://db:5432/payments
2024-12-06T14:25:02.789Z [INFO] Database connection established
2024-12-06T14:25:03.012Z [INFO] Initializing Redis cache at redis://cache:6379
2024-12-06T14:25:03.345Z [INFO] Redis connection established
2024-12-06T14:25:03.678Z [INFO] Loading payment processors: Stripe, PayPal, Square
2024-12-06T14:25:05.901Z [INFO] HTTP server listening on port 8080
2024-12-06T14:25:10.234Z [INFO] Health check endpoint ready at /health
2024-12-06T14:26:15.567Z [INFO] Processing payment request ID: pay_abc123
2024-12-06T14:26:16.890Z [INFO] Payment validated: $99.99 USD
2024-12-06T14:26:17.123Z [INFO] Payment processed successfully: pay_abc123
2024-12-06T14:27:22.456Z [WARN] Rate limit approaching for IP 192.168.1.100
2024-12-06T14:28:30.789Z [INFO] Processing payment request ID: pay_def456
2024-12-06T14:28:31.012Z [ERROR] Payment validation failed: insufficient funds
2024-12-06T14:28:31.345Z [INFO] Payment declined: pay_def456
2024-12-06T14:29:45.678Z [INFO] Daily transaction report generated: 1,245 transactions, $125,430.50 total`,
};
