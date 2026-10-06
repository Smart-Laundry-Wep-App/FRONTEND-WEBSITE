"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Check } from "lucide-react";

export default function Logout() {
 const [done,setDone]=useState(false); const router=useRouter();
 return <div className="logout-main">
  {!done ? <div className="logout-card"><div className="logout-avatar"><div className="profile-circle"><span className="person-symbol">●<br/>▰</span></div><span className="logout-badge"><LogOut size={22}/></span></div><h2>Keluar dari Akun?</h2><p>Apakah Anda Yakin Keluar Dari Akun Ini?</p><div className="logout-actions"><button onClick={()=>router.push("/dashboard")}>Batal</button><button className="confirm" onClick={()=>setDone(true)}>Keluar</button></div></div>
  : <div className="logout-card success"><div className="success-circle"><Check size={78}/></div><h2>LOG OUT BERHASIL!</h2><p>Anda Telah Keluar dari Akun Admin</p><button className="confirm" onClick={()=>router.push("/login")}>OKE</button></div>}
 </div>;
}
