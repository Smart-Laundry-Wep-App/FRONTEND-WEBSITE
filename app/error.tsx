"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Terjadi error pada aplikasi:", error);
  }, [error]);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8fafc",
      padding: "24px",
      fontFamily: "Poppins, sans-serif"
    }}>
      <div style={{
        maxWidth: "480px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        textAlign: "center"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#fee2e2",
          color: "#ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: "24px"
        }}>
          ⚠️
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
          Terjadi Kesalahan Tak Terduga
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: 1.5 }}>
          {error.message || "Aplikasi mengalami kegagalan saat memuat rute ini. Silakan coba kembali."}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Coba Lagi
          </button>
          <button
            type="button"
            onClick={() => { window.location.href = "/dashboard"; }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f1f5f9",
              color: "#334155",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
