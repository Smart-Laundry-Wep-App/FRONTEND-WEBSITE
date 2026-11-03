"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { SearchBox, PrimaryButton, EmptyTable, Pagination } from "@/components/UI";
import { Plus, X, Send, Bell } from "lucide-react";
import { DUMMY_NOTIFICATIONS, type DummyNotification } from "@/lib/dummyData";
import { readNotifications, saveNotifications } from "@/lib/notificationStorage";

export default function Notifikasi() {
  const [notifications, setNotifications] = useState<DummyNotification[]>(DUMMY_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const perPage = 5;

  useEffect(() => {
    try {
      setNotifications(readNotifications());
    } catch (error) {
      console.error("Gagal membaca data notifikasi:", error);
    }
  }, []);

  const filtered = notifications.filter((item) => {
    const q = search.trim().toLowerCase();
    return !q || Object.values(item).some((value) =>
      String(value).toLowerCase().includes(q),
    );
  });

  const visibleNotifications = filtered.slice((page - 1) * perPage, page * perPage);

  function handleAddNotification(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const newItem: DummyNotification = {
      id: `notif-${Date.now()}`,
      title: newTitle.trim(),
      message: newMessage.trim(),
      date: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase(),
      status: "Terkirim",
    };

    const updatedNotifications = [newItem, ...notifications];
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
    setNewTitle("");
    setNewMessage("");
    setIsModalOpen(false);
    setPage(1);
  }

  return (
    <>
      <Header
        title="Kelola Notifikasi"
        subtitle="Kelola pesan notifikasi WhatsApp/SMS otomatis, status pesanan, dan promo pelanggan"
      />
      <section className="content notification-content">
        <div className="toolbar notification-toolbar">
          <SearchBox
            placeholder="Cari Judul, Pesan, atau Pelanggan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <PrimaryButton icon={Plus} onClick={() => setIsModalOpen(true)}>
            Tambah Notifikasi
          </PrimaryButton>
        </div>

        <EmptyTable headers={["JUDUL", "PESAN NOTIFIKASI", "TANGGAL", "STATUS"]} rows={0}>
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((r) => (
              <tr key={r.id}>
                <td style={{ minWidth: "180px" }}>
                  <strong>{r.title}</strong>
                  <small>ID: {r.id}</small>
                </td>
                <td style={{ textAlign: "left", padding: "12px 20px", maxWidth: "420px" }}>
                  <p style={{ margin: 0, lineHeight: 1.4, color: "#334155" }}>{r.message}</p>
                </td>
                <td style={{ minWidth: "130px" }}>
                  <strong>{r.date}</strong>
                </td>
                <td style={{ minWidth: "130px" }}>
                  <span className={`status ${r.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                Tidak ada data notifikasi yang cocok.
              </td>
            </tr>
          )}
        </EmptyTable>

        <Pagination
          total={filtered.length}
          perPage={perPage}
          page={page}
          onPageChange={setPage}
        />
      </section>

      {/* MODAL TAMBAH NOTIFIKASI */}
      {isModalOpen && (
        <div
          className="promo-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <section
            className="promo-modal notif-card-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notif-modal-title"
          >
            <header className="promo-modal-header">
              <div className="promo-modal-icon">
                <Bell size={22} />
              </div>
              <div>
                <h2 id="notif-modal-title">Kirim Notifikasi Pelanggan</h2>
                <p>Broadcast pesan WhatsApp atau notifikasi pesanan pelanggan</p>
              </div>
              <button
                type="button"
                className="promo-modal-close"
                aria-label="Tutup"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <form className="promo-modal-form" onSubmit={handleAddNotification} noValidate>
              <label>
                Judul Notifikasi
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="Contoh: Pesanan #ORD-8929 Siap Diambil"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </label>

              <label>
                Isi Pesan Notifikasi
                <textarea
                  required
                  rows={4}
                  placeholder="Halo Kak [Nama Pelanggan], cucian Anda sudah selesai dikemas rapi dan siap diambil..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="promo-modal-textarea"
                />
              </label>

              <div className="promo-modal-actions">
                <button
                  type="button"
                  className="promo-modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="promo-modal-submit">
                  <Send size={15} />
                  Kirim Sekarang
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
