"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import deploymentApi from "@/lib/api/deploymentApi";
import ProtectedRoute from "@/components/ProtectedRoute";

const statusConfig = {
  queued: { dot: "bg-muted", text: "text-muted", label: "Queued" },
  building: { dot: "bg-gold", text: "text-gold", label: "Building" },
  running: { dot: "bg-[#4a9f6e]", text: "text-[#4a9f6e]", label: "Running" },
  stopped: { dot: "bg-muted", text: "text-muted", label: "Stopped" },
  failed: { dot: "bg-red-500", text: "text-red-400", label: "Failed" },
  deleted: { dot: "bg-muted", text: "text-muted", label: "Deleted" },
};

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  // FIX #10 — inline confirm state instead of browser confirm()
  const [confirmId, setConfirmId] = useState(null);

  const fetchDeployments = async () => {
    try {
      const { deployments } = await deploymentApi.getAll();
      setDeployments(deployments);
    } catch (err) {
      setError(err?.error || "Failed to load deployments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    setConfirmId(null);
    setActionId(id);
    try {
      await deploymentApi.delete(id);
      setDeployments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err?.error || "Failed to delete");
    } finally {
      setActionId(null);
    }
  };

  const handleRestart = async (id) => {
    setActionId(id);
    try {
      await deploymentApi.restart(id);
      await fetchDeployments();
    } catch (err) {
      setError(err?.error || "Failed to restart");
    } finally {
      setActionId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted mb-1">
              // DEPLOYMENTS
            </p>
            <h1 className="font-display font-extrabold text-[28px] tracking-[-1px] text-white">
              Your Deployments
            </h1>
          </div>
          <Link
            href="/dashboard/deployments/new"
            className="flex items-center gap-2 font-mono font-bold text-[12px] tracking-widest bg-cyan text-bg px-5 py-2.5 rounded-lg hover:bg-[#33eeff] transition-all duration-200 no-underline"
          >
            + New deployment
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[12px] px-4 py-3 rounded-lg mb-6">
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center gap-3 text-muted font-mono text-[13px]">
            <div className="w-4 h-4 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
            Loading deployments...
          </div>
        ) : deployments.length === 0 ? (
          // Empty state
          <div className="bg-surface border border-white/[0.07] border-dashed rounded-xl p-16 text-center">
            <div className="text-[40px] mb-4">🚀</div>
            <h3 className="font-display font-bold text-[18px] text-white mb-2">
              No deployments yet
            </h3>
            <p className="font-body text-[14px] text-muted mb-6">
              Upload a ZIP file to deploy your first Node.js app.
            </p>
            <Link
              href="/dashboard/deployments/new"
              className="inline-flex items-center gap-2 font-mono font-bold text-[12px] tracking-widest bg-cyan text-bg px-6 py-3 rounded-lg hover:bg-[#33eeff] transition-all duration-200 no-underline"
            >
              + Deploy your first app
            </Link>
          </div>
        ) : (
          // Table
          <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/[0.07]">
              {["App", "Status", "Port", "Deployed", ""].map((h) => (
                <span
                  key={h}
                  className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {deployments.map((d, i) => {
              const s = statusConfig[d.status] || statusConfig.stopped;
              const isActing = actionId === d.id;
              return (
                <div
                  key={d.id}
                  className={[
                    "grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors duration-150 group",
                    i < deployments.length - 1
                      ? "border-b border-white/[0.04]"
                      : "",
                  ].join(" ")}
                >
                  {/* Name */}
                  <div>
                    <Link
                      href={`/dashboard/deployments/${d.id}`}
                      className="font-display font-bold text-[14px] text-white hover:text-cyan transition-colors no-underline"
                    >
                      {d.project_name}
                    </Link>
                    <div className="font-mono text-[11px] text-muted mt-0.5">
                      {d.container_name}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot} ${d.status === "building" ? "animate-pulse" : ""}`}
                    />
                    <span className={`font-mono text-[12px] ${s.text}`}>
                      {s.label}
                    </span>
                  </div>

                  {/* Port */}
                  <div className="font-mono text-[13px] text-muted">
                    {d.port ? `:${d.port}` : "—"}
                  </div>

                  {/* Time */}
                  <div className="font-mono text-[12px] text-muted">
                    {new Date(d.created_at).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/dashboard/deployments/${d.id}`}
                      className="font-mono text-[11px] text-muted hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] px-2.5 py-1 rounded transition-all duration-150 no-underline"
                    >
                      Logs
                    </Link>
                    {d.status === "running" && (
                      <button
                        onClick={() => handleRestart(d.id)}
                        disabled={isActing}
                        className="font-mono text-[11px] text-muted hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] px-2.5 py-1 rounded transition-all duration-150 cursor-pointer disabled:opacity-40"
                      >
                        {isActing ? "..." : "Restart"}
                      </button>
                    )}
                    {/* FIX #10 — inline confirm instead of browser confirm() */}
                    {confirmId === d.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(d.id)}
                          disabled={isActing}
                          className="font-mono text-[11px] text-white bg-red-500 hover:bg-red-600 border border-red-500 px-2.5 py-1 rounded transition-all duration-150 cursor-pointer disabled:opacity-40"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="font-mono text-[11px] text-muted hover:text-white bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded transition-all duration-150 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(d.id)}
                        disabled={isActing}
                        className="font-mono text-[11px] text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2.5 py-1 rounded transition-all duration-150 cursor-pointer disabled:opacity-40"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
