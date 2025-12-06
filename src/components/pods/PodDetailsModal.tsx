"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PodDetails } from "@/types";
import { podService } from "@/services/pod.service";
import {
  X,
  Copy,
  CheckCircle2,
  Box,
  Activity,
  AlertCircle,
  Info,
  Clock,
  Server,
  Tag,
  FileText,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface PodDetailsModalProps {
  namespace: string;
  podName: string;
  onClose: () => void;
}

export function PodDetailsModal({
  namespace,
  podName,
  onClose,
}: PodDetailsModalProps) {
  const [podDetails, setPodDetails] = useState<PodDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "containers" | "events"
  >("overview");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchPodDetails();
  }, [namespace, podName]);

  const fetchPodDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await podService.getPodDetails(namespace, podName);
      setPodDetails(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pod details");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Box className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Pod Details
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {namespace} / {podName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 border-b border-slate-200 dark:border-slate-800">
            {[
              { id: "overview", label: "Overview", icon: Info },
              { id: "containers", label: "Containers", icon: Box },
              { id: "events", label: "Events", icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    {tab.label}
                  </div>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && podDetails && (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Status Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Status
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField
                          label="Phase"
                          value={podDetails.phase}
                          icon={<StatusBadge status={podDetails.phase} />}
                        />
                        <InfoField
                          label="QoS Class"
                          value={podDetails.qosClass || "N/A"}
                        />
                        <InfoField
                          label="Node"
                          value={podDetails.nodeName || "N/A"}
                          icon={<Server size={16} className="text-slate-400" />}
                        />
                        <InfoField
                          label="Pod IP"
                          value={podDetails.podIP || "N/A"}
                          icon={
                            <Network size={16} className="text-slate-400" />
                          }
                        />
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Metadata
                      </h3>
                      <div className="space-y-3">
                        <CopyableField
                          label="UID"
                          value={podDetails.uid}
                          onCopy={(val) => copyToClipboard(val, "uid")}
                          copied={copiedField === "uid"}
                        />
                        <InfoField
                          label="Created"
                          value={formatDate(podDetails.createdAt)}
                          icon={<Clock size={16} className="text-slate-400" />}
                        />
                        <InfoField label="Age" value={podDetails.age} />
                      </div>
                    </div>

                    {/* Labels Section */}
                    {podDetails.labels &&
                      Object.keys(podDetails.labels).length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Labels
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(podDetails.labels).map(
                              ([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full border border-indigo-200 dark:border-indigo-800"
                                >
                                  <span className="font-medium">{key}</span>
                                  <span className="text-indigo-400">=</span>
                                  <span>{value}</span>
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Owner References */}
                    {podDetails.ownerReferences &&
                      podDetails.ownerReferences.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Owner References
                          </h3>
                          <div className="space-y-2">
                            {podDetails.ownerReferences.map((owner) => (
                              <div
                                key={owner.uid}
                                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded">
                                    {owner.kind}
                                  </span>
                                  <span className="text-sm text-slate-900 dark:text-white font-medium">
                                    {owner.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Conditions */}
                    {podDetails.conditions &&
                      podDetails.conditions.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Conditions
                          </h3>
                          <div className="space-y-2">
                            {podDetails.conditions.map((condition, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                                    {condition.type}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      condition.status === "True"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                    }`}
                                  >
                                    {condition.status}
                                  </span>
                                </div>
                                {condition.message && (
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    {condition.message}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Containers Tab */}
                {activeTab === "containers" && (
                  <div className="space-y-4">
                    {podDetails.containers?.map((container) => (
                      <div
                        key={container.name}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            {container.name}
                          </h4>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              container.ready
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            }`}
                          >
                            {container.ready ? "Ready" : "Not Ready"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <InfoField label="Image" value={container.image} />
                          <InfoField label="State" value={container.state} />
                          <InfoField
                            label="Restart Count"
                            value={container.restartCount?.toString() || "0"}
                          />

                          {container.ports && container.ports.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Ports:
                              </span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {container.ports.map((port, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded border border-indigo-200 dark:border-indigo-800"
                                  >
                                    {port.containerPort}/{port.protocol}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {container.resources && (
                            <div className="mt-3 p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                              <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Resources
                              </h5>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {container.resources.requests && (
                                  <>
                                    <div>
                                      <span className="text-slate-600 dark:text-slate-400">
                                        CPU Request:
                                      </span>
                                      <span className="ml-1 text-slate-900 dark:text-white font-mono">
                                        {container.resources.requests.cpu ||
                                          "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-600 dark:text-slate-400">
                                        Memory Request:
                                      </span>
                                      <span className="ml-1 text-slate-900 dark:text-white font-mono">
                                        {container.resources.requests.memory ||
                                          "N/A"}
                                      </span>
                                    </div>
                                  </>
                                )}
                                {container.resources.limits && (
                                  <>
                                    <div>
                                      <span className="text-slate-600 dark:text-slate-400">
                                        CPU Limit:
                                      </span>
                                      <span className="ml-1 text-slate-900 dark:text-white font-mono">
                                        {container.resources.limits.cpu ||
                                          "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-600 dark:text-slate-400">
                                        Memory Limit:
                                      </span>
                                      <span className="ml-1 text-slate-900 dark:text-white font-mono">
                                        {container.resources.limits.memory ||
                                          "N/A"}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Events Tab */}
                {activeTab === "events" && (
                  <div className="space-y-3">
                    {!podDetails.events || podDetails.events.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        No events available
                      </div>
                    ) : (
                      podDetails.events.map((event, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                event.type === "Warning"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                                  : "bg-blue-100 dark:bg-blue-900/30"
                              }`}
                            >
                              {event.type === "Warning" ? (
                                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {event.reason}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {formatDate(event.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {event.message}
                              </p>
                              {event.count && event.count > 1 && (
                                <span className="inline-block mt-1 text-xs text-slate-500">
                                  Count: {event.count}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Helper Components
function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-slate-900 dark:text-white">{value}</span>
      </div>
    </div>
  );
}

function CopyableField({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: (val: string) => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-900 dark:text-white font-mono truncate max-w-xs">
          {value}
        </span>
        <button
          onClick={() => onCopy(value)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
}
