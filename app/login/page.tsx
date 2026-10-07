"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
          width={48}
          height={48}
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
          <Mail size={23} />

          <input
            type="text"
            placeholder="Masukan Email atau Username"
          />
        </div>

        {/* PASSWORD */}
        <div className="auth-row">
          <label>PASSWORD</label>

          <a href="#">
            Lupa Password?
          </a>
        </div>

        <div className="auth-field">
          <Lock size={23} />

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
              <Eye size={23} />
            ) : (
              <EyeOff size={23} />
            )}
          </button>
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

        {/* REGISTER */}
        <p className="auth-foot">
          Belum punya akun?{" "}
          <Link href="/register">
            Daftar Sekarang
          </Link>
        </p>

      </form>
    </main>
  );
}