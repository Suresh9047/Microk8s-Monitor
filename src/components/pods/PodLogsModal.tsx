"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { podService } from "@/services/pod.service";
import {
  X,
  Download,
  Search,
  Terminal,
  RefreshCw,
  Play,
  Pause,
  ArrowDown,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PodLogsModalProps {
  namespace: string;
  podName: string;
  containers: string[];
  onClose: () => void;
}

export function PodLogsModal({
  namespace,
  podName,
  containers,
  onClose,
}: PodLogsModalProps) {
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<string>(
    containers[0] || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [copied, setCopied] = useState(false);

  const logsContainerRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedContainer) {
      fetchLogs();
    }
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [selectedContainer, showTimestamps]);

  useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const logData = await podService.getPodLogs(namespace, podName, {
        container: selectedContainer,
        tailLines: 500,
        timestamps: showTimestamps,
      });
      setLogs(logData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const toggleStreaming = () => {
    if (isStreaming) {
      // Stop streaming
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
      setIsStreaming(false);
    } else {
      // Start streaming
      setIsStreaming(true);
      streamIntervalRef.current = setInterval(() => {
        fetchLogs();
      }, 2000); // Refresh every 2 seconds
    }
  };

  const downloadLogs = () => {
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${podName}-${selectedContainer}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(logs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToBottom = () => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  };

  const filteredLogs = logs
    .split("\n")
    .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
    .join("\n");

  const highlightedLogs = searchQuery
    ? filteredLogs
        .split(new RegExp(`(${searchQuery})`, "gi"))
        .map((part, idx) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={idx} className="bg-yellow-300 dark:bg-yellow-600">
              {part}
            </mark>
          ) : (
            part
          )
        )
    : filteredLogs;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Pod Logs
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

          {/* Controls */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Container Selector */}
              {containers.length > 1 && (
                <select
                  value={selectedContainer}
                  onChange={(e) => setSelectedContainer(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  {containers.map((container) => (
                    <option key={container} value={container}>
                      Container: {container}
                    </option>
                  ))}
                </select>
              )}

              {/* Streaming Toggle */}
              <Button
                variant={isStreaming ? "primary" : "secondary"}
                size="sm"
                onClick={toggleStreaming}
              >
                {isStreaming ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Streaming
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Streaming
                  </>
                )}
              </Button>

              {/* Refresh */}
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchLogs}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              {/* Timestamps Toggle */}
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTimestamps}
                  onChange={(e) => setShowTimestamps(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Timestamps
                </span>
              </label>

              {/* Auto Scroll */}
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Auto-scroll
                </span>
              </label>

              <div className="flex-1" />

              {/* Copy Button */}
              <Button variant="secondary" size="sm" onClick={copyLogs}>
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>

              {/* Download */}
              <Button variant="secondary" size="sm" onClick={downloadLogs}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>

              {/* Scroll to Bottom */}
              <Button variant="secondary" size="sm" onClick={scrollToBottom}>
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Logs Display */}
          <div
            ref={logsContainerRef}
            className="overflow-y-auto bg-slate-950 p-4 font-mono text-xs text-slate-100 h-[calc(90vh-280px)]"
          >
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
              </div>
            )}

            {error && (
              <div className="text-red-400 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                Error: {error}
              </div>
            )}

            {!loading && !error && logs && (
              <pre className="whitespace-pre-wrap break-words">
                {searchQuery ? highlightedLogs : filteredLogs}
              </pre>
            )}

            {!loading && !error && !logs && (
              <div className="text-center py-8 text-slate-400">
                No logs available
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              {filteredLogs.split("\n").filter((l) => l).length} lines
              {searchQuery &&
                ` (filtered from ${logs.split("\n").filter((l) => l).length})`}
            </div>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
