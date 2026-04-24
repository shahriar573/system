"use client";
import Link from "next/link";

export default function CtaBanner() {
  return (
    <div className="reveal mx-12 mb-20">
      <div className="relative bg-surface border border-white/[0.07] rounded-3xl px-16 py-20 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(0,229,255,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Grid lines */}
        <div className="absolute inset-0 hero-grid-bg opacity-40 pointer-events-none" />

        <h2
          className="relative font-display font-extrabold tracking-[-2px] leading-[1.05] text-white mb-4"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
        >
          Ready to deploy?
        </h2>
        <p className="relative text-[17px] text-muted mb-9">
          Join thousands of developers shipping faster with CloudLight.
        </p>

        <div className="relative flex justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="font-mono font-bold text-sm tracking-widest bg-cyan text-bg px-8 py-3.5 rounded-lg hover:bg-[#33eeff] hover:shadow-[0_0_28px_rgba(0,229,255,0.4)] hover:-translate-y-px transition-all duration-200 no-underline"
          >
            Start for free →
          </Link>
          <Link
            href="/login"
            className="font-mono text-sm tracking-widest text-muted border border-white/[0.07] hover:text-white hover:border-white/20 px-8 py-3.5 rounded-lg transition-all duration-200 no-underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
