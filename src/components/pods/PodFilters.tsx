"use client";

import { useState } from "react";
import { PodFilters as PodFiltersType, PodPhase } from "@/types";
import { Filter, X, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PodFiltersProps {
  onFilterChange: (filters: PodFiltersType) => void;
  namespaces?: string[];
}

const POD_PHASES: PodPhase[] = [
  "Running",
  "Pending",
  "Failed",
  "Succeeded",
  "Unknown",
  "CrashLoopBackOff",
];

export function PodFilters({
  onFilterChange,
  namespaces = [],
}: PodFiltersProps) {
  const [filters, setFilters] = useState<PodFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [labelKey, setLabelKey] = useState("");
  const [labelValue, setLabelValue] = useState("");

  const updateFilters = (newFilters: Partial<PodFiltersType>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    setFilters({});
    setLabelKey("");
    setLabelValue("");
    onFilterChange({});
  };

  const addLabel = () => {
    if (labelKey && labelValue) {
      const newLabels = { ...filters.labels, [labelKey]: labelValue };
      updateFilters({ labels: newLabels });
      setLabelKey("");
      setLabelValue("");
    }
  };

  const removeLabel = (key: string) => {
    const newLabels = { ...filters.labels };
    delete newLabels[key];
    updateFilters({
      labels: Object.keys(newLabels).length > 0 ? newLabels : undefined,
    });
  };

  const activeFilterCount = [
    filters.namespace,
    filters.phase,
    filters.nodeName,
    filters.labels && Object.keys(filters.labels).length > 0,
  ].filter(Boolean).length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant={showFilters ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-600 dark:bg-indigo-500 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-slate-500 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Namespace Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Namespace
              </label>
              <select
                value={filters.namespace || ""}
                onChange={(e) =>
                  updateFilters({ namespace: e.target.value || undefined })
                }
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              >
                <option value="">All Namespaces</option>
                {namespaces.map((ns) => (
                  <option key={ns} value={ns}>
                    {ns}
                  </option>
                ))}
              </select>
            </div>

            {/* Phase Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phase
              </label>
              <select
                value={filters.phase || ""}
                onChange={(e) =>
                  updateFilters({
                    phase: (e.target.value as PodPhase) || undefined,
                  })
                }
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              >
                <option value="">All Phases</option>
                {POD_PHASES.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>

            {/* Node Name Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Node Name
              </label>
              <input
                type="text"
                value={filters.nodeName || ""}
                onChange={(e) =>
                  updateFilters({ nodeName: e.target.value || undefined })
                }
                placeholder="Filter by node..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Label Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Labels
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.labels &&
                Object.entries(filters.labels).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full border border-indigo-200 dark:border-indigo-800"
                  >
                    <span className="font-medium">{key}</span>
                    <span className="text-indigo-400 dark:text-indigo-500">
                      =
                    </span>
                    <span>{value}</span>
                    <button
                      onClick={() => removeLabel(key)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={labelKey}
                onChange={(e) => setLabelKey(e.target.value)}
                placeholder="Key"
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
              <input
                type="text"
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
              <Button
                onClick={addLabel}
                disabled={!labelKey || !labelValue}
                variant="secondary"
                size="sm"
              >
                Add Label
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
