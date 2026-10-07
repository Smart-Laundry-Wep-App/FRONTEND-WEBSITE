"use client";
import { ProfileIcon, InputField } from "@/components/UI";
import { Mail, UserRound, Phone, MapPin, Shield, Eye } from "lucide-react";

export default function ProfilAdmin() {
 return <section className="content profile-content profile-page">
   <div className="profile-summary card">
    <div className="profile-summary-left"><div className="profile-wrap"><ProfileIcon/><span className="online-dot"/></div><div><h2>Admin</h2><p><Mail size={16}/> admin@scalaundry.id</p><small>Terakhir diperbarui: Hari ini, 10:45 WIB</small></div></div>
    <button className="secondary-button compact"><Eye size={19}/>Lihat Profil</button>
   </div>
   <div className="profile-form card">
    <InputField label="Nama Lengkap" icon={UserRound} placeholder="Budi Santoso (Admin Utama)"/>
    <InputField label="Email" icon={Mail} placeholder="admin@scalaundry.id"/>
    <label className="form-label">Role<div className="role-field"><Shield size={20}/>Super Admin / Manager Operasional</div></label>
    <div className="two-fields"><InputField label="Nomor WhatsApp / Kontak" icon={Phone} placeholder="+62 812-3456-7890"/><InputField label="Outlet" icon={MapPin} placeholder="SCA Smart Laundry Sigura, Malang"/></div>
    <button className="save-button">✓ &nbsp; Simpan Perubahan</button>
   </div>
  </section>;
}
