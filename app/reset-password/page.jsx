"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token.");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8)
      return setError("Password must be at least 8 characters");
    if (password !== password2) return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw data;
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 3000);
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

        {success ? (
          <div className="bg-surface border border-white/[0.07] rounded-xl p-8 text-center">
            <div className="text-[40px] mb-4">✅</div>
            <h2 className="font-display font-extrabold text-[22px] text-white mb-3">
              Password reset!
            </h2>
            <p className="font-body text-[14px] text-muted leading-[1.7]">
              Your password has been updated. Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display font-extrabold text-[32px] tracking-[-1px] text-white mb-1">
              Reset password
            </h1>
            <p className="font-body text-[14px] text-muted mb-8">
              Choose a new password for your account.
            </p>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[12px] px-4 py-3 rounded-lg mb-5">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* New password */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
                  New password
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors text-[16px] bg-transparent border-none cursor-pointer"
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
                {/* Strength bar */}
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

              {/* Confirm password */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Repeat your new password"
                  required
                  className={[
                    "w-full bg-surface border focus:outline-none text-white placeholder-muted font-body text-[14px] px-4 py-3 rounded-lg transition-colors duration-200",
                    password2.length > 0 && password !== password2
                      ? "border-red-500/50"
                      : "border-white/[0.07] focus:border-cyan/50",
                  ].join(" ")}
                  style={{ caretColor: "#00e5ff" }}
                />
                {password2.length > 0 && password !== password2 && (
                  <span className="font-mono text-[11px] text-red-400">
                    Passwords do not match
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full mt-2 font-mono font-bold text-[13px] tracking-widest bg-cyan text-bg py-3.5 rounded-lg hover:bg-[#33eeff] transition-all duration-200 border-none cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset password →"
                )}
              </button>
            </form>

            <p className="text-center font-mono text-[12px] text-muted mt-6">
              <Link
                href="/login"
                className="text-cyan hover:text-white transition-colors no-underline"
              >
                ← Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
