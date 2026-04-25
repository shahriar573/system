"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import deploymentApi from "@/lib/api/deploymentApi";
import billingApi from "@/lib/api/billingApi";
import ProtectedRoute from "@/components/ProtectedRoute";

// ── Status config ─────────────────────────────────────────────────────────
const statusConfig = {
  queued: { dot: "bg-muted", text: "text-muted", label: "Queued" },
  building: { dot: "bg-gold", text: "text-gold", label: "Building" },
  running: { dot: "bg-[#4a9f6e]", text: "text-[#4a9f6e]", label: "Running" },
  stopped: { dot: "bg-muted", text: "text-muted", label: "Stopped" },
  failed: { dot: "bg-red-500", text: "text-red-400", label: "Failed" },
};

// ── Greeting ──────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

// ── Time ago helper ───────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [deployments, setDeployments] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([deploymentApi.getAll(), billingApi.getBillingInfo()])
      .then(([{ deployments }, billingData]) => {
        setDeployments(deployments);
        setBilling(billingData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // FIX #8 — only poll deployments (billing never changes on its own)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { deployments } = await deploymentApi.getAll();
        setDeployments(deployments);
      } catch (_) {}
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Derived stats ────────────────────────────────────────────────────────
  const running = deployments.filter((d) => d.status === "running").length;
  const failed = deployments.filter((d) => d.status === "failed").length;
  const avgMs = deployments
    .filter((d) => d.deploy_duration_ms)
    .reduce((acc, d, _, arr) => acc + d.deploy_duration_ms / arr.length, 0);

  const stats = [
    {
      label: "Total Deployments",
      value: deployments.length,
      sub: billing
        ? `of ${billing.currentPlan.max_deployments === -1 ? "∞" : billing.currentPlan.max_deployments} on ${billing.currentPlan.plan_display_name}`
        : "—",
      icon: "🚀",
      accent: "cyan",
      trend: deployments.length > 0 ? `${running} running` : "None yet",
    },
    {
      label: "Running Apps",
      value: running,
      sub: `${failed} failed`,
      icon: "✦",
      accent: "green",
      trend: running > 0 ? "All healthy" : "None running",
    },
    {
      label: "Avg Deploy Time",
      value: avgMs > 0 ? `${(avgMs / 1000).toFixed(0)}s` : "—",
      sub: "last 7 days",
      icon: "⚡",
      accent: "cyan",
      trend: avgMs > 0 ? "From build logs" : "No data yet",
    },
    {
      label: "This Month",
      value: billing ? `$${billing.currentPlan.price_cents / 100}` : "—",
      sub: billing ? `${billing.currentPlan.plan_display_name} plan` : "—",
      icon: "💳",
      accent: "gold",
      trend: "No overages",
    },
  ];

  // ── Activity feed from deployments + payments ────────────────────────────
  const activity = [
    ...deployments.slice(0, 5).map((d) => ({
      icon: d.status === "running" ? "✓" : d.status === "failed" ? "✕" : "⟳",
      color:
        d.status === "running"
          ? "text-[#4a9f6e]"
          : d.status === "failed"
            ? "text-red-400"
            : "text-gold",
      text: `${d.project_name} — ${d.status}`,
      time: timeAgo(d.updated_at),
      ts: new Date(d.updated_at).getTime(),
    })),
    ...(billing?.payments || []).slice(0, 3).map((p) => ({
      icon: "💳",
      color: "text-gold",
      text: `Payment ${p.status} — ${p.plan_name} plan ($${(p.amount_cents / 100).toFixed(2)})`,
      time: timeAgo(p.created_at),
      ts: new Date(p.created_at).getTime(),
    })),
  ]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 8);

  const accentMap = {
    cyan: { text: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/[0.15]" },
    green: {
      text: "text-[#4a9f6e]",
      bg: "bg-[#4a9f6e]/10",
      border: "border-[#4a9f6e]/20",
    },
    gold: { text: "text-gold", bg: "bg-gold/10", border: "border-gold/20" },
  };

  const firstName =
    user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <ProtectedRoute>
      <div className="max-w-[1200px]">
        {/* Heading */}
        <div className="mb-8">
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted mb-1">
            // OVERVIEW
          </p>
          <h1 className="font-display font-extrabold text-[28px] tracking-[-1px] text-white">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="font-body text-[14px] text-muted mt-1">
            Here's what's happening with your apps today.
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-surface border border-white/[0.07] rounded-xl p-5 animate-pulse h-[120px]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => {
              const a = accentMap[s.accent];
              return (
                <div
                  key={s.label}
                  className="bg-surface border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300 group relative overflow-hidden"
                >
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${s.accent === "cyan" ? "rgba(0,229,255,0.08)" : s.accent === "green" ? "rgba(74,159,110,0.08)" : "rgba(255,208,96,0.08)"}, transparent 70%)`,
                    }}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-[16px] ${a.bg} border ${a.border}`}
                    >
                      {s.icon}
                    </div>
                    <span
                      className={`font-mono text-[11px] ${a.text} ${a.bg} border ${a.border} px-2 py-0.5 rounded-full`}
                    >
                      {s.trend}
                    </span>
                  </div>
                  <div className="font-display font-extrabold text-[32px] tracking-[-1px] text-white leading-none mb-1">
                    {s.value}
                  </div>
                  <div className="font-body text-[13px] text-white mb-0.5">
                    {s.label}
                  </div>
                  <div className="font-mono text-[11px] text-muted">
                    {s.sub}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Deployments table */}
        <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-[16px] text-white">
                Deployments
              </span>
              <span className="font-mono text-[11px] text-cyan bg-cyan/10 border border-cyan/[0.15] px-2 py-0.5 rounded-full">
                {deployments.length}
              </span>
            </div>
            <Link
              href="/dashboard/deployments"
              className="font-mono text-[12px] text-muted hover:text-white transition-colors no-underline"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="px-6 py-8 flex items-center gap-3 text-muted font-mono text-[13px]">
              <div className="w-4 h-4 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
              Loading...
            </div>
          ) : deployments.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="font-mono text-[13px] text-muted mb-4">
                No deployments yet.
              </p>
              <Link
                href="/dashboard/deployments/new"
                className="font-mono font-bold text-[12px] tracking-widest bg-cyan text-bg px-5 py-2.5 rounded-lg hover:bg-[#33eeff] transition-all duration-200 no-underline"
              >
                + Deploy your first app
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-white/[0.07]">
                {["App", "Status", "Port", "Deployed"].map((h) => (
                  <span
                    key={h}
                    className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {deployments.slice(0, 5).map((d, i) => {
                const s = statusConfig[d.status] || statusConfig.stopped;
                return (
                  <div
                    key={d.id}
                    className={[
                      "grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors",
                      i < Math.min(deployments.length, 5) - 1
                        ? "border-b border-white/[0.04]"
                        : "",
                    ].join(" ")}
                  >
                    <Link
                      href={`/dashboard/deployments/${d.id}`}
                      className="font-display font-bold text-[14px] text-white hover:text-cyan transition-colors no-underline"
                    >
                      {d.project_name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${s.dot} ${d.status === "building" ? "animate-pulse" : ""}`}
                      />
                      <span className={`font-mono text-[12px] ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                    <div className="font-mono text-[13px] text-muted">
                      {d.port ? `:${d.port}` : "—"}
                    </div>
                    <div className="font-mono text-[12px] text-muted">
                      {timeAgo(d.created_at)}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          {/* Activity feed */}
          <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
              <span className="font-display font-bold text-[16px] text-white">
                Activity
              </span>
              <span className="font-mono text-[11px] text-muted">
                Recent events
              </span>
            </div>
            <div className="px-6 py-2">
              {activity.length === 0 ? (
                <p className="font-mono text-[13px] text-muted py-6 text-center">
                  No activity yet.
                </p>
              ) : (
                activity.map((a, i) => (
                  <div
                    key={i}
                    className={[
                      "flex items-start gap-3 py-3.5",
                      i < activity.length - 1
                        ? "border-b border-white/[0.04]"
                        : "",
                    ].join(" ")}
                  >
                    <span
                      className={`text-[14px] flex-shrink-0 mt-0.5 ${a.color}`}
                    >
                      {a.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[13px] text-white/80 leading-[1.5] truncate">
                        {a.text}
                      </p>
                      <span className="font-mono text-[11px] text-muted">
                        {a.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Plan & billing */}
          <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
              <span className="font-display font-bold text-[16px] text-white">
                Plan & Billing
              </span>
              <Link
                href="/dashboard/billing"
                className="font-mono text-[12px] text-muted hover:text-white transition-colors no-underline"
              >
                Manage →
              </Link>
            </div>
            <div className="px-6 py-5">
              {billing ? (
                <>
                  <div className="flex items-center justify-between mb-5 p-4 bg-cyan/[0.04] border border-cyan/[0.12] rounded-xl">
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted mb-1">
                        Active plan
                      </div>
                      <div className="font-display font-extrabold text-[20px] text-white">
                        {billing.currentPlan.plan_display_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-extrabold text-[26px] text-white">
                        <sup className="text-[13px]">$</sup>
                        {billing.currentPlan.price_cents / 100}
                      </div>
                      <div className="font-mono text-[11px] text-muted">
                        per month
                      </div>
                    </div>
                  </div>

                  {/* Usage bars */}
                  {[
                    {
                      label: "Deployments",
                      used: deployments.filter(
                        (d) =>
                          !["stopped", "failed", "deleted"].includes(d.status),
                      ).length,
                      total: billing.currentPlan.max_deployments,
                    },
                  ].map((f) => {
                    const unlimited = f.total === -1;
                    const pct = unlimited
                      ? 0
                      : Math.round((f.used / f.total) * 100);
                    const warn = !unlimited && pct > 75;
                    return (
                      <div key={f.label} className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-body text-[13px] text-muted">
                            {f.label}
                          </span>
                          <span
                            className={`font-mono text-[12px] ${warn ? "text-gold" : "text-white"}`}
                          >
                            {f.used} / {unlimited ? "∞" : f.total}
                          </span>
                        </div>
                        {!unlimited && (
                          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${warn ? "bg-gradient-to-r from-gold to-orange-500" : "bg-gradient-to-r from-cyan to-blue-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <Link
                    href="/dashboard/billing"
                    className="flex items-center justify-center w-full font-mono font-bold text-[12px] tracking-widest text-bg bg-cyan py-3 rounded-lg hover:bg-[#33eeff] transition-all duration-200 no-underline"
                  >
                    Upgrade plan ↑
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3 text-muted font-mono text-[13px] py-4">
                  <div className="w-4 h-4 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
