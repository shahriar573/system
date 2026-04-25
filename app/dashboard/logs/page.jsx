"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import deploymentApi from "@/lib/api/deploymentApi";
import ProtectedRoute from "@/components/ProtectedRoute";

const statusConfig = {
  queued: { dot: "bg-muted", text: "text-muted", label: "Queued" },
  building: { dot: "bg-gold", text: "text-gold", label: "Building" },
  running: { dot: "bg-[#4a9f6e]", text: "text-[#4a9f6e]", label: "Running" },
  stopped: { dot: "bg-muted", text: "text-muted", label: "Stopped" },
  failed: { dot: "bg-red-500", text: "text-red-400", label: "Failed" },
};

export default function LogsPage() {
  const [deployments, setDeployments] = useState([]);
  const [selected, setSelected] = useState(null); // selected deployment
  const [activeTab, setActiveTab] = useState("build");
  const [buildLogs, setBuildLogs] = useState([]);
  const [runtimeLogs, setRuntimeLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const logsEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [buildLogs, runtimeLogs]);

  // Fetch deployments on mount
  useEffect(() => {
    deploymentApi
      .getAll()
      .then(({ deployments }) => {
        setDeployments(deployments);
        // Auto-select first deployment
        if (deployments.length > 0) selectDeployment(deployments[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Cleanup SSE on unmount
  useEffect(() => () => eventSourceRef.current?.close(), []);

  const selectDeployment = async (dep) => {
    // Stop any active stream
    eventSourceRef.current?.close();
    setStreaming(false);

    setSelected(dep);
    setActiveTab("build");
    setBuildLogs([]);
    setRuntimeLogs([]);
    setLogsLoading(true);

    try {
      const [{ logs: bLogs }, { logs: rLogs }] = await Promise.all([
        deploymentApi.getBuildLogs(dep.id),
        deploymentApi.getRuntimeLogs(dep.id),
      ]);
      setBuildLogs(bLogs);
      setRuntimeLogs(rLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  const startStream = () => {
    if (!selected || selected.status !== "running") return;
    eventSourceRef.current?.close();

    const es = deploymentApi.streamRuntimeLogs(selected.id);
    eventSourceRef.current = es;
    setStreaming(true);

    es.onmessage = (e) => {
      const { log, error } = JSON.parse(e.data);
      if (log)
        setRuntimeLogs((prev) => [
          ...prev,
          { log, created_at: new Date().toISOString() },
        ]);
      if (error || log === "--- stream closed ---") {
        setStreaming(false);
        es.close();
      }
    };
    es.onerror = () => {
      setStreaming(false);
      es.close();
    };
  };

  const stopStream = () => {
    eventSourceRef.current?.close();
    setStreaming(false);
  };

  const activeLogs = activeTab === "build" ? buildLogs : runtimeLogs;

  return (
    <ProtectedRoute>
      <div className="flex gap-6 h-[calc(100vh-64px-64px)]">
        {/* ── Left: deployment list ── */}
        <div className="w-[280px] flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display font-extrabold text-[20px] tracking-[-0.5px] text-white">
              Logs
            </h1>
            <span className="font-mono text-[11px] text-muted">
              {deployments.length} apps
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-muted font-mono text-[12px]">
              <div className="w-3 h-3 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
              Loading...
            </div>
          ) : deployments.length === 0 ? (
            <div className="bg-surface border border-white/[0.07] border-dashed rounded-xl p-6 text-center">
              <p className="font-mono text-[12px] text-muted mb-3">
                No deployments yet
              </p>
              <Link
                href="/dashboard/deployments/new"
                className="font-mono text-[11px] text-cyan hover:text-white transition-colors no-underline"
              >
                Deploy an app →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 overflow-y-auto">
              {deployments.map((d) => {
                const s = statusConfig[d.status] || statusConfig.stopped;
                const isSelected = selected?.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => selectDeployment(d)}
                    className={[
                      "flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer w-full",
                      isSelected
                        ? "bg-cyan/10 border-cyan/[0.15]"
                        : "bg-surface border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.03]",
                    ].join(" ")}
                  >
                    {/* Status dot */}
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot} ${d.status === "building" ? "animate-pulse" : ""}`}
                    />

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-display font-bold text-[13px] truncate ${isSelected ? "text-cyan" : "text-white"}`}
                      >
                        {d.project_name}
                      </div>
                      <div className={`font-mono text-[11px] ${s.text}`}>
                        {s.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right: log viewer ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center bg-surface border border-white/[0.07] rounded-xl">
              <div className="text-center">
                <div className="text-[40px] mb-3">📋</div>
                <p className="font-mono text-[13px] text-muted">
                  Select a deployment to view logs
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-surface border border-white/[0.07] rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="font-display font-bold text-[16px] text-white">
                      {selected.project_name}
                    </span>
                    <span className="font-mono text-[11px] text-muted ml-3">
                      {selected.container_name}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/deployments/${selected.id}`}
                  className="font-mono text-[11px] text-muted hover:text-white border border-white/[0.07] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all no-underline"
                >
                  View deployment →
                </Link>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between px-4 border-b border-white/[0.07] flex-shrink-0">
                <div className="flex">
                  {["build", "runtime"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={[
                        "font-mono text-[12px] tracking-wide px-4 py-3.5 border-b-2 transition-colors duration-200 bg-transparent cursor-pointer capitalize",
                        activeTab === tab
                          ? "border-cyan text-cyan"
                          : "border-transparent text-muted hover:text-white",
                      ].join(" ")}
                    >
                      {tab} logs
                      <span
                        className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                          activeTab === tab
                            ? "bg-cyan/10 text-cyan"
                            : "bg-white/[0.05] text-muted"
                        }`}
                      >
                        {tab === "build"
                          ? buildLogs.length
                          : runtimeLogs.length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Stream toggle */}
                {activeTab === "runtime" && selected.status === "running" && (
                  <button
                    onClick={streaming ? stopStream : startStream}
                    className={[
                      "flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer",
                      streaming
                        ? "text-gold border-gold/20 bg-gold/10"
                        : "text-muted border-white/[0.07] hover:text-white",
                    ].join(" ")}
                  >
                    <span className={streaming ? "animate-pulse" : ""}>●</span>
                    {streaming ? "Streaming..." : "Stream live"}
                  </button>
                )}
              </div>

              {/* Log body */}
              <div className="flex-1 overflow-y-auto p-5 font-mono text-[12px] leading-[1.8]">
                {logsLoading ? (
                  <div className="flex items-center gap-2 text-muted">
                    <div className="w-3 h-3 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
                    Loading logs...
                  </div>
                ) : activeLogs.length === 0 ? (
                  <div className="text-muted flex items-center gap-2">
                    {selected.status === "building" && activeTab === "build" ? (
                      <>
                        <span className="animate-spin inline-block">⟳</span>
                        Building... logs will appear here shortly.
                      </>
                    ) : (
                      `No ${activeTab} logs yet.`
                    )}
                  </div>
                ) : (
                  activeLogs.map((entry, i) => (
                    <div
                      key={i}
                      className="flex gap-3 hover:bg-white/[0.02] px-1 rounded group"
                    >
                      <span className="text-white/20 flex-shrink-0 select-none w-8 text-right">
                        {String(i + 1).padStart(3, "0")}
                      </span>
                      <pre className="text-white/80 whitespace-pre-wrap break-all flex-1">
                        {typeof entry === "string" ? entry : entry.log}
                      </pre>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
