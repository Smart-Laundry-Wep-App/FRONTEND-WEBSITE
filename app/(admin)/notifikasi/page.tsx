"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { SearchBox, PrimaryButton, EmptyTable, Pagination } from "@/components/UI";
import { Plus, X, Send, Bell, MessageSquareText, UserRound, ChevronDown, Trash2 } from "lucide-react";
import api from "@/lib/api";

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  status: string;
}

interface CompletedOrder {
  id: string;
  customer: string;
}

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(record: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") {
      const stringValue = String(value).trim();
      if (stringValue) return stringValue;
    }
  }
  return "";
}

function getApiList(value: unknown, keys: string[]): ApiRecord[] {
  if (Array.isArray(value)) return value.filter(isRecord);
  if (!isRecord(value)) return [];

  for (const key of keys) {
    if (Array.isArray(value[key])) return value[key].filter(isRecord);
  }
  return isRecord(value.data) ? getApiList(value.data, keys) : [];
}

export default function Notifikasi() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const perPage = 5;

  function mapNotificationRows(value: unknown): AdminNotification[] {
    return getApiList(value, ["notifications"]).map((item) => {
      const createdAt = getString(item, ["createdAt", "created_at", "date"]);
      const deliveryStatus = getString(item, ["status"]);
      return {
        id: getString(item, ["id", "notificationId"]),
        title: getString(item, ["title"]),
        message: getString(item, ["message", "body"]),
        date: createdAt ? new Date(createdAt).toLocaleDateString("id-ID", {
          day: "2-digit", month: "short", year: "numeric",
        }).toUpperCase() : "",
        status: deliveryStatus === "Gagal" ? "Gagal" : "Terkirim",
      };
    });
  }

  useEffect(() => {
    let active = true;
    api.get<unknown>("/notifications", { params: { page: 1, limit: 100 } }).then((notificationResponse) => {
      if (!active) return;
      setNotifications(mapNotificationRows(notificationResponse.data));
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : "Gagal memuat notifikasi.");
    });

    return () => { active = false; };
  }, []);

  const filtered = notifications.filter((item) => {
    const q = search.trim().toLowerCase();
    return !q || Object.values(item).some((value) =>
      String(value).toLowerCase().includes(q),
    );
  });

  const visibleNotifications = filtered.slice((page - 1) * perPage, page * perPage);

  async function openNotificationModal() {
    setError("");
    setIsModalOpen(true);
    setIsLoadingOrders(true);
    setSelectedOrderId("");
    try {
      const response = await api.get<unknown>("/orders", {
        params: { page: 1, limit: 100 },
      });
      const orders = getApiList(response.data, ["orders"])
        .filter((order) => ["selesai", "antaran"].includes(
          getString(order, ["status"]).toLocaleLowerCase("id-ID"),
        ))
        .flatMap((order) => {
          const id = getString(order, ["id"]);
          const customer = getString(order, ["customer", "customerName", "customer_name"]);
          return id && customer ? [{ id, customer }] : [];
        });
      setCompletedOrders(orders);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal memuat pesanan selesai.");
    } finally {
      setIsLoadingOrders(false);
    }
  }

  async function handleAddNotification(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim() || !selectedOrderId) {
      setError("Pilih pesanan selesai, lalu isi judul dan pesan notifikasi.");
      return;
    }
    setIsSending(true);
    setError("");
    try {
      const sendResponse = await api.post<{ status: string }>("/notifications/send", {
        title: newTitle.trim(),
        message: newMessage.trim(),
        orderId: selectedOrderId,
      });
      setNewTitle("");
      setNewMessage("");
      setSelectedOrderId("");
      setIsModalOpen(false);
      setPage(1);
      try {
        const response = await api.get<unknown>("/notifications", { params: { page: 1, limit: 100 } });
        setNotifications(mapNotificationRows(response.data));
      } catch {
        setError("Notifikasi tercatat, tetapi daftar notifikasi gagal diperbarui.");
      }
      if (sendResponse.data.status === "Gagal") {
        setError("Notifikasi tercatat, tetapi pengiriman ke perangkat gagal.");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Notifikasi gagal dikirim.");
    } finally {
      setIsSending(false);
    }
  }

  async function deleteNotification(notification: AdminNotification) {
    if (!window.confirm(`Hapus notifikasi "${notification.title}"?`)) return;
    setDeletingId(notification.id);
    setError("");
    try {
      await api.delete(`/notifications/${encodeURIComponent(notification.id)}`);
      const remainingCount = filtered.length - 1;
      setNotifications((current) => current.filter((item) => item.id !== notification.id));
      setPage(Math.min(page, Math.max(1, Math.ceil(remainingCount / perPage))));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Notifikasi gagal dihapus.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <>
      <Header
        title="Kelola Notifikasi"
        subtitle="Kelola pesan notifikasi WhatsApp/SMS otomatis, status pesanan, dan promo pelanggan"
      />
      <section className="content notification-content">
        {error && <p className="order-error" role="alert">{error}</p>}
        <div className="toolbar notification-toolbar">
          <SearchBox
            placeholder="Cari Judul, Pesan, atau Pelanggan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <PrimaryButton icon={Plus} onClick={openNotificationModal}>
            Tambah Notifikasi
          </PrimaryButton>
        </div>

        <EmptyTable headers={["JUDUL", "PESAN NOTIFIKASI", "TANGGAL", "STATUS", "AKSI"]} rows={0}>
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
                <td>
                  <button
                    type="button"
                    className="order-delete-button order-delete-row"
                    onClick={() => void deleteNotification(r)}
                    disabled={deletingId === r.id}
                    aria-label={`Hapus notifikasi ${r.title}`}
                  >
                    <Trash2 size={16} />
                    {deletingId === r.id ? "Menghapus..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
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
            className="promo-modal notif-card-modal notif-modal-design"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notif-modal-title"
          >
            <header className="om-header">
              <div className="om-header-icon">
                <Bell size={22} />
              </div>
              <div className="om-header-copy">
                <h2 id="notif-modal-title">Kirim Notifikasi Pelanggan</h2>
                <p>Pilih pesanan dengan status selesai</p>
              </div>
              <button
                type="button"
                className="om-close"
                aria-label="Tutup"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <form className="om-form notif-modal-form" onSubmit={handleAddNotification} noValidate>
              <div className="om-field">
                <label htmlFor="notification-recipient">Pesanan Selesai</label>
                <div className="om-input-wrap om-select-wrap notif-select-wrap">
                  <span className="om-input-icon"><UserRound size={16} /></span>
                  <select
                    id="notification-recipient"
                    value={selectedOrderId}
                    disabled={isLoadingOrders || completedOrders.length === 0}
                    onChange={(event) => {
                      setSelectedOrderId(event.target.value);
                      setError("");
                    }}
                    required
                  >
                    <option value="">
                      {isLoadingOrders
                        ? "Memuat pesanan selesai..."
                        : completedOrders.length
                          ? "Pilih pelanggan dan pesanan"
                          : "Tidak ada pesanan selesai"}
                    </option>
                    {completedOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.customer} — {order.id}
                      </option>
                    ))}
                  </select>
                  <span className="om-select-arrow"><ChevronDown size={14} /></span>
                </div>
              </div>
              <div className="om-field">
                <label htmlFor="notification-title">Judul Notifikasi</label>
                <div className="om-input-wrap">
                  <span className="om-input-icon"><Bell size={16} /></span>
                  <input
                    id="notification-title"
                    type="text"
                    required
                    maxLength={80}
                    placeholder="Contoh: Pesanan #ORD-8929 Siap Diambil"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="om-field">
                <label htmlFor="notification-message">Isi Pesan Notifikasi</label>
                <div className="om-input-wrap notif-message-wrap">
                  <span className="om-input-icon"><MessageSquareText size={16} /></span>
                  <textarea
                    id="notification-message"
                    required
                    rows={4}
                    placeholder="Halo Kak [Nama Pelanggan], cucian Anda sudah selesai dikemas rapi dan siap diambil..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
              </div>

              <div className="om-actions">
                <button
                  type="button"
                  className="om-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="om-btn-submit"
                  disabled={isSending || isLoadingOrders || completedOrders.length === 0}
                >
                  <Send size={15} />
                  {isSending ? "Mengirim..." : "Kirim Sekarang"}
                </button>
              </div>
              {error && <p className="order-error" role="alert">{error}</p>}
            </form>
          </section>
        </div>
      )}
    </>
  );
}
