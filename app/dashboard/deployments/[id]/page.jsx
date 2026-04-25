"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function DeploymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [deployment, setDeployment] = useState(null);
  const [buildLogs, setBuildLogs] = useState([]);
  const [runtimeLogs, setRuntimeLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("build");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoad, setActionLoad] = useState(false);
  const logsEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Auto scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [buildLogs, runtimeLogs]);

  // Fetch deployment + logs
  const fetchAll = async () => {
    try {
      const [{ deployment }, { logs: bLogs }, { logs: rLogs }] =
        await Promise.all([
          deploymentApi.getOne(id),
          deploymentApi.getBuildLogs(id),
          deploymentApi.getRuntimeLogs(id),
        ]);
      setDeployment(deployment);
      setBuildLogs(bLogs);
      setRuntimeLogs(rLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // Poll while building
    const interval = setInterval(async () => {
      const { deployment } = await deploymentApi
        .getOne(id)
        .catch(() => ({ deployment: null }));
      if (deployment) {
        setDeployment(deployment);
        if (deployment.status !== "building") clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // SSE stream
  const startStream = () => {
    if (eventSourceRef.current) eventSourceRef.current.close();
    const es = deploymentApi.streamRuntimeLogs(id);
    eventSourceRef.current = es;
    setStreaming(true);

    es.onmessage = (e) => {
      const { log, error } = JSON.parse(e.data);
      if (log)
        setRuntimeLogs((prev) => [
          ...prev,
          { log, created_at: new Date().toISOString() },
        ]);
      if (error) {
        setStreaming(false);
        es.close();
      }
      if (log === "--- stream closed ---") {
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

  useEffect(() => () => eventSourceRef.current?.close(), []);

  const handleRestart = async () => {
    setActionLoad(true);
    try {
      await deploymentApi.restart(id);
      await fetchAll();
    } catch (err) {
      alert(err?.error || "Failed to restart");
    } finally {
      setActionLoad(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this deployment?")) return;
    setActionLoad(true);
    try {
      await deploymentApi.delete(id);
      router.push("/dashboard/deployments");
    } catch (err) {
      alert(err?.error || "Failed to delete");
      setActionLoad(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center gap-3 text-muted font-mono text-[13px]">
          <div className="w-4 h-4 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
          Loading...
        </div>
      </ProtectedRoute>
    );
  }

  if (!deployment) {
    return (
      <ProtectedRoute>
        <div className="text-muted font-mono text-[13px]">
          Deployment not found.
        </div>
      </ProtectedRoute>
    );
  }

  const s = statusConfig[deployment.status] || statusConfig.stopped;
  const activeLogs = activeTab === "build" ? buildLogs : runtimeLogs;

  return (
    <ProtectedRoute>
      <div className="max-w-[900px]">
        {/* Back */}
        <Link
          href="/dashboard/deployments"
          className="font-mono text-[12px] text-muted hover:text-white transition-colors no-underline flex items-center gap-1.5 mb-6"
        >
          ← Back to deployments
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted mb-1">
              DEPLOYMENT
            </p>
            <h1 className="font-display font-extrabold text-[28px] tracking-[-1px] text-white mb-2">
              {deployment.project_name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${s.dot} ${deployment.status === "building" ? "animate-pulse" : ""}`}
                />
                <span className={`font-mono text-[13px] ${s.text}`}>
                  {s.label}
                </span>
              </div>
              {/* Port */}
              {deployment.port && (
                <span className="font-mono text-[12px] text-muted bg-white/[0.04] border border-white/[0.07] px-2.5 py-0.5 rounded-full">
                  :{deployment.port}
                </span>
              )}
              {/* Deploy time */}
              {deployment.deploy_duration_ms && (
                <span className="font-mono text-[12px] text-muted">
                  Built in {(deployment.deploy_duration_ms / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {deployment.status === "running" && (
              <button
                onClick={handleRestart}
                disabled={actionLoad}
                className="font-mono text-[12px] text-muted border border-white/[0.07] hover:text-white hover:border-white/20 bg-transparent px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-40"
              >
                Restart
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={actionLoad}
              className="font-mono text-[12px] text-red-400 border border-red-500/20 hover:bg-red-500/10 bg-transparent px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-40"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Error message */}
        {deployment.status === "failed" && deployment.error_message && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[12px] px-4 py-3 rounded-lg mb-6">
            <div className="font-bold mb-1">Build failed:</div>
            <pre className="whitespace-pre-wrap text-[11px]">
              {deployment.error_message}
            </pre>
          </div>
        )}

        {/* Info row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Container", value: deployment.container_name },
            {
              label: "Created",
              value: new Date(deployment.created_at).toLocaleString(),
            },
            {
              label: "Updated",
              value: new Date(deployment.updated_at).toLocaleString(),
            },
            {
              label: "Duration",
              value: deployment.deploy_duration_ms
                ? `${(deployment.deploy_duration_ms / 1000).toFixed(1)}s`
                : "—",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface border border-white/[0.07] rounded-lg p-3"
            >
              <div className="font-mono text-[10px] tracking-[0.06em] uppercase text-muted mb-1">
                {item.label}
              </div>
              <div className="font-mono text-[12px] text-white truncate">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Log tabs */}
        <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between px-4 border-b border-white/[0.07]">
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
                    className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-cyan/10 text-cyan" : "bg-white/[0.05] text-muted"}`}
                  >
                    {tab === "build" ? buildLogs.length : runtimeLogs.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Stream toggle (runtime tab only) */}
            {activeTab === "runtime" && deployment.status === "running" && (
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
          <div className="h-[420px] overflow-y-auto p-5 font-mono text-[12px] leading-[1.8]">
            {activeLogs.length === 0 ? (
              <div className="text-muted flex items-center gap-2">
                {deployment.status === "building" && activeTab === "build" ? (
                  <>
                    <span className="animate-spin inline-block">⟳</span>
                    Building... logs will appear here shortly.
                  </>
                ) : (
                  "No logs yet."
                )}
              </div>
            ) : (
              activeLogs.map((entry, i) => (
                <div
                  key={i}
                  className="flex gap-3 hover:bg-white/[0.02] px-1 rounded"
                >
                  <span className="text-white/20 flex-shrink-0 select-none">
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
      </div>
    </ProtectedRoute>
  );
}
