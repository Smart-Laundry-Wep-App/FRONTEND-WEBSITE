"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Check, Loader2 } from "lucide-react";

export default function Logout() {
  const [status, setStatus] = useState<"processing" | "success">("processing");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const performLogout = async () => {
      // 1. Bersihkan sesi admin dari storage dan cookies
      try {
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
          document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
        }
      } catch (err) {
        console.error("Pembersihan sesi error:", err);
      }

      // 2. Beri jeda transisi halus sehingga animasi proses keluar terlihat elegan
      await new Promise((resolve) => setTimeout(resolve, 1100));

      if (!isMounted) return;

      // 3. Status berhasil hanya ditampilkan SETELAH pembersihan sesi selesai
      setStatus("success");

      // 4. Arahkan pengguna ke halaman login setelah logout berhasil
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
        ) : (
          <div className="logout-card logout-card--success" role="status" aria-live="polite">
            <div className="success-circle logout-circle-success">
              <Check size={64} strokeWidth={2.6} />
            </div>

            <h2>LOG OUT BERHASIL!</h2>
            <p className="logout-subtext">Anda telah keluar dari akun admin. Mengalihkan ke login...</p>

            <button
              type="button"
              className="confirm"
              onClick={() => router.push("/login")}
            >
              Ke Halaman Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}