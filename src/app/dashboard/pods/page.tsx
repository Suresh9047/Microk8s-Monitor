"use client";

import { useRole } from "@/hooks/useRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { RefreshCw, FileText, Trash2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { podService, Pod } from "@/services/pod.service";
import { PodFilters } from "@/components/pods/PodFilters";
import { PodDetailsModal } from "@/components/pods/PodDetailsModal";
import { PodLogsModal } from "@/components/pods/PodLogsModal";
import { PodFilters as PodFiltersType } from "@/types";

export default function PodsPage() {
  const { isAdmin } = useRole();
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PodFiltersType>({});
  const [namespaces, setNamespaces] = useState<string[]>([
    "default",
    "kube-system",
    "ingress",
  ]);

  // Modal states
  const [detailsModal, setDetailsModal] = useState<{
    namespace: string;
    name: string;
  } | null>(null);
  const [logsModal, setLogsModal] = useState<{
    namespace: string;
    name: string;
    containers: string[];
  } | null>(null);

  useEffect(() => {
    fetchPods();
  }, [filters]);

  const fetchPods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await podService.getAllPods(filters);
      setPods(data);

      // Extract unique namespaces from pods
      const uniqueNamespaces = Array.from(
        new Set(data.map((pod) => pod.namespace))
      );
      setNamespaces(uniqueNamespaces);
    } catch (err: any) {
      console.error("Failed to fetch pods from API:", err);
      setError(err.message || "Failed to fetch pods from API");
      setPods([]); // Clear pods on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (namespace: string, name: string) => {
    if (confirm(`Are you sure you want to delete pod "${name}"?`)) {
      try {
        await podService.deletePod(namespace, name);
        // Refresh the list
        fetchPods();
      } catch (err: any) {
        alert(`Failed to delete pod: ${err.message}`);
      }
    }
  };

  const handleViewDetails = (namespace: string, name: string) => {
    setDetailsModal({ namespace, name });
  };

  const handleViewLogs = (namespace: string, name: string) => {
    // In a real scenario, you'd fetch the container names from pod details
    // For now, we'll assume a single container with the pod name
    setLogsModal({ namespace, name, containers: [name] });
  };

  return (
    <>
      <PageHeader
        title="Pods"
        description="Manage and monitor your cluster workloads."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchPods}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      {/* Filters */}
      <PodFilters onFilterChange={setFilters} namespaces={namespaces} />

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-200">
          <p className="text-sm">
            <strong>Note:</strong> Unable to fetch pods from API. Please ensure
            your backend is running.
          </p>
          <p className="text-xs mt-1 text-yellow-600 dark:text-yellow-400">
            Error: {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Pods Table */}
      {!loading && (
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
          {pods.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No pods found.{" "}
              {filters.namespace || filters.phase
                ? "Try adjusting your filters."
                : ""}
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Namespace</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">CPU</th>
                  <th className="px-6 py-4">Memory</th>
                  <th className="px-6 py-4">Restarts</th>
                  <th className="px-6 py-4">Age</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {pods.map((pod) => (
                  <tr
                    key={pod.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleViewDetails(pod.namespace, pod.name)
                        }
                        className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {pod.name}
                      </button>
                    </td>
                    <td className="px-6 py-4">{pod.namespace}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={pod.status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{pod.cpu}</td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {pod.memory}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pod.restarts > 0
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}
                      >
                        {pod.restarts}
                      </span>
                    </td>
                    <td className="px-6 py-4">{pod.age}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleViewDetails(pod.namespace, pod.name)
                          }
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="View Details"
                        >
                          <Info size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleViewLogs(pod.namespace, pod.name)
                          }
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="View Logs"
                        >
                          <FileText size={16} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() =>
                              handleDelete(pod.namespace, pod.name)
                            }
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete Pod"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modals */}
      {detailsModal && (
        <PodDetailsModal
          namespace={detailsModal.namespace}
          podName={detailsModal.name}
          onClose={() => setDetailsModal(null)}
        />
      )}

      {logsModal && (
        <PodLogsModal
          namespace={logsModal.namespace}
          podName={logsModal.name}
          containers={logsModal.containers}
          onClose={() => setLogsModal(null)}
        />
      )}
    </>
  );
}
