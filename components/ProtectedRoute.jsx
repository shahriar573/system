"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();
  console.log("ProtectedRoute state:", { user, loading }); // ← add this

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading]);

  if (loading)
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
      </div>
    );

  if (!user) return null;

  return children;
}
