"use client";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthProvider({ children }) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, []);

  return children;
}
