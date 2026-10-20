"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound, Mail, Lock, EyeOff, Eye } from "lucide-react";

export default function Register() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/login");
  };

  return (
    <main className="auth-page register-page">
      <form className="auth-card register-card" onSubmit={handleSubmit}>
        <Image src="/logo.png" alt="Logo SCA" width={76} height={76} className="auth-logo" priority />
        <span className="admin-pill">●Admin</span><h1>Register</h1><p className="register-sub">Buat akun baru untuk melanjutkan</p>
        <label>Nama Lengkap<span>*</span></label><div className="auth-field"><UserRound size={23} /><input placeholder="Nama Lengkap Anda" /></div>
        <label>Email <span>*</span></label><div className="auth-field"><Mail size={23} /><input placeholder="Anonymous@gmail.com" /></div>
        <label>Username<span>*</span></label><div className="auth-field"><UserRound size={23} /><input placeholder="Username_admin" /></div>
        <label>Password<span>*</span></label><div className="auth-field"><Lock size={23} /><input type={show ? "text" : "password"} placeholder="Minimal 8 karakter" /><button type="button" onClick={() => setShow(!show)}>{show ? <Eye size={23} /> : <EyeOff size={23} />}</button></div>
        <label>Konfirmasi password<span>*</span></label><div className="auth-field"><Lock size={23} /><input type={show ? "text" : "password"} placeholder="Ulangi Kata Sandi" /><button type="button" onClick={() => setShow(!show)}>{show ? <Eye size={23} /> : <EyeOff size={23} />}</button></div>
        <button className="auth-submit">DAFTAR</button><div className="auth-or"><span>Atau Daftar Dengan</span></div><div className="social-row"><button type="button"><b>G</b> Google</button><button type="button"><b>f</b> Facebook</button></div><p className="auth-foot">Sudah punya akun? <Link href="/login">Login</Link></p>
      </form>
    </main>
  );
}
