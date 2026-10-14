"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import Header from "@/components/Header";
import {
  SearchBox,
  PrimaryButton,
  Pills,
  EmptyTable,
  Pagination,
} from "@/components/UI";

const STORAGE_KEY = "sca-smart-laundry-orders";
const STATUSES = ["Sedang Cuci", "Pengantaran", "Siap Diambil", "Antaran"];
const ITEMS_PER_PAGE = 5;

interface LaundryOrder {
  id: string;
  customer: string;
  phone: string;
  service: string;
  weight: number;
  pricePerKg: number;
  status: string;
  createdAt: string;
}

function isLaundryOrder(value: unknown): value is LaundryOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<LaundryOrder>;
  return (
    typeof order.id === "string" &&
    typeof order.customer === "string" &&
    typeof order.phone === "string" &&
    typeof order.service === "string" &&
    typeof order.weight === "number" &&
    typeof order.pricePerKg === "number" &&
    typeof order.status === "string" &&
    typeof order.createdAt === "string"
  );
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function KelolaPesanan() {
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [storageError, setStorageError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    try {
      const savedOrders = window.localStorage.getItem(STORAGE_KEY);
      if (savedOrders) {
        const parsed: unknown = JSON.parse(savedOrders);
        if (!Array.isArray(parsed) || !parsed.every(isLaundryOrder)) {
          throw new Error("Format data pesanan tidak valid.");
        }
        setOrders(parsed);
      }
    } catch (error) {
      console.error("Gagal membaca data pesanan:", error);
      setStorageError("Data pesanan tidak dapat dibaca dari browser.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Gagal menyimpan data pesanan:", error);
      setStorageError("Pesanan gagal disimpan. Periksa ruang penyimpanan browser Anda.");
    }
  }, [isLoaded, orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [order.id, order.customer, order.phone, order.service].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesStatus = statusFilter === "Semua" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const visibleOrders = filteredOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  function selectStatus(status: string) {
    setStatusFilter(status);
    setPage(1);
  }

  function addOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const customer = String(formData.get("customer") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const weight = Number(formData.get("weight"));
    const pricePerKg = Number(formData.get("pricePerKg"));
    const status = String(formData.get("status") ?? "");

    if (!customer || !phone || !service || !STATUSES.includes(status)) {
      setFormError("Lengkapi semua data pesanan dengan benar.");
      return;
    }
    if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(pricePerKg) || pricePerKg <= 0) {
      setFormError("Berat dan tarif harus lebih besar dari 0.");
      return;
    }

    const newOrder: LaundryOrder = {
      id: `ORD-${Date.now().toString().slice(-8)}`,
      customer,
      phone,
      service,
      weight,
      pricePerKg,
      status,
      createdAt: new Date().toISOString(),
    };

    setOrders((current) => [newOrder, ...current]);
    setSearch("");
    setStatusFilter("Semua");
    setPage(1);
    setIsFormOpen(false);
    event.currentTarget.reset();
  }

  function updateStatus(id: string, status: string) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  }

  return (
    <>
      <Header
        title="Kelola Pesanan"
        subtitle="Kelola pesanan masuk, pantau status pengerjaan, dan atur jadwal pengantaran pelanggan"
      />

      <section className="content">
        <div className="toolbar order-toolbar">
          <SearchBox
            placeholder="Cari pesanan (No. order, nama pelanggan, layanan...)"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <select
            className="order-status-select"
            aria-label="Filter status pesanan"
            value={statusFilter}
            onChange={(event) => selectStatus(event.target.value)}
          >
            <option value="Semua">Semua Status</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <PrimaryButton type="button" onClick={() => {
            setFormError("");
            setIsFormOpen(true);
          }}>
            Tambah Pesanan
          </PrimaryButton>
        </div>

        {storageError && <p className="order-error" role="alert">{storageError}</p>}

        <Pills
          items={[
            `Semua (${orders.length})`,
            ...STATUSES.map(
              (status) => `${status} (${orders.filter((order) => order.status === status).length})`,
            ),
          ]}
          active={Math.max(0, STATUSES.indexOf(statusFilter) + 1)}
          onChange={(index) => selectStatus(index === 0 ? "Semua" : STATUSES[index - 1])}
        />

        <EmptyTable
          headers={[
            "NO. PELANGGAN",
            "PELANGGAN",
            "LAYANAN STATUS",
            "STATUS",
          ]}
          rows={0}
        >
          {visibleOrders.length ? visibleOrders.map((order) => (
            <tr key={order.id}>
              <td>
                <strong>{order.id}</strong>
                <small>{new Date(order.createdAt).toLocaleDateString("id-ID")}</small>
              </td>
              <td>
                <strong>{order.customer}</strong>
                <small>{order.phone}</small>
              </td>
              <td>
                <strong>{order.service}</strong>
                <small>
                  {order.weight} kg · {formatRupiah(order.weight * order.pricePerKg)}
                </small>
              </td>
              <td>
                <select
                  className="order-row-status"
                  aria-label={`Status pesanan ${order.id}`}
                  value={order.status}
                  onChange={(event) => updateStatus(order.id, event.target.value)}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          )) : (
            <tr>
              <td className="order-empty" colSpan={4}>
                {orders.length ? "Tidak ada pesanan yang cocok." : "Belum ada pesanan. Klik “Tambah Pesanan” untuk mulai mencatat."}
              </td>
            </tr>
          )}
        </EmptyTable>

        <Pagination
          total={filteredOrders.length}
          perPage={ITEMS_PER_PAGE}
          page={page}
          onPageChange={setPage}
        />
      </section>

      {isFormOpen && (
        <div
          className="modal-overlay open"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsFormOpen(false);
          }}
        >
          <div
            className="modal-content order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-order-title"
          >
            <div className="order-modal-heading">
              <div>
                <h2 id="add-order-title">Tambah Pesanan</h2>
                <p>Masukkan data pelanggan dan detail layanan laundry.</p>
              </div>
              <button
                className="order-modal-close"
                type="button"
                aria-label="Tutup form"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form className="order-form" onSubmit={addOrder}>
              <div className="order-form-grid">
                <label>
                  Nama pelanggan
                  <input name="customer" required maxLength={80} placeholder="Nama lengkap pelanggan" />
                </label>
                <label>
                  Nomor telepon
                  <input name="phone" required maxLength={20} type="tel" placeholder="08xxxxxxxxxx" />
                </label>
                <label>
                  Layanan
                  <input name="service" required maxLength={80} placeholder="Contoh: Cuci Kering Setrika" />
                </label>
                <label>
                  Status pesanan
                  <select name="status" defaultValue="Sedang Cuci">
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Berat (kg)
                  <input name="weight" required type="number" min="0.1" step="0.1" defaultValue="1" />
                </label>
                <label>
                  Tarif per kg (Rp)
                  <input name="pricePerKg" required type="number" min="1" step="500" defaultValue="9500" />
                </label>
              </div>
              <p className="order-total-note">Total dihitung otomatis dari berat × tarif per kg.</p>
              {formError && <p className="order-error" role="alert">{formError}</p>}
              <div className="order-form-actions">
                <button className="secondary-button" type="button" onClick={() => setIsFormOpen(false)}>
                  Batal
                </button>
                <PrimaryButton type="submit">Simpan Pesanan</PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
