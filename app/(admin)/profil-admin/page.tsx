"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { ProfileIcon, InputField } from "@/components/UI";
import { Mail, UserRound, Phone, MapPin, Shield, Eye, Camera, Loader2 } from "lucide-react";
import { api, getAuthUser, setAuthUser, type UserProfile } from "@/lib/api";
import { uploadFileToCloud } from "@/lib/upload";

export default function ProfilAdmin() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const uploadResult = await uploadFileToCloud(file);
      if (!uploadResult.success || !uploadResult.url) {
        setError(uploadResult.error || "Gagal mengunggah gambar.");
        return;
      }

      setProfile((current) => current ? { ...current, avatar: uploadResult.url } : current);
      // Simpan URL avatar baru
      await api.put("/profile", { avatar: uploadResult.url });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Gagal mengunggah foto profil.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    let active = true;
    api.get<UserProfile>("/profile").then((response) => {
      if (!active) return;
      setProfile(response.data);
      setAuthUser(response.data);
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : "Gagal memuat profil.");
    });
    return () => { active = false; };
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const response = await api.put<UserProfile>("/profile", {
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        branch: String(formData.get("branch") ?? "").trim(),
      });
      setProfile(response.data);
      setAuthUser(response.data);
      setSaved(true);
      setError("");
      setTimeout(() => setSaved(false), 2500);
    } catch (requestError) {
      setSaved(false);
      setError(requestError instanceof Error ? requestError.message : "Profil gagal disimpan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header
        title="Profil Admin"
        subtitle="Kelola informasi akun, peran akses, dan kontak operasional administrator."
      />
      <section className="content profile-content">
        {error && <p className="order-error" role="alert">{error}</p>}
        <div className="profile-container">
          {/* PROFILE SUMMARY CARD */}
          <div className="profile-summary card">
            <div className="profile-summary-left">
              <div className="profile-wrap" style={{ position: "relative" }}>
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="Foto Profil Admin"
                    width={56}
                    height={56}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                    unoptimized
                  />
                ) : (
                  <ProfileIcon />
                )}
                <span className="online-dot" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    right: "-4px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "2px solid #ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Ganti Foto Profil"
                >
                  {uploading ? <Loader2 size={12} className="spin-infinite" /> : <Camera size={12} />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="profile-info">
                <div className="profile-name-row">
                  <h2>{profile?.name ?? getAuthUser()?.name ?? "Memuat profil..."}</h2>
                  <span className="profile-status-pill">Aktif</span>
                </div>
                <p>
                  <Mail size={16} /> {profile?.email ?? getAuthUser()?.email ?? ""}
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
                name="name"
                value={profile?.name ?? ""}
                onChange={(event) => setProfile((current) => current ? { ...current, name: event.target.value } : current)}
                placeholder="Budi Santoso (Admin Utama)"
              />
              <InputField
                label="Email"
                icon={Mail}
                type="email"
                name="email"
                value={profile?.email ?? ""}
                onChange={(event) => setProfile((current) => current ? { ...current, email: event.target.value } : current)}
                placeholder="admin@scalaundry.id"
              />
            </div>

            <label className="form-label">
              Role
              <div className="role-field">
                <Shield size={20} />
                {profile?.role ?? getAuthUser()?.role ?? "Admin"}
              </div>
            </label>

            <div className="two-fields">
              <InputField
                label="Nomor WhatsApp / Kontak"
                icon={Phone}
                name="phone"
                value={profile?.phone ?? ""}
                onChange={(event) => setProfile((current) => current ? { ...current, phone: event.target.value } : current)}
                placeholder="+62 812-3456-7890"
              />
              <InputField
                label="Outlet"
                icon={MapPin}
                name="branch"
                value={profile?.branch ?? ""}
                onChange={(event) => setProfile((current) => current ? { ...current, branch: event.target.value } : current)}
                placeholder="SCA Smart Laundry Sigura, Malang"
              />
            </div>

            <div className="profile-actions-row">
              <button
                type="submit"
                className={`save-button${saving ? " save-button--saving" : saved ? " save-button--saved" : ""}`}
                aria-live="polite"
                disabled={saving}
              >
                {saving ? (
                  <>Menyimpan...</>
                ) : saved ? (
                  <>
                    Perubahan Berhasil Disimpan!
                  </>
                ) : (
                  <>Simpan Perubahan</>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
