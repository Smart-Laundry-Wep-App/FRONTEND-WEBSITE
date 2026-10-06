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
        <Image src="/logo.png" alt="Logo SCA" width={76} height={76} className="auth-logo" priority />
        <span className="admin-pill">● &nbsp;Admin</span>
        <h1>SCA Smart Laundry</h1>
        <p className="auth-tag">CUCI BERSIH, CEPAT &amp; TEPAT WAKTU</p>
        <p className="auth-welcome">Selamat Datang Kembali! Silahkan<br />Masukan Akun Anda</p>
        <label>EMAIL / USERNAME</label>
        <div className="auth-field"><Mail size={23} /><input placeholder="Masukan Email atau Username" /></div>
        <div className="auth-row"><label>PASSWORD</label><a href="#">Lupa Password?</a></div>
        <div className="auth-field">
          <Lock size={23} /><input type={show ? "text" : "password"} placeholder="Masukan Password" />
          <button type="button" onClick={() => setShow(!show)}>{show ? <Eye size={23} /> : <EyeOff size={23} />}</button>
        </div>
        <button className="auth-submit">MASUK</button>
        <div className="auth-or"><span>Atau Masuk Dengan</span></div>
        <div className="social-row"><button type="button"><b>G</b> Google</button><button type="button"><b>f</b> Facebook</button></div>
        <p className="auth-foot">Belum punya akun? <Link href="/register">Daftar Sekarang</Link></p>
      </form>
    </main>
  );
}
