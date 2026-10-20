"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>

        {/* LOGO SCA SMART LAUNDRY */}
        <Image
          src="/logo.png"
          alt="Logo SCA Smart Laundry"
          width={52}
          height={52}
          className="auth-logo"
          priority
        />

        {/* ADMIN */}
        <span className="admin-pill">
          ● &nbsp;Admin
        </span>

        {/* TITLE */}
        <h1>SCA Smart Laundry</h1>

        <p className="auth-tag">
          CUCI BERSIH, CEPAT &amp; TEPAT WAKTU
        </p>

        {/* WELCOME */}
        <p className="auth-welcome">
          Selamat Datang Kembali! Silahkan
          <br />
          Masukan Akun Anda
        </p>

        {/* EMAIL / USERNAME */}
        <label>EMAIL / USERNAME</label>

        <div className="auth-field">
          <Mail size={20} />

          <input
            type="text"
            placeholder="Masukan Email atau Username"
          />
        </div>

        {/* PASSWORD */}
        <label>PASSWORD</label>

        <div className="auth-field">
          <Lock size={20} />

          <input
            type={show ? "text" : "password"}
            placeholder="Masukan Password"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={
              show
                ? "Sembunyikan password"
                : "Tampilkan password"
            }
          >
            {show ? (
              <Eye size={20} />
            ) : (
              <EyeOff size={20} />
            )}
          </button>
        </div>

        {/* LUPA PASSWORD - TEPAT DI BAWAH FIELD PASSWORD */}
        <div className="auth-forgot">
          <a href="#">Lupa Password?</a>
        </div>

        {/* LOGIN */}
        <button
          type="submit"
          className="auth-submit"
        >
          MASUK
        </button>

        {/* OR */}
        <div className="auth-or">
          <span>Atau Masuk Dengan</span>
        </div>

        {/* SOCIAL LOGIN */}
        <div className="social-row">
          <button type="button">
            <svg className="social-icon google-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.5 5.5 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.15a11 11 0 0 0 0 9.88l3.69-2.84Z" />
              <path fill="#EA4335" d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0a11 11 0 0 0-9.85 7.06l3.69 2.84C6.71 7.29 9.14 4.36 12 4.36Z" />
            </svg>
            Google
          </button>

          <button type="button">
            <svg className="social-icon facebook-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.98h-1.513c-1.49 0-1.956.93-1.956 1.886v2.255h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
            </svg>
            Facebook
          </button>
        </div>

      </form>
    </main>
  );
}