"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw data;
      setSubmitted(true);
    } catch (err) {
      setError(err?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-[20px] font-extrabold text-white no-underline mb-10"
        >
          <span
            className="w-2 h-2 rounded-full bg-cyan"
            style={{ boxShadow: "0 0 10px #00e5ff" }}
          />
          CloudLight
        </Link>

        {submitted ? (
          // Success state
          <div className="bg-surface border border-white/[0.07] rounded-xl p-8 text-center">
            <div className="text-[40px] mb-4">📬</div>
            <h2 className="font-display font-extrabold text-[22px] text-white mb-3">
              Check your email
            </h2>
            <p className="font-body text-[14px] text-muted leading-[1.7] mb-6">
              If <span className="text-white">{email}</span> is registered,
              you&apos;ll receive a reset link shortly. Check your spam folder
              too.
            </p>
            <Link
              href="/login"
              className="font-mono text-[12px] text-cyan hover:text-white transition-colors no-underline"
            >
              ← Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display font-extrabold text-[32px] tracking-[-1px] text-white mb-1">
              Forgot password?
            </h1>
            <p className="font-body text-[14px] text-muted mb-8">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[12px] px-4 py-3 rounded-lg mb-5">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full font-mono font-bold text-[13px] tracking-widest bg-cyan text-bg py-3.5 rounded-lg hover:bg-[#33eeff] transition-all duration-200 border-none cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send reset link →"
                )}
              </button>
            </form>

            <p className="text-center font-mono text-[12px] text-muted mt-6">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-cyan hover:text-white transition-colors no-underline"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
