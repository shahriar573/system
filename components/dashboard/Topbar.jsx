"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// FIX #11 — dynamic breadcrumb from actual route
const buildBreadcrumb = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg.replace(/-/g, " "),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
};

export default function Topbar() {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-30 h-[64px] flex items-center justify-between px-8 bg-bg/80 backdrop-blur-xl border-b border-white/[0.07]">
      {/* Dynamic breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[13px]">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-white/[0.2]">/</span>}
            {crumb.isLast ? (
              <span className="text-white capitalize">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted hover:text-white transition-colors capitalize no-underline"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-surface border border-white/[0.07] hover:border-white/[0.15] px-3 py-2 rounded-lg transition-colors duration-200 cursor-text group">
          <span className="text-muted text-[14px]">⌕</span>
          <span className="font-mono text-[12px] text-muted group-hover:text-white/50 transition-colors">
            Search...
          </span>
          <kbd className="font-mono text-[10px] text-muted bg-white/[0.05] border border-white/[0.07] px-1.5 py-0.5 rounded ml-6">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center bg-surface border border-white/[0.07] hover:border-white/20 rounded-lg text-muted hover:text-white transition-all duration-200 cursor-pointer">
          <span className="text-[15px]">🔔</span>
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan"
            style={{ boxShadow: "0 0 6px #00e5ff" }}
          />
        </button>

        {/* New deployment CTA */}
        <Link
          href="/dashboard/deployments/new"
          className="flex items-center gap-2 font-mono font-bold text-[12px] tracking-widest bg-cyan text-bg px-4 py-2 rounded-lg hover:bg-[#33eeff] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-200 no-underline"
        >
          <span className="text-[14px]">+</span>
          Deploy
        </Link>
      </div>
    </header>
  );
}
