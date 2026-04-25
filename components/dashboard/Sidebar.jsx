"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

const nav = [
  { icon: "⬡", label: "Overview", href: "/dashboard" },
  { icon: "🚀", label: "Deployments", href: "/dashboard/deployments" },
  { icon: "📋", label: "Logs", href: "/dashboard/logs" },
  { icon: "💳", label: "Billing", href: "/dashboard/billing" },
  { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const path = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";

  const maxDep =
    user?.max_deployments === -1 ? "∞" : (user?.max_deployments ?? "—");
  const planName = user?.plan_name?.toUpperCase() ?? "—";

  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] bg-bg2 border-r border-white/[0.07] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-[64px] border-b border-white/[0.07]">
        <span
          className="w-2 h-2 rounded-full bg-cyan animate-pulse2 flex-shrink-0"
          style={{ boxShadow: "0 0 10px #00e5ff" }}
        />
        <span className="font-display font-extrabold text-[18px] text-white tracking-tight">
          CloudLight
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted px-3 mb-3">
          Navigation
        </p>
        {nav.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-[14px] transition-all duration-200 no-underline group",
                active
                  ? "bg-cyan/10 border border-cyan/[0.15] text-cyan"
                  : "text-muted hover:text-white hover:bg-white/[0.04] border border-transparent",
              ].join(" ")}
            >
              <span className="text-[16px] w-5 flex-shrink-0">{item.icon}</span>
              {item.label}
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan"
                  style={{ boxShadow: "0 0 6px #00e5ff" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Plan badge */}
      <div className="mx-3 mb-4 p-4 bg-surface border border-white/[0.07] rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted">
            Current plan
          </span>
          <span className="font-mono text-[10px] text-cyan bg-cyan/10 border border-cyan/[0.15] px-2 py-0.5 rounded-full">
            {planName}
          </span>
        </div>
        <div className="font-mono text-[12px] text-muted mb-3">
          Max {maxDep} deployments
        </div>
        <Link
          href="/dashboard/billing"
          className="block text-center font-mono text-[11px] text-cyan hover:text-white border border-cyan/[0.2] hover:border-white/20 py-2 rounded-lg transition-all duration-200 no-underline"
        >
          Upgrade plan
        </Link>
      </div>

      {/* User + logout */}
      <div className="px-3 pb-4 border-t border-white/[0.07] pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-blue-500 flex items-center justify-center font-display font-extrabold text-[13px] text-bg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-body text-[13px] text-white truncate">
              {user?.full_name || user?.email?.split("@")[0] || "User"}
            </div>
            <div className="font-mono text-[11px] text-muted truncate">
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-muted hover:text-red-400 transition-colors text-[14px] bg-transparent border-none cursor-pointer flex-shrink-0"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
