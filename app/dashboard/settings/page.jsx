"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import userApi from "@/lib/api/userApi";
import ProtectedRoute from "@/components/ProtectedRoute";

// ── Reusable alert ────────────────────────────────────────────────────────
function Alert({ type, message }) {
  if (!message) return null;
  const styles = {
    success: "bg-[#4a9f6e]/10 border-[#4a9f6e]/20 text-[#4a9f6e]",
    error: "bg-red-500/10 border-red-500/20 text-red-400",
  };
  return (
    <div
      className={`flex items-center gap-2.5 border font-mono text-[12px] px-4 py-3 rounded-lg mb-5 ${styles[type]}`}
    >
      <span>{type === "success" ? "✓" : "⚠"}</span>
      {message}
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────
function Card({ title, subtitle, children }) {
  return (
    <div className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden mb-5">
      <div className="px-6 py-5 border-b border-white/[0.07]">
        <h2 className="font-display font-bold text-[16px] text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body text-[13px] text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────────────
function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-bg border border-white/[0.07] focus:border-cyan/50 focus:outline-none text-white placeholder-muted font-body text-[14px] px-4 py-3 rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ caretColor: "#00e5ff" }}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, refresh, logout } = useAuthStore();
  const router = useRouter();

  // Profile form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profMsg, setProfMsg] = useState({ type: "", text: "" });
  const [profLoad, setProfLoad] = useState(false);

  // Password form
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });
  const [passLoad, setPassLoad] = useState(false);

  // Delete form
  const [delPass, setDelPass] = useState("");
  const [delMsg, setDelMsg] = useState({ type: "", text: "" });
  const [delLoad, setDelLoad] = useState(false);
  const [delConfirm, setDelConfirm] = useState(false);

  // Seed form from store
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleProfile = async (e) => {
    e.preventDefault();
    setProfMsg({ type: "", text: "" });
    setProfLoad(true);
    try {
      await userApi.updateProfile(fullName, email);
      await refresh();
      setProfMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setProfMsg({
        type: "error",
        text: err?.error || "Failed to update profile",
      });
    } finally {
      setProfLoad(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: "", text: "" });
    if (newPass.length < 8) {
      return setPassMsg({
        type: "error",
        text: "New password must be at least 8 characters",
      });
    }
    setPassLoad(true);
    try {
      await userApi.changePassword(currPass, newPass);
      setPassMsg({ type: "success", text: "Password changed successfully" });
      setCurrPass("");
      setNewPass("");
    } catch (err) {
      setPassMsg({
        type: "error",
        text: err?.error || "Failed to change password",
      });
    } finally {
      setPassLoad(false);
    }
  };

  const handleDelete = async () => {
    setDelMsg({ type: "", text: "" });
    setDelLoad(true);
    try {
      await userApi.deleteAccount(delPass);
      await logout();
      router.replace("/");
    } catch (err) {
      setDelMsg({
        type: "error",
        text: err?.error || "Failed to delete account",
      });
      setDelLoad(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[680px]">
        {/* Heading */}
        <div className="mb-8">
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted mb-1">
            SETTINGS
          </p>
          <h1 className="font-display font-extrabold text-[28px] tracking-[-1px] text-white">
            Account Settings
          </h1>
          <p className="font-body text-[14px] text-muted mt-1">
            Manage your profile, password and account.
          </p>
        </div>

        {/* ── Profile ── */}
        <Card
          title="Profile"
          subtitle="Update your display name and email address."
        >
          <Alert type={profMsg.type} message={profMsg.text} />
          <form onSubmit={handleProfile}>
            <Field
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
            />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={profLoad}
              className="font-mono font-bold text-[12px] tracking-widest bg-cyan text-bg px-6 py-2.5 rounded-lg hover:bg-[#33eeff] transition-all duration-200 border-none cursor-pointer disabled:opacity-50"
            >
              {profLoad ? "Saving..." : "Save changes"}
            </button>
          </form>
        </Card>

        {/* ── Password ── */}
        <Card
          title="Change Password"
          subtitle="Use a strong password with at least 8 characters."
        >
          <Alert type={passMsg.type} message={passMsg.text} />
          <form onSubmit={handlePassword}>
            <Field
              label="Current password"
              type="password"
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
              placeholder="••••••••••••"
            />
            <Field
              label="New password"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min. 8 characters"
            />
            {/* Strength bar */}
            {newPass.length > 0 && (
              <div className="flex gap-1 mb-4 -mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={[
                      "h-0.5 flex-1 rounded-full transition-all duration-300",
                      newPass.length >= i * 3
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
            <button
              type="submit"
              disabled={passLoad}
              className="font-mono font-bold text-[12px] tracking-widest bg-cyan text-bg px-6 py-2.5 rounded-lg hover:bg-[#33eeff] transition-all duration-200 border-none cursor-pointer disabled:opacity-50"
            >
              {passLoad ? "Updating..." : "Update password"}
            </button>
          </form>
        </Card>

        {/* ── Plan info (read-only) ── */}
        <Card
          title="Current Plan"
          subtitle="Your active plan and resource limits."
        >
          <div className="flex items-center justify-between p-4 bg-cyan/[0.04] border border-cyan/[0.12] rounded-xl mb-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted mb-1">
                Active plan
              </div>
              <div className="font-display font-extrabold text-[20px] text-white">
                {user?.plan_display_name || "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-[24px] text-white">
                <sup className="text-[13px]">$</sup>
                {user?.price_cents ? user.price_cents / 100 : "—"}
              </div>
              <div className="font-mono text-[11px] text-muted">per month</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Max deployments",
                value:
                  user?.max_deployments === -1
                    ? "Unlimited"
                    : user?.max_deployments,
              },
              {
                label: "CPU limit",
                value: user?.cpu_limit ? `${user.cpu_limit} vCPU` : "—",
              },
              {
                label: "Memory limit",
                value: user?.memory_limit_mb
                  ? `${user.memory_limit_mb} MB`
                  : "—",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-bg border border-white/[0.07] rounded-lg p-3"
              >
                <div className="font-mono text-[10px] tracking-[0.06em] uppercase text-muted mb-1">
                  {s.label}
                </div>
                <div className="font-display font-bold text-[16px] text-white">
                  {s.value ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Danger zone ── */}
        <div className="bg-surface border border-red-500/20 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-red-500/10">
            <h2 className="font-display font-bold text-[16px] text-red-400">
              Danger Zone
            </h2>
            <p className="font-body text-[13px] text-muted mt-0.5">
              Permanently delete your account and all deployments.
            </p>
          </div>
          <div className="px-6 py-5">
            <Alert type={delMsg.type} message={delMsg.text} />

            {!delConfirm ? (
              <button
                onClick={() => setDelConfirm(true)}
                className="font-mono font-bold text-[12px] tracking-widest text-red-400 border border-red-500/30 hover:bg-red-500/10 px-6 py-2.5 rounded-lg transition-all duration-200 bg-transparent cursor-pointer"
              >
                Delete my account
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="font-body text-[13px] text-muted">
                  This will permanently delete your account, all deployments,
                  and logs.
                  <span className="text-red-400"> This cannot be undone.</span>
                </p>
                <Field
                  label="Confirm your password"
                  type="password"
                  value={delPass}
                  onChange={(e) => setDelPass(e.target.value)}
                  placeholder="Enter your password to confirm"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={delLoad || !delPass}
                    className="font-mono font-bold text-[12px] tracking-widest text-white bg-red-500 hover:bg-red-600 px-6 py-2.5 rounded-lg transition-all duration-200 border-none cursor-pointer disabled:opacity-50"
                  >
                    {delLoad ? "Deleting..." : "Yes, delete my account"}
                  </button>
                  <button
                    onClick={() => {
                      setDelConfirm(false);
                      setDelPass("");
                      setDelMsg({ type: "", text: "" });
                    }}
                    className="font-mono text-[12px] tracking-widest text-muted border border-white/[0.07] hover:text-white px-6 py-2.5 rounded-lg transition-all duration-200 bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
