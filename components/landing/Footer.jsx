"use client";
import Link from "next/link";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Status", href: "/status" },
  { label: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5 font-display text-[18px] font-extrabold text-white">
        <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_#00e5ff] animate-pulse2" />
        CloudLight
      </div>

      {/* Links */}
      <ul className="flex flex-wrap justify-center gap-8 list-none">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="font-mono text-[12px] tracking-wide text-muted hover:text-white transition-colors duration-200 no-underline"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Copy */}
      <p className="font-mono text-[12px] text-muted">
        © {new Date().getFullYear()} CloudLight. All rights reserved.
      </p>
    </footer>
  );
}
