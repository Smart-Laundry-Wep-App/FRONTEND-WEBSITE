"use client";

import { useEffect, useMemo, useState, useRef, type FormEvent } from "react";
import { X, User, Phone, WashingMachine, Scale, Coins, CheckCircle2, AlertCircle, Plus, ClipboardList, ChevronDown } from "lucide-react";
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

/* ─── ADD ORDER MODAL ─── */
interface AddOrderModalProps {
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formError: string;
}

function AddOrderModal({ onClose, onSubmit, formError }: AddOrderModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [weight, setWeight] = useState(1);
  const [price, setPrice] = useState(9500);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const total = weight * price;

  return (
    <div
      ref={overlayRef}
      className={`om-overlay${visible ? " om-overlay--open" : ""}`}
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className={`om-card${visible ? " om-card--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="om-title"
      >
        {/* ── Header ── */}
        <div className="om-header">
          <div className="om-header-icon">
            <ClipboardList size={22} strokeWidth={2} />
          </div>
          <div className="om-header-copy">
            <h2 id="om-title">Tambah Pesanan</h2>
            <p>Isi data pelanggan &amp; detail layanan laundry</p>
          </div>
          <button className="om-close" type="button" aria-label="Tutup" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* ── Form ── */}
        <form className="om-form" onSubmit={onSubmit} noValidate>

          {/* Row 1: Nama + Telepon */}
          <div className="om-row">
            <div className="om-field om-field--anim" style={{ "--i": 0 } as React.CSSProperties}>
              <label htmlFor="om-customer">Nama Pelanggan</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><User size={16} /></span>
                <input
                  id="om-customer"
                  name="customer"
                  required
                  maxLength={80}
                  placeholder="Nama lengkap pelanggan"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="om-field om-field--anim" style={{ "--i": 1 } as React.CSSProperties}>
              <label htmlFor="om-phone">Nomor Telepon</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><Phone size={16} /></span>
                <input
                  id="om-phone"
                  name="phone"
                  required
                  maxLength={20}
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Layanan + Status */}
          <div className="om-row">
            <div className="om-field om-field--anim" style={{ "--i": 2 } as React.CSSProperties}>
              <label htmlFor="om-service">Jenis Layanan</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><WashingMachine size={16} /></span>
                <input
                  id="om-service"
                  name="service"
                  required
                  maxLength={80}
                  placeholder="Contoh: Cuci Kering Setrika"
                />
              </div>
            </div>
            <div className="om-field om-field--anim" style={{ "--i": 3 } as React.CSSProperties}>
              <label htmlFor="om-status">Status Pesanan</label>
              <div className="om-input-wrap om-select-wrap">
                <span className="om-input-icon"><CheckCircle2 size={16} /></span>
                <select id="om-status" name="status" defaultValue="Sedang Cuci">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="om-select-arrow"><ChevronDown size={14} /></span>
              </div>
            </div>
          </div>

          {/* Row 3: Berat + Tarif */}
          <div className="om-row">
            <div className="om-field om-field--anim" style={{ "--i": 4 } as React.CSSProperties}>
              <label htmlFor="om-weight">Berat (kg)</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><Scale size={16} /></span>
                <input
                  id="om-weight"
                  name="weight"
                  required
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0.1, Number(e.target.value)))}
                />
                <span className="om-input-suffix">kg</span>
              </div>
            </div>
            <div className="om-field om-field--anim" style={{ "--i": 5 } as React.CSSProperties}>
              <label htmlFor="om-price">Tarif per kg</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><Coins size={16} /></span>
                <input
                  id="om-price"
                  name="pricePerKg"
                  required
                  type="number"
                  min="1"
                  step="500"
                  value={price}
                  onChange={(e) => setPrice(Math.max(1, Number(e.target.value)))}
                />
                <span className="om-input-suffix">/ kg</span>
              </div>
            </div>
          </div>

          {/* Live total */}
          <div className="om-total om-field--anim" style={{ "--i": 6 } as React.CSSProperties}>
            <div className="om-total-label">
              <span>Estimasi Total</span>
              <span className="om-total-formula">{weight} kg × {formatRupiah(price)}</span>
            </div>
            <div className="om-total-value">{formatRupiah(total)}</div>
          </div>

          {/* Error */}
          {formError && (
            <div className="om-error" role="alert">
              <AlertCircle size={15} />
              <span>{formError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="om-actions">
            <button type="button" className="om-btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="om-btn-submit">
              <Plus size={18} />
              Simpan Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
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
          headers={["ID PELANGGAN", "PELANGGAN", "LAYANAN STATUS", "STATUS"]}
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
                <small>{order.weight} kg · {formatRupiah(order.weight * order.pricePerKg)}</small>
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
                {orders.length
                  ? "Tidak ada pesanan yang cocok."
                  : "Belum ada pesanan. Klik \u201cTambah Pesanan\u201d untuk mulai mencatat."}
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
        <AddOrderModal
          onClose={() => setIsFormOpen(false)}
          onSubmit={addOrder}
          formError={formError}
        />
      )}
    </>
  );
}
