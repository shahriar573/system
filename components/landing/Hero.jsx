"use client";
import Link from "next/link";

const terminalLines = [
  { type: "cmd", content: "cloudlight deploy ./my-app.zip" },
  { type: "out", content: "✓ Uploading archive... done" },
  { type: "out", content: "✓ Extracting files... done" },
  { type: "out", content: "✓ Building Docker image... done" },
  { type: "out", content: "✓ Starting container on port 5342" },
  { type: "url", content: "🚀 Live → https://my-app.cloudlight.dev" },
];

const stats = [
  { num: "60s", label: "AVG DEPLOY TIME" },
  { num: "99.9%", label: "UPTIME SLA" },
  { num: "2k+", label: "APPS RUNNING" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-20 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid-bg pointer-events-none" />

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[800px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(0,229,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Badge */}
      <div className="animate-fadeUp flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-cyan bg-cyan/10 border border-cyan/20 px-4 py-1.5 rounded-full mb-7">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse2" />
        NOW IN PUBLIC BETA
      </div>

      {/* Title */}
      <h1
        className="font-display font-extrabold leading-[0.95] tracking-[-3px] mb-6"
        style={{ fontSize: "clamp(52px, 8vw, 96px)", animationDelay: "0.1s" }}
      >
        <span className="animate-fadeUp block text-white">
          Deploy anything.
        </span>
        <span
          className="animate-fadeUp block text-gradient-cyan"
          style={{ animationDelay: "0.15s" }}
        >
          In seconds.
        </span>
      </h1>

      {/* Sub */}
      <p
        className="animate-fadeUp text-[18px] text-muted max-w-[520px] leading-[1.7] mb-10"
        style={{ animationDelay: "0.2s" }}
      >
        CloudLight turns your Node.js app into a{" "}
        <span className="text-white">live URL</span> — no DevOps, no config
        files, no waiting. Just zip, upload, done.
      </p>

      {/* CTAs */}
      <div
        className="animate-fadeUp flex items-center gap-4 mb-16"
        style={{ animationDelay: "0.3s" }}
      >
        <Link
          href="/register"
          className="font-mono font-bold text-sm tracking-widest bg-cyan text-bg px-8 py-3.5 rounded-md hover:bg-[#33eeff] hover:shadow-[0_0_28px_rgba(0,229,255,0.4)] hover:-translate-y-px transition-all duration-200 no-underline"
        >
          Start for free →
        </Link>
        <a
          href="#how"
          className="font-mono text-sm tracking-widest text-muted border border-white/[0.07] hover:text-white hover:border-white/20 px-8 py-3.5 rounded-md transition-all duration-200 no-underline"
        >
          See how it works
        </a>
      </div>

      {/* Stats */}
      <div
        className="animate-fadeUp flex items-center gap-12 mb-16"
        style={{ animationDelay: "0.4s" }}
      >
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-12">
            <div className="text-center">
              <div className="font-display text-[28px] font-extrabold text-white">
                {s.num}
              </div>
              <div className="font-mono text-[11px] tracking-[0.06em] text-muted mt-0.5">
                {s.label}
              </div>
            </div>
            {i < stats.length - 1 && (
              <div className="w-px h-10 bg-white/[0.07]" />
            )}
          </div>
        ))}
      </div>

      {/* Terminal */}
      <div
        className="animate-fadeUp w-full max-w-[680px]"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)]">
          {/* Terminal bar */}
          <div className="flex items-center gap-2 px-4 py-3.5 bg-white/[0.03] border-b border-white/[0.07]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="font-mono text-[12px] text-muted ml-2">
              cloudlight — deploy
            </span>
          </div>

          {/* Terminal body */}
          <div className="px-6 py-5 font-mono text-[13px] leading-[1.9] text-left">
            {terminalLines.map((line, i) => (
              <div key={i} className="flex gap-2.5">
                {line.type === "cmd" && (
                  <>
                    <span className="text-cyan">$</span>
                    <span className="text-white"> {line.content}</span>
                  </>
                )}
                {line.type === "out" && (
                  <span className="text-[#4a9f6e] pl-5">{line.content}</span>
                )}
                {line.type === "url" && (
                  <span className="text-cyan pl-5 mt-1">{line.content}</span>
                )}
              </div>
            ))}
            <div className="flex gap-2.5 mt-2">
              <span className="text-cyan">$</span>
              <span className="inline-block w-2 h-[14px] bg-cyan animate-blink align-text-bottom" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
