"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Check, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";

export default function Logout() {
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [logoutError, setLogoutError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const performLogout = async () => {
      let revokeError = "";
      try {
        await authApi.logout();
      } catch (error) {
        console.error("Gagal mencabut sesi di backend:", error);
        revokeError = error instanceof Error ? error.message : "Server gagal mencabut token.";
        if (isMounted) {
          setLogoutError(`Sesi lokal sudah dihapus, tetapi server gagal mencabut token: ${revokeError}`);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1100));

      if (!isMounted) return;

      setStatus(revokeError ? "error" : "success");

      const redirectTimer = setTimeout(() => {
        if (isMounted) {
          router.push("/login");
        }
      }, 1400);

      return () => clearTimeout(redirectTimer);
    };

    performLogout();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="logout-main">
      <div className="logout-overlay">
        {status === "processing" ? (
          <div className="logout-card logout-card--processing" role="status" aria-live="polite">
            <div className="logout-avatar">
              <div className="profile-circle logout-circle-processing">
                <LogOut size={46} strokeWidth={2.2} className="logout-icon-spin" />
              </div>
              <span className="logout-badge logout-badge--processing">
                <Loader2 size={18} className="spin-infinite" />
              </span>
            </div>

            <h2>Mengeluarkan Sesi...</h2>
            <p className="logout-subtext">Menghapus kredensial dan mengamankan akun admin</p>

            <div className="logout-progress-bar">
              <div className="logout-progress-fill" />
            </div>
          </div>
        ) : status === "success" ? (
          <div className="logout-card logout-card--success" role="status" aria-live="polite">
            <div className="success-circle logout-circle-success" aria-hidden="true">
              <Check size={64} strokeWidth={2.6} className="logout-check-icon" />
            </div>

            <h2>LOG OUT BERHASIL!</h2>
            <p className="logout-subtext">Anda telah keluar dari akun admin. Mengalihkan ke login...</p>
          </div>
        ) : (
          <div className="logout-card logout-card--success" role="alert">
            <h2>Sesi lokal sudah dihapus</h2>
            <p className="logout-subtext">{logoutError} Mengalihkan ke login...</p>
          </div>
        )}
      </div>
    </div>
  );
}