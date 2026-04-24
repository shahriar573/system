"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-[68px] border-b border-white/[0.07] backdrop-blur-xl bg-[#040608]/80">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 font-display text-[22px] font-extrabold tracking-tight text-white no-underline"
      >
        <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_#00e5ff] animate-pulse2" />
        CloudLight
      </Link>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-9 list-none">
        {[
          { label: "Features", href: "#features" },
          { label: "How it works", href: "#how" },
          { label: "Pricing", href: "#pricing" },
          { label: "Customers", href: "#testimonials" },
        ].map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="font-mono text-[13px] tracking-wide text-muted hover:text-white transition-colors duration-200 no-underline"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="font-mono text-[13px] tracking-widest text-muted border border-white/[0.07] hover:text-white hover:border-white/20 transition-all duration-200 px-5 py-2.5 rounded no-underline"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="font-mono text-[13px] font-bold tracking-widest bg-cyan text-bg px-5 py-2.5 rounded hover:bg-[#33eeff] hover:shadow-[0_0_24px_rgba(0,229,255,0.4)] hover:-translate-y-px transition-all duration-200 no-underline"
        >
          Get started →
        </Link>
      </div>
    </nav>
  );
}
