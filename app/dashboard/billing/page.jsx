"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import billingApi from "@/lib/api/billingApi";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";

const statusStyles = {
  completed: {
    text: "text-[#4a9f6e]",
    bg: "bg-[#4a9f6e]/10 border-[#4a9f6e]/20",
    label: "Paid",
  },
  pending: {
    text: "text-gold",
    bg: "bg-gold/10 border-gold/20",
    label: "Pending",
  },
  failed: {
    text: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    label: "Failed",
  },
  refunded: {
    text: "text-muted",
    bg: "bg-white/[0.04] border-white/[0.07]",
    label: "Refunded",
  },
};

// FIX #7 — useSearchParams must be inside a Suspense boundary
function BillingPage() {
  const { refresh } = useAuthStore();
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null); // plan name being upgraded to
  const [banner, setBanner] = useState("");

  // Handle Stripe redirect back
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setBanner("success");
      refresh(); // re-fetch user so plan updates in sidebar/store
    }
    if (searchParams.get("cancelled") === "true") {
      setBanner("cancelled");
    }
  }, []);

  useEffect(() => {
    billingApi
      .getBillingInfo()
      .then(setBilling)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planName) => {
    setUpgrading(planName);
    try {
      const { url } = await billingApi.createCheckoutSession(planName);
      window.location.href = url; // redirect to Stripe checkout
    } catch (err) {
      alert(err?.error || "Failed to start checkout");
      setUpgrading(null);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center gap-3 text-muted font-mono text-[13px]">
          <div className="w-4 h-4 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
          Loading billing...
        </div>
      </ProtectedRoute>
    );
  }

  const { currentPlan, payments, plans } = billing;

  return (
    <ProtectedRoute>
      <div className="max-w-[900px]">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted mb-1">
            // BILLING
          </p>
          <h1 className="font-display font-extrabold text-[28px] tracking-[-1px] text-white">
            Plan & Billing
          </h1>
          <p className="font-body text-[14px] text-muted mt-1">
            Manage your plan and view payment history.
          </p>
        </div>

        {/* Success / cancelled banners */}
        {banner === "success" && (
          <div className="flex items-center gap-3 bg-[#4a9f6e]/10 border border-[#4a9f6e]/20 text-[#4a9f6e] font-mono text-[13px] px-5 py-3.5 rounded-xl mb-6">
            <span className="text-[18px]">🎉</span>
            Payment successful! Your plan has been upgraded.
          </div>
        )}
        {banner === "cancelled" && (
          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] text-muted font-mono text-[13px] px-5 py-3.5 rounded-xl mb-6">
            <span>ℹ</span>
            Checkout cancelled. Your plan was not changed.
          </div>
        )}

        {/* Current plan card */}
        <div
          className="bg-surface border border-cyan/[0.15] rounded-xl p-6 mb-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,229,255,0.04) 0%, #0d1117 60%)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted mb-1">
                Current plan
              </p>
              <h2 className="font-display font-extrabold text-[28px] tracking-[-1px] text-white">
                {currentPlan.plan_display_name}
              </h2>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-[36px] text-white tracking-tight">
                <sup className="text-[18px] font-semibold">$</sup>
                {currentPlan.price_cents / 100}
              </div>
              <div className="font-mono text-[12px] text-muted">per month</div>
            </div>
          </div>

          {/* Plan limits */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Deployments",
                value:
                  currentPlan.max_deployments === -1
                    ? "Unlimited"
                    : currentPlan.max_deployments,
              },
              { label: "CPU", value: `${currentPlan.cpu_limit} vCPU` },
              { label: "Memory", value: `${currentPlan.memory_limit_mb} MB` },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-bg border border-white/[0.07] rounded-lg p-3"
              >
                <div className="font-mono text-[10px] tracking-[0.06em] uppercase text-muted mb-1">
                  {s.label}
                </div>
                <div className="font-display font-bold text-[16px] text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All plans */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-[18px] text-white mb-4">
            Upgrade your plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlan.plan_id;
              const isUpgrading = upgrading === plan.name;
              return (
                <div
                  key={plan.id}
                  className={[
                    "relative border rounded-xl p-5 transition-all duration-300",
                    isCurrent
                      ? "border-cyan/30 bg-cyan/[0.04]"
                      : "border-white/[0.07] bg-surface hover:border-white/[0.15]",
                  ].join(" ")}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 left-4 font-mono text-[10px] text-bg bg-cyan px-3 py-0.5 rounded-full tracking-widest">
                      CURRENT
                    </div>
                  )}
                  <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted mb-2">
                    {plan.display_name}
                  </div>
                  <div className="font-display font-extrabold text-[28px] text-white tracking-tight mb-1">
                    <sup className="text-[14px] font-semibold">$</sup>
                    {plan.price_cents / 100}
                    <span className="text-[14px] font-normal text-muted">
                      /mo
                    </span>
                  </div>
                  <ul className="list-none mb-4 mt-3 space-y-1.5">
                    {[
                      plan.max_deployments === -1
                        ? "Unlimited deployments"
                        : `${plan.max_deployments} deployments`,
                      `${plan.cpu_limit} vCPU`,
                      `${plan.memory_limit_mb} MB RAM`,
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 font-body text-[13px] text-muted"
                      >
                        <span className="text-cyan text-[11px]">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => !isCurrent && handleUpgrade(plan.name)}
                    disabled={isCurrent || !!upgrading}
                    className={[
                      "w-full font-mono font-bold text-[12px] tracking-widest py-2.5 rounded-lg border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed",
                      isCurrent
                        ? "text-muted border-white/[0.07] bg-transparent opacity-50"
                        : "text-bg bg-cyan border-transparent hover:bg-[#33eeff] disabled:opacity-50",
                    ].join(" ")}
                  >
                    {isUpgrading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                        Redirecting...
                      </span>
                    ) : isCurrent ? (
                      "Current plan"
                    ) : (
                      `Upgrade to ${plan.display_name}`
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment history */}
        <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.07]">
            <h3 className="font-display font-bold text-[16px] text-white">
              Payment History
            </h3>
          </div>

          {payments.length === 0 ? (
            <div className="px-6 py-10 text-center font-mono text-[13px] text-muted">
              No payments yet.
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-white/[0.07]">
                {["Plan", "Amount", "Status", "Date"].map((h) => (
                  <span
                    key={h}
                    className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {payments.map((p, i) => {
                const s = statusStyles[p.status] || statusStyles.pending;
                return (
                  <div
                    key={p.id}
                    className={[
                      "grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4",
                      i < payments.length - 1
                        ? "border-b border-white/[0.04]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="font-body text-[14px] text-white">
                      {p.plan_name}
                    </div>
                    <div className="font-mono text-[14px] text-white">
                      ${(p.amount_cents / 100).toFixed(2)}
                    </div>
                    <div>
                      <span
                        className={`font-mono text-[11px] px-2.5 py-1 rounded-full border ${s.bg} ${s.text}`}
                      >
                        {s.label}
                      </span>
                    </div>
                    <div className="font-mono text-[12px] text-muted">
                      {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Suspense wrapper — required by Next.js App Router for useSearchParams
export default function BillingPageWrapper() {
  return (
    <Suspense fallback={null}>
      <BillingPage />
    </Suspense>
  );
}
