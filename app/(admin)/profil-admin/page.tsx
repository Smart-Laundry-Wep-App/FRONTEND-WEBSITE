"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { ProfileIcon, InputField } from "@/components/UI";
import { Mail, UserRound, Phone, MapPin, Shield, Eye, Check } from "lucide-react";

export default function ProfilAdmin() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <Header
        title="Profil Admin"
        subtitle="Kelola informasi akun, peran akses, dan kontak operasional administrator."
      />
      <section className="content profile-content">
        <div className="profile-container">
          {/* PROFILE SUMMARY CARD */}
          <div className="profile-summary card">
            <div className="profile-summary-left">
              <div className="profile-wrap">
                <ProfileIcon />
                <span className="online-dot" />
              </div>
              <div className="profile-info">
                <div className="profile-name-row">
                  <h2>Admin SCA</h2>
                  <span className="profile-status-pill">Aktif</span>
                </div>
                <p>
                  <Mail size={16} /> admin@scalaundry.id
                </p>
                <small>Terakhir diperbarui: Hari ini, 10:45 WIB</small>
              </div>
            </div>
            <button type="button" className="secondary-button compact">
              <Eye size={18} />
              Lihat Profil
            </button>
          </div>

          {/* PROFILE FORM CARD */}
          <form className="profile-form card" onSubmit={handleSave}>
            <div className="profile-card-heading">
              <h3>Informasi Pribadi &amp; Kontak</h3>
              <p>Perbarui data akun admin dan penugasan operasional outlet</p>
            </div>

            <div className="two-fields">
              <InputField
                label="Nama Lengkap"
                icon={UserRound}
                defaultValue="Budi Santoso (Admin Utama)"
                placeholder="Budi Santoso (Admin Utama)"
              />
              <InputField
                label="Email"
                icon={Mail}
                type="email"
                defaultValue="admin@scalaundry.id"
                placeholder="admin@scalaundry.id"
              />
            </div>

            <label className="form-label">
              Role
              <div className="role-field">
                <Shield size={20} />
                Super Admin / Manager Operasional
              </div>
            </label>

            <div className="two-fields">
              <InputField
                label="Nomor WhatsApp / Kontak"
                icon={Phone}
                defaultValue="+62 812-3456-7890"
                placeholder="+62 812-3456-7890"
              />
              <InputField
                label="Outlet"
                icon={MapPin}
                defaultValue="SCA Smart Laundry Sigura, Malang"
                placeholder="SCA Smart Laundry Sigura, Malang"
              />
            </div>

            <div className="profile-actions-row">
              <button type="submit" className="save-button">
                {saved ? (
                  <>
                    <Check size={18} /> &nbsp; Perubahan Berhasil Disimpan!
                  </>
                ) : (
                  <>✓ &nbsp; Simpan Perubahan</>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
