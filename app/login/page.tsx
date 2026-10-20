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
            <b>G</b>
            Google
          </button>

          <button type="button">
            <b>f</b>
            Facebook
          </button>
        </div>

      </form>
    </main>
  );
}