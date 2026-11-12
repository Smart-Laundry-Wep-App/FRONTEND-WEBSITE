"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, getAuthToken, normalizeBackendError, setAuthUser, type UserProfile } from "@/lib/api";

export default function AdminAuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  const verifySession = useCallback(async () => {
    setError("");
    if (!getAuthToken()) {
      router.replace("/login");
      return;
    }

    try {
      const response = await authApi.getMe();
      if (response.data.role !== "Admin" && response.data.role !== "Kasir") {
        router.replace("/login");
        return;
      }
      setAuthUser(response.data);
      setUser(response.data);
    } catch (requestError) {
      if (requestError instanceof Error && "status" in requestError && requestError.status === 401) {
        router.replace("/login");
        return;
      }
      setError(
        requestError instanceof Error
          ? normalizeBackendError(requestError.message)
          : "Sesi gagal diverifikasi."
      );
    }
  }, [router]);

  useEffect(() => {
    void verifySession();
  }, [verifySession]);

  if (error) {
    return (
      <main className="auth-guard-state" role="alert">
        <p>{error}</p>
        <button type="button" className="primary-button" onClick={() => void verifySession()}>
          Coba lagi
        </button>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-guard-state" role="status" aria-live="polite">
        Memverifikasi sesi...
      </main>
    );
  }

  return children;
}
