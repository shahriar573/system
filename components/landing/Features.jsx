"use client";

const features = [
  {
    icon: "⚡",
    name: "Instant Deployments",
    desc: "Push a ZIP, get a live URL in under 60 seconds. Zero config, zero DevOps headaches.",
    tag: "< 60s deploy",
  },
  {
    icon: "🐳",
    name: "Docker Native",
    desc: "Every app runs in an isolated container with CPU and memory limits enforced per plan.",
    tag: "Fully isolated",
  },
  {
    icon: "📊",
    name: "Live Log Streaming",
    desc: "Watch build and runtime logs stream in real-time. Debug issues the moment they happen.",
    tag: "SSE streaming",
  },
  {
    icon: "🔒",
    name: "Secure by Default",
    desc: "JWT auth, HttpOnly cookies, per-user resource isolation. Security baked in, not bolted on.",
    tag: "Zero trust",
  },
  {
    icon: "📦",
    name: "Plan-gated Resources",
    desc: "CPU, memory, and deployment count enforced at the infrastructure level per plan.",
    tag: "Hard limits",
  },
  {
    icon: "💳",
    name: "Stripe Billing",
    desc: "Upgrade, downgrade, or cancel instantly. Webhooks keep your plan in sync automatically.",
    tag: "Instant sync",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative max-w-[1200px] mx-auto px-12 py-28"
    >
      {/* Header */}
      <div className="reveal mb-16">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-cyan mb-4">
          // PLATFORM FEATURES
        </p>
        <h2
          className="font-display font-extrabold tracking-[-1.5px] leading-[1.05] text-white mb-5"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
        >
          Everything you need.
          <br />
          Nothing you don't.
        </h2>
        <p className="text-[17px] text-muted max-w-[480px] leading-[1.7]">
          Built for developers who want to ship fast without managing
          infrastructure.
        </p>
      </div>

      {/* Grid */}
      <div
        className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-white/[0.07] rounded-2xl overflow-hidden divide-white/[0.07]"
        style={{ gap: "1px", background: "rgba(255,255,255,0.07)" }}
      >
        {features.map((f) => (
          <FeatureCard key={f.name} {...f} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon, name, desc, tag }) {
  return (
    <div className="group relative bg-bg hover:bg-surface transition-colors duration-300 p-10 overflow-hidden">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,229,255,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

      {/* Icon */}
      <div className="w-11 h-11 flex items-center justify-center text-xl bg-cyan/10 border border-cyan/[0.15] rounded-xl mb-5">
        {icon}
      </div>

      <h3 className="font-display font-bold text-[18px] text-white mb-2.5">
        {name}
      </h3>
      <p className="text-[14px] text-muted leading-[1.7] mb-4">{desc}</p>

      <span className="inline-block font-mono text-[11px] tracking-[0.04em] text-cyan bg-cyan/10 border border-cyan/[0.15] px-3 py-1 rounded-full">
        {tag}
      </span>
    </div>
  );
}
