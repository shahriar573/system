"use client";

const steps = [
  {
    n: "01",
    title: "Upload your app",
    desc: "Zip your Node.js project and upload through the dashboard or API. We handle the rest.",
  },
  {
    n: "02",
    title: "We build & containerize",
    desc: "CloudLight builds a Docker image, installs dependencies, and runs your build script automatically.",
  },
  {
    n: "03",
    title: "Get a live URL",
    desc: "Your app runs in an isolated container. Share the URL, stream logs, restart anytime.",
  },
];

const pipelineSteps = [
  { status: "done", icon: "✓", label: "Archive uploaded" },
  { status: "done", icon: "✓", label: "Files extracted" },
  { status: "active", icon: "⟳", label: "Building Docker image..." },
  { status: "pending", icon: "○", label: "Starting container" },
  { status: "pending", icon: "○", label: "Health check" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="max-w-[1200px] mx-auto px-12 py-28">
      {/* Header */}
      <div className="reveal mb-16">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-cyan mb-4">
          // HOW IT WORKS
        </p>
        <h2
          className="font-display font-extrabold tracking-[-1.5px] leading-[1.05] text-white"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
        >
          Three steps to
          <br />
          production.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Steps */}
        <div className="reveal flex flex-col">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex gap-5 py-6 border-b border-white/[0.07] last:border-b-0 group"
            >
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-mono text-[12px] text-cyan bg-cyan/10 border border-cyan/[0.15] rounded-lg mt-0.5">
                {s.n}
              </div>
              <div>
                <h3 className="font-display font-bold text-[18px] text-white mb-1.5">
                  {s.title}
                </h3>
                <p className="text-[14px] text-muted leading-[1.6]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline visual */}
        <div className="reveal relative bg-surface border border-white/[0.07] rounded-2xl p-9 overflow-hidden">
          {/* Corner glow */}
          <div className="absolute -bottom-14 -right-14 w-48 h-48 bg-[radial-gradient(circle,rgba(0,229,255,0.08),transparent_70%)] pointer-events-none" />

          <p className="font-mono text-[11px] tracking-[0.08em] text-muted mb-5 uppercase">
            Deployment Pipeline
          </p>

          {pipelineSteps.map((s) => (
            <div
              key={s.label}
              className={[
                "flex items-center gap-3 px-4 py-3.5 rounded-lg mb-2 font-mono text-[13px] transition-all duration-300",
                s.status === "active"
                  ? "bg-cyan/10 border border-cyan/[0.15] text-cyan"
                  : s.status === "done"
                    ? "text-[#4a9f6e]"
                    : "text-muted",
              ].join(" ")}
            >
              <span
                className={
                  s.status === "active" ? "animate-spin inline-block" : ""
                }
              >
                {s.icon}
              </span>
              {s.label}
            </div>
          ))}

          {/* Progress bar */}
          <div className="h-1 bg-white/[0.07] rounded-full mt-5 mb-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan to-[#0088ff] rounded-full animate-fillBar" />
          </div>

          <p className="font-mono text-[12px] text-cyan">Building... 68%</p>
        </div>
      </div>
    </section>
  );
}
