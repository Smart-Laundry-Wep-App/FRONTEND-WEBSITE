import Link from "next/link";

export default function NotFound() {
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
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "72px", fontWeight: 800, color: "#2563eb", margin: 0 }}>404</h1>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", marginTop: "8px", marginBottom: "8px" }}>
          Halaman Tidak Ditemukan
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
          Maaf, halaman yang Anda cari tidak tersedia atau rute URL salah.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px"
          }}
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
