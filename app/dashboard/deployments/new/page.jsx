"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import deploymentApi from "@/lib/api/deploymentApi";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function NewDeploymentPage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith(".zip")) {
      setError("Only .zip files are accepted");
      return;
    }
    setError("");
    setFile(f);
    // Auto-fill project name from filename if empty
    if (!projectName) {
      setProjectName(
        f.name
          .replace(".zip", "")
          .replace(/[^a-z0-9-]/gi, "-")
          .toLowerCase(),
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a ZIP file");
    if (!projectName) return setError("Project name is required");
    setLoading(true);
    setError("");
    try {
      const { deployment } = await deploymentApi.deploy(projectName, file);
      router.push(`/dashboard/deployments/${deployment.id}`);
    } catch (err) {
      setError(err?.error || "Deployment failed");
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[600px]">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/deployments"
            className="font-mono text-[12px] text-muted hover:text-white transition-colors no-underline flex items-center gap-1.5 mb-4"
          >
            ← Back to deployments
          </Link>
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted mb-1">
            // NEW DEPLOYMENT
          </p>
          <h1 className="font-display font-extrabold text-[28px] tracking-[-1px] text-white">
            Deploy an app
          </h1>
          <p className="font-body text-[14px] text-muted mt-1">
            Upload a ZIP of your Node.js project. We'll build and run it
            automatically.
          </p>
        </div>

        <div className="bg-surface border border-white/[0.07] rounded-xl p-6">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[12px] px-4 py-3 rounded-lg mb-5">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Project name */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
                Project name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-awesome-app"
                required
                className="w-full bg-bg border border-white/[0.07] focus:border-cyan/50 focus:outline-none text-white placeholder-muted font-mono text-[14px] px-4 py-3 rounded-lg transition-colors duration-200"
                style={{ caretColor: "#00e5ff" }}
              />
            </div>

            {/* File drop zone */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted">
                ZIP file
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={[
                  "relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-200",
                  dragging
                    ? "border-cyan bg-cyan/[0.05]"
                    : file
                      ? "border-[#4a9f6e]/50 bg-[#4a9f6e]/[0.04]"
                      : "border-white/[0.1] hover:border-white/20 hover:bg-white/[0.02]",
                ].join(" ")}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {file ? (
                  <>
                    <span className="text-[32px]">✅</span>
                    <div className="text-center">
                      <div className="font-mono text-[13px] text-white">
                        {file.name}
                      </div>
                      <div className="font-mono text-[11px] text-muted mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="font-mono text-[11px] text-red-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[32px]">📦</span>
                    <div className="text-center">
                      <div className="font-body text-[14px] text-white">
                        Drop your ZIP here or{" "}
                        <span className="text-cyan">browse</span>
                      </div>
                      <div className="font-mono text-[11px] text-muted mt-1">
                        .zip files only · node_modules excluded automatically
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-bg border border-white/[0.07] rounded-xl p-4">
              <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted mb-3">
                What happens after you deploy
              </p>
              <div className="flex flex-col gap-2">
                {[
                  "ZIP is extracted, node_modules skipped",
                  "Dockerfile is generated automatically",
                  "Docker image is built (npm install + build)",
                  "Container starts, port is assigned",
                  "You get redirected to live logs",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-cyan bg-cyan/10 border border-cyan/[0.15] w-5 h-5 flex items-center justify-center rounded flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-body text-[13px] text-muted">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full font-mono font-bold text-[13px] tracking-widest bg-cyan text-bg py-3.5 rounded-lg hover:bg-[#33eeff] transition-all duration-200 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                  Deploying...
                </span>
              ) : (
                "Deploy →"
              )}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
