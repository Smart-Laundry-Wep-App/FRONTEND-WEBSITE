"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { SearchBox, PrimaryButton, EmptyTable, Pagination } from "@/components/UI";
import { Plus, X, Send, Bell } from "lucide-react";
import { DUMMY_NOTIFICATIONS, type DummyNotification } from "@/lib/dummyData";

export default function Notifikasi() {
  const [notifications, setNotifications] = useState<DummyNotification[]>(DUMMY_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const perPage = 5;

  const filtered = notifications.filter((item) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
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

    setNotifications([newItem, ...notifications]);
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
            Kirim Notifikasi
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

      {/* MODAL KIRIM NOTIFIKASI */}
      {isModalOpen && (
        <div
          className="om-overlay om-overlay--open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="om-card om-card--open" role="dialog" style={{ maxWidth: "480px" }}>
            <div className="om-header">
              <div className="om-header-icon">
                <Bell size={22} />
              </div>
              <div className="om-header-copy">
                <h2>Kirim Notifikasi Pelanggan</h2>
                <p>Broadcast pesan WhatsApp atau notifikasi pesanan pelanggan</p>
              </div>
              <button
                className="om-close"
                type="button"
                aria-label="Tutup"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNotification} style={{ padding: "20px 24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Judul Notifikasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pesanan #ORD-8929 Siap Diambil"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Isi Pesan Notifikasi
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Halo Kak [Nama Pelanggan], cucian Anda sudah selesai dikemas rapi..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>

              <div className="om-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="om-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="om-btn-submit">
                  <Send size={16} />
                  Kirim Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
