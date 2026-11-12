"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Headphones,
  Globe,
  AlertCircle,
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import { authApi, normalizeBackendError } from "@/lib/api";
import { signIn } from "next-auth/react";

export default function Login() {
  const [show, setShow] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Language & Help Modal States
  const [lang, setLang] = useState<"id" | "en">("id");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setGoogleLoading(true);

    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "id"
            ? "Gagal memulai login Google. Silakan coba lagi."
            : "Could not start Google sign-in. Please try again."
      );
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!identifier.trim() || !password) {
      setError(
        lang === "id"
          ? "Email/Username dan Password wajib diisi"
          : "Email/Username and Password are required"
      );
      return;
    }

    setLoading(true);
    try {
      await authApi.login({
        identifier: identifier.trim(),
        password,
      });

      setSuccess(
        lang === "id"
          ? "Login berhasil! Mengalihkan ke dashboard..."
          : "Login successful! Redirecting to dashboard..."
      );
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } catch (err: any) {
      const backendMessage = err?.message || err?.data?.message || "";
      setError(
        normalizeBackendError(backendMessage) ||
          (lang === "id"
            ? "Gagal masuk. Periksa kembali username dan password Anda."
            : "Sign in failed. Please verify your username and password.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="riskora-layout-page">
      {/* Background Soft Ambient Light */}
      <div className="sky-ambient-decor" aria-hidden="true">
        <span className="sky-orb orb-1" />
        <span className="sky-orb orb-2" />
        <span className="sky-orb orb-3" />
      </div>

      {/* Main Container Card */}
      <div className="riskora-container-card">
        {/* Top Header Row (Logo on Left, Support & Language on Right) */}
        <header className="riskora-top-nav">
          <div className="nav-brand-group">
            <Image
              src="/logo.png"
              alt="Logo SCA Smart Laundry"
              width={48}
              height={48}
              className="nav-brand-logo"
              priority
            />
            <div className="nav-brand-text">
              <span className="nav-brand-name">SCA Smart Laundry</span>
              <span className="nav-brand-tagline">
                {lang === "id" ? "Cuci Bersih, Cepat & Tepat Waktu" : "Clean, Fast & On Time"}
              </span>
            </div>
          </div>

          <div className="nav-actions-group">
            {/* Interactive Bantuan Button */}
            <button
              type="button"
              className="nav-pill-btn"
              onClick={() => setShowHelpModal(true)}
            >
              <Headphones size={15} />
              <span>{lang === "id" ? "Bantuan" : "Support"}</span>
            </button>

            {/* Interactive Language Selector (ID / EN) */}
            <div className="lang-dropdown-wrapper">
              <button
                type="button"
                className="nav-pill-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                aria-expanded={showLangMenu}
              >
                <Globe size={15} />
                <span>{lang === "id" ? "Indonesia (ID)" : "English (EN)"}</span>
                <ChevronDown size={13} className={`lang-chevron ${showLangMenu ? "rotate" : ""}`} />
              </button>

              {showLangMenu && (
                <div className="lang-dropdown-menu">
                  <button
                    type="button"
                    className={`lang-option ${lang === "id" ? "active" : ""}`}
                    onClick={() => {
                      setLang("id");
                      setShowLangMenu(false);
                    }}
                  >
                    <span>Indonesia (ID)</span>
                    {lang === "id" && <Check size={14} className="lang-check" />}
                  </button>
                  <button
                    type="button"
                    className={`lang-option ${lang === "en" ? "active" : ""}`}
                    onClick={() => {
                      setLang("en");
                      setShowLangMenu(false);
                    }}
                  >
                    <span>English (EN)</span>
                    {lang === "en" && <Check size={14} className="lang-check" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Body Split: Left Bubble Laundry Panel | Right Login Card */}
        <div className="riskora-split-body">
          {/* ==========================================================
              LEFT SIDE: CLEAN WHITE LAUNDRY BUBBLE & SCA SMART LAUNDRY
             ========================================================== */}
          <div className="preview-column">
            <div className="laundry-bubble-panel">
              <Image
                src="/laundry-login.png"
                alt="Ilustrasi layanan laundry dengan mesin cuci"
                width={1200}
                height={800}
                className="reference-login-illustration"
                priority
              />
              <div className="bubble-panel-center">
                <h2 className="bubble-hero-title">
                  SCA SMART<br />
                  <span>LAUNDRY</span>
                </h2>
                <h3 className="reference-login-heading">
                  {lang === "id" ? "Urus cucian jadi lebih mudah." : "Laundry made easier."}
                </h3>
                <p className="bubble-hero-desc">
                  {lang === "id"
                    ? "Kelola layanan laundry harian dengan praktis, cepat, dan tertata dalam satu tempat."
                    : "Manage your daily laundry service with ease, speed, and everything in one place."}
                </p>
                <p className="reference-login-promise">
                  - {lang === "id" ? "Bersih, cepat & tepat waktu" : "Clean, fast & on time"}
                </p>
              </div>
            </div>
          </div>

          {/* ==========================================================
              RIGHT SIDE: LOGIN FORM CARD (Kotak Tumpul / Rounded Rect)
             ========================================================== */}
          <div className="form-column">
            <div className="login-inner-card">
              <Image
                src="/logo.png"
                alt="Logo SCA Smart Laundry"
                width={52}
                height={52}
                className="reference-login-logo"
                priority
              />
              <span className="admin-pill reference-admin-pill">● Admin</span>
              <h2 className="login-card-title">SCA Smart Laundry</h2>
              <p className="auth-tag">
                {lang === "id" ? "CUCI BERSIH, CEPAT & TEPAT WAKTU" : "CLEAN, FAST & ON TIME"}
              </p>
              <p className="login-card-subtitle">
                {lang === "id"
                  ? "Selamat Datang Kembali! Silahkan Masukan Akun Anda"
                  : "Welcome back! Please enter your account details"}
              </p>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="actual-form">
                {/* ERROR / SUCCESS ALERTS */}
                {error && (
                  <div role="alert" className="form-alert error-alert">
                    <AlertCircle size={16} className="alert-inline-icon" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div role="status" className="form-alert success-alert">
                    <Check size={16} className="alert-inline-icon" />
                    <span>{success}</span>
                  </div>
                )}

                {/* EMAIL / USERNAME */}
                <div className="form-group">
                  <label htmlFor="login-identifier">
                    {lang === "id" ? "EMAIL / USERNAME" : "EMAIL / USERNAME"}
                  </label>
                  <div className="input-wrap">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="login-identifier"
                      type="text"
                      placeholder={
                        lang === "id"
                          ? "Masukan Email atau Username"
                          : "Enter Email or Username"
                      }
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={loading}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="form-group">
                  <label htmlFor="login-password">
                    {lang === "id" ? "PASSWORD" : "PASSWORD"}
                  </label>
                  <div className="input-wrap">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="login-password"
                      type={show ? "text" : "password"}
                      placeholder={
                        lang === "id" ? "Masukan Password" : "Enter Password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="eye-toggle-btn"
                      onClick={() => setShow(!show)}
                      aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {show ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                {/* LUPA PASSWORD */}
                <div className="forgot-pass-wrap">
                  <a href="#">{lang === "id" ? "Lupa Password?" : "Forgot Password?"}</a>
                </div>

                {/* SUBMIT BUTTON (Kotak Tumpul / Rounded Rect) */}
                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spin-infinite" />
                      <span>{lang === "id" ? "Memproses..." : "Processing..."}</span>
                    </>
                  ) : (
                    <span>{lang === "id" ? "Masuk" : "Sign In"}</span>
                  )}
                </button>

                <div className="divider-or">
                  <span>{lang === "id" ? "Atau Masuk Dengan" : "Or Sign In With"}</span>
                </div>

                <button
                  type="button"
                  className="google-sign-btn"
                  onClick={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                >
                  <svg className="google-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.5 5.5 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.15a11 11 0 0 0 0 9.88l3.69-2.84Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0a11 11 0 0 0-9.85 7.06l3.69 2.84C6.71 7.29 9.14 4.36 12 4.36Z"
                    />
                  </svg>
                  <span>
                    {googleLoading
                      ? lang === "id"
                        ? "Menghubungkan..."
                        : "Connecting..."
                      : lang === "id"
                        ? "Masuk dengan Google"
                        : "Sign in with Google"}
                  </span>
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          INTERACTIVE HELP MODAL
         ========================================================== */}
      {showHelpModal && (
        <div
          className="help-modal-overlay"
          onClick={() => setShowHelpModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="help-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="help-modal-header">
              <div className="help-modal-icon">
                <Headphones size={20} />
              </div>
              <div className="help-modal-titles">
                <h3 className="help-modal-title">
                  {lang === "id"
                    ? "Pusat Bantuan SCA Smart Laundry"
                    : "SCA Smart Laundry Support"}
                </h3>
                <p className="help-modal-sub">
                  {lang === "id"
                    ? "Hubungi tim admin & teknis kami jika membutuhkan bantuan akses"
                    : "Reach our technical & admin team if you need access assistance"}
                </p>
              </div>
              <button
                type="button"
                className="help-modal-close"
                onClick={() => setShowHelpModal(false)}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="help-modal-body">
              <div className="help-contact-item">
                <span className="contact-badge">WhatsApp Admin</span>
                <span className="contact-val">+62 812-9988-1122</span>
              </div>
              <div className="help-contact-item">
                <span className="contact-badge">Email Support</span>
                <span className="contact-val">admin@scasmartlaundry.id</span>
              </div>
              <div className="help-contact-item">
                <span className="contact-badge">
                  {lang === "id" ? "Jam Operasional" : "Operating Hours"}
                </span>
                <span className="contact-val">07:00 - 21:00 WIB</span>
              </div>
            </div>

            <div className="help-modal-footer">
              <button
                type="button"
                className="help-modal-btn"
                onClick={() => setShowHelpModal(false)}
              >
                {lang === "id" ? "Mengerti & Tutup" : "Got It & Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
