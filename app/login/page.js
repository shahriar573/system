"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12 bg-bg2">
        <div className="hero-grid-bg absolute inset-0 pointer-events-none" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,229,255,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="relative flex items-center gap-2.5 font-display text-[20px] font-extrabold text-white no-underline w-fit"
        >
          <span
            className="w-2 h-2 rounded-full bg-cyan animate-pulse2"
            style={{ boxShadow: "0 0 10px #00e5ff" }}
          />
          CloudLight
        </Link>

        {/* Center */}
        <div className="relative">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-cyan mb-5">
            // WELCOME BACK
          </p>
          <h2
            className="font-display font-extrabold text-white leading-[1.0] tracking-[-2px] mb-6"
            style={{ fontSize: "clamp(40px, 4vw, 58px)" }}
          >
            Your apps are
            <br />
            <span className="text-gradient-cyan">waiting for you.</span>
          </h2>
          <p className="text-[16px] text-muted leading-[1.7] max-w-[380px]">
            Log back in to manage deployments, stream logs, and keep shipping at
            the speed of thought.
          </p>
          <div className="flex items-center gap-8 mt-10">
            {[
              { num: "60s", label: "Avg deploy" },
              { num: "99.9%", label: "Uptime" },
              { num: "2k+", label: "Apps live" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-8">
                <div>
                  <div className="font-display font-extrabold text-[24px] text-white">
                    {s.num}
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.06em] text-muted">
                    {s.label}
                  </div>
                </div>
                {i < 2 && <div className="w-px h-8 bg-white/[0.07]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className="relative bg-surface border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.07]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="font-mono text-[11px] text-muted ml-2">
              last session
            </span>
          </div>
          <div className="px-5 py-4 font-mono text-[12px] leading-[1.9]">
            <div className="flex gap-2">
              <span className="text-cyan">$</span>
              <span className="text-white">cloudlight status</span>
            </div>
            <div className="text-[#4a9f6e] pl-5">
              ✓ my-api running → port 5201
            </div>
            <div className="text-[#4a9f6e] pl-5">
              ✓ dashboard-ui running → port 5344
            </div>
            <div className="text-muted    pl-5"> worker-jobs stopped</div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="noise-overlay absolute inset-0 pointer-events-none opacity-60" />

        {/* Mobile logo */}
        <Link
          href="/"
          className="lg:hidden flex items-center gap-2 font-display text-[20px] font-extrabold text-white no-underline mb-10"
        >
          <span
            className="w-2 h-2 rounded-full bg-cyan"
            style={{ boxShadow: "0 0 10px #00e5ff" }}
          />
          CloudLight
        </Link>

        <div className="relative w-full max-w-[400px]">
          <h1 className="font-display font-extrabold text-[32px] tracking-[-1px] text-white mb-1">
            Sign in
          </h1>
          <p className="text-[14px] text-muted mb-8">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-cyan hover:text-white transition-colors duration-200 no-underline"
            >
              Create one free
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[12px] px-4 py-3 rounded-lg mb-6">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-surface border border-white/[0.07] focus:border-cyan/50 focus:outline-none text-white placeholder-muted font-body text-[14px] px-4 py-3 rounded-lg transition-colors duration-200"
                style={{ caretColor: "#00e5ff" }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="font-mono text-[11px] text-muted hover:text-cyan transition-colors duration-200 no-underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-surface border border-white/[0.07] focus:border-cyan/50 focus:outline-none text-white placeholder-muted font-body text-[14px] px-4 py-3 pr-12 rounded-lg transition-colors duration-200"
                  style={{ caretColor: "#00e5ff" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors duration-200 text-[16px] bg-transparent border-none cursor-pointer"
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 font-mono font-bold text-[13px] tracking-widest bg-cyan text-bg py-3.5 rounded-lg transition-all duration-200 border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#33eeff]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin inline-block" />
                  Signing in...
                </span>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="font-mono text-[11px] text-muted tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: "🐙", label: "Continue with GitHub" },
              { icon: "🔵", label: "Continue with Google" },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-surface border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04] text-white font-mono text-[13px] tracking-wide py-3 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <span className="text-[16px]">{o.icon}</span>
                {o.label}
              </button>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-muted mt-8 leading-[1.7]">
            By signing in you agree to our{" "}
            <a
              href="#"
              className="text-muted hover:text-white transition-colors underline underline-offset-2"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-muted hover:text-white transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
