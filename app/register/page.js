"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/authStore";

export default function RegisterPage() {
  const { register } = useAuthStore();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    setLoading(true);
    try {
      await register(email, password, fullName);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.error || "Something went wrong");
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
            GET STARTED FREE
          </p>
          <h2
            className="font-display font-extrabold text-white leading-[1.0] tracking-[-2px] mb-6"
            style={{ fontSize: "clamp(40px, 4vw, 58px)" }}
          >
            Ship your first app
            <br />
            <span className="text-gradient-cyan">in 60 seconds.</span>
          </h2>
          <p className="text-[16px] text-muted leading-[1.7] max-w-[380px]">
            No credit card required. Start on the free Basic plan and upgrade
            when you&apos;re ready.
          </p>

          {/* What you get */}
          <div className="flex flex-col gap-3 mt-10">
            {[
              "2 deployments on the free plan",
              "Live build & runtime log streaming",
              "Isolated Docker containers",
              "Upgrade to Pro anytime for $15/mo",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-cyan/10 border border-cyan/[0.2] text-cyan text-[11px] flex-shrink-0">
                  ✓
                </span>
                <span className="font-body text-[14px] text-muted">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan preview */}
        <div className="relative bg-surface border border-white/[0.07] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted">
              Starting plan
            </span>
            <span className="font-mono text-[11px] text-cyan bg-cyan/10 border border-cyan/[0.15] px-2 py-0.5 rounded-full">
              FREE
            </span>
          </div>
          <div className="font-display font-extrabold text-[28px] text-white tracking-tight mb-1">
            Basic{" "}
            <span className="text-[16px] font-normal text-muted">· $5/mo</span>
          </div>
          <div className="font-mono text-[12px] text-muted">
            2 deployments · 0.5 vCPU · 512 MB RAM
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
            Create account
          </h1>
          <p className="text-[14px] text-muted mb-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cyan hover:text-white transition-colors duration-200 no-underline"
            >
              Sign in
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[12px] px-4 py-3 rounded-lg mb-6">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full name */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
                Full name <span className="text-white/20">(optional)</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-surface border border-white/[0.07] focus:border-cyan/50 focus:outline-none text-white placeholder-muted font-body text-[14px] px-4 py-3 rounded-lg transition-colors duration-200"
                style={{ caretColor: "#00e5ff" }}
              />
            </div>

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
              <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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
              {/* Strength hint */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={[
                        "h-0.5 flex-1 rounded-full transition-all duration-300",
                        password.length >= i * 3
                          ? i <= 1
                            ? "bg-red-500"
                            : i <= 2
                              ? "bg-gold"
                              : "bg-[#4a9f6e]"
                          : "bg-white/[0.07]",
                      ].join(" ")}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 font-mono font-bold text-[13px] tracking-widest bg-cyan text-bg py-3.5 rounded-lg transition-all duration-200 border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#33eeff]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin inline-block" />
                  Creating account...
                </span>
              ) : (
                "Create account →"
              )}
            </button>
          </form>

          <p className="text-center font-mono text-[11px] text-muted mt-8 leading-[1.7]">
            By creating an account you agree to our{" "}
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
