"use client";
import Link from "next/link";

const plans = [
  {
    name: "BASIC",
    price: 5,
    deployments: "2 deployments",
    cpu: "0.5 vCPU",
    memory: "512 MB RAM",
    logs: true,
    support: false,
    domains: false,
    featured: false,
  },
  {
    name: "PRO",
    price: 15,
    deployments: "10 deployments",
    cpu: "2 vCPU",
    memory: "2 GB RAM",
    logs: true,
    support: true,
    domains: false,
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "PREMIUM",
    price: 30,
    deployments: "Unlimited deployments",
    cpu: "8 vCPU",
    memory: "16 GB RAM",
    logs: true,
    support: true,
    domains: true,
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-[1200px] mx-auto px-12 py-28">
      {/* Header */}
      <div className="reveal text-center mb-16">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-cyan mb-4">
          // PRICING
        </p>
        <h2
          className="font-display font-extrabold tracking-[-1.5px] leading-[1.05] text-white mb-5"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
        >
          Simple, honest pricing.
        </h2>
        <p className="text-[17px] text-muted max-w-[440px] mx-auto leading-[1.7]">
          Start free, scale when you're ready. No hidden fees, no surprise
          bills.
        </p>
      </div>

      {/* Cards */}
      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <PriceCard key={p.name} plan={p} />
        ))}
      </div>
    </section>
  );
}

function PriceCard({ plan }) {
  const featureList = [
    { label: plan.deployments, on: true },
    { label: plan.cpu, on: true },
    { label: plan.memory, on: true },
    { label: "Live log streaming", on: plan.logs },
    { label: "Priority support", on: plan.support },
    { label: "Custom domains", on: plan.domains },
  ];

  return (
    <div
      className={[
        "relative rounded-2xl p-9 border transition-all duration-300 hover:-translate-y-1",
        plan.featured
          ? "border-cyan bg-gradient-to-br from-cyan/[0.05] to-surface shadow-[0_0_40px_rgba(0,229,255,0.1)] hover:shadow-[0_20px_60px_rgba(0,229,255,0.2)]"
          : "border-white/[0.07] bg-surface hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
      ].join(" ")}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[11px] font-medium tracking-[0.06em] text-bg bg-cyan px-4 py-1 rounded-full whitespace-nowrap">
          {plan.badge}
        </div>
      )}

      {/* Plan name */}
      <p className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase mb-4">
        {plan.name}
      </p>

      {/* Price */}
      <div
        className="font-display font-extrabold tracking-[-2px] leading-none text-white mb-1"
        style={{ fontSize: "52px" }}
      >
        <sup className="text-[22px] font-semibold tracking-normal align-super">
          $
        </sup>
        {plan.price}
      </div>
      <p className="font-mono text-[13px] text-muted mb-7">per month</p>

      <div className="h-px bg-white/[0.07] mb-6" />

      {/* Features */}
      <ul className="list-none mb-8 space-y-0.5">
        {featureList.map((f) => (
          <li
            key={f.label}
            className={[
              "flex items-center gap-2.5 text-[14px] py-1.5",
              f.on ? "text-white" : "text-muted/40",
            ].join(" ")}
          >
            <span
              className={
                f.on ? "text-cyan text-[13px]" : "text-white/10 text-[13px]"
              }
            >
              {f.on ? "✓" : "✕"}
            </span>
            {f.label}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/register"
        className={[
          "block w-full text-center font-mono text-[13px] font-bold tracking-widest py-3.5 rounded-lg transition-all duration-200 no-underline",
          plan.featured
            ? "bg-cyan text-bg hover:bg-[#33eeff] hover:shadow-[0_0_24px_rgba(0,229,255,0.4)]"
            : "border border-cyan text-cyan hover:bg-cyan/10 hover:shadow-[0_0_16px_rgba(0,229,255,0.2)]",
        ].join(" ")}
      >
        Get started
      </Link>
    </div>
  );
}
