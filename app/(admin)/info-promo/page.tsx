"use client";

import { useEffect, useState, type FormEvent } from "react";
import Header from "@/components/Header";
import {
  StatCard,
  SearchBox,
  SecondaryButton,
  Pills,
  EmptyTable,
  Pagination,
} from "@/components/UI";
import { CalendarDays, ClipboardList, Coins, FileDown, Plus, X, Megaphone, AlertCircle, Tag, Trash2 } from "lucide-react";
import api from "@/lib/api";
import type { DummyPromo } from "@/lib/dummyData";

const PROMO_PILLS = ["Semua", "Aktif", "Non Aktif"];

interface PromoModalProps {
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  existingCodes: string[];
}

type PromoField = "name" | "code" | "discount";

function PromoModal({ onClose, onSubmit, existingCodes }: PromoModalProps) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<PromoField, string>>>({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function validateField(field: PromoField, value: string) {
    let error = "";
    if (!value.trim()) {
      error = "Bagian ini wajib diisi.";
    } else if (field === "code" && !/^[A-Z0-9]+$/.test(value)) {
      error = "Kode promo hanya boleh berisi huruf dan angka.";
    }
    setFieldErrors((current) => ({ ...current, [field]: error }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fields: PromoField[] = ["name", "code", "discount"];
    const errors = Object.fromEntries(
      fields.map((field) => [field, (() => {
        const value = String(formData.get(field) ?? "");
        if (!value.trim()) return "Bagian ini wajib diisi.";
        if (field === "code" && !/^[A-Z0-9]+$/.test(value)) return "Kode promo hanya boleh berisi huruf dan angka.";
        return "";
      })()]),
    ) as Partial<Record<PromoField, string>>;
    const code = String(formData.get("code") ?? "").toUpperCase();
    if (existingCodes.some((existingCode) => existingCode.toUpperCase() === code)) {
      errors.code = "Kode promo sudah digunakan. Gunakan kode yang berbeda.";
    }
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    onSubmit(event);
  }

  function fieldError(field: PromoField) {
    return fieldErrors[field] ? (
      <small className="om-field-error"><AlertCircle size={13} />{fieldErrors[field]}</small>
    ) : null;
  }

  return (
    <div
      className={`om-overlay${visible ? " om-overlay--open" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={`om-card${visible ? " om-card--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="promo-modal-title">
        <header className="om-header">
          <div className="om-header-icon"><Megaphone size={22} /></div>
          <div className="om-header-copy">
            <h2 id="promo-modal-title">Tambah Promo Baru</h2>
            <p>Lengkapi detail promo dan periode berlakunya.</p>
          </div>
          <button type="button" className="om-close" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form className="om-form" onSubmit={handleSubmit} noValidate>
          <div className="om-row">
            <div className="om-field om-field--anim" style={{ "--i": 0 } as React.CSSProperties}>
              <label htmlFor="promo-name">Nama Promo</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><Megaphone size={16} /></span>
                <input id="promo-name" name="name" required maxLength={80} placeholder="Isi nama promo" onChange={(e) => validateField("name", e.currentTarget.value)} />
              </div>
              {fieldError("name")}
            </div>
            <div className="om-field om-field--anim" style={{ "--i": 1 } as React.CSSProperties}>
              <label htmlFor="promo-code">Kode Promo</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><Tag size={16} /></span>
                <input
                  id="promo-code"
                  name="code"
                  required
                  maxLength={24}
                  placeholder="Isi kode promo"
                  pattern="[A-Za-z0-9]+"
                  title="Kode promo hanya boleh berisi huruf dan angka."
                  onChange={(event) => {
                    event.currentTarget.value = event.currentTarget.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                    validateField("code", event.currentTarget.value);
                  }}
                />
              </div>
              {fieldError("code")}
            </div>
          </div>
          <div className="om-row">
            <div className="om-field om-field--anim" style={{ "--i": 2 } as React.CSSProperties}>
              <label htmlFor="promo-discount">Diskon</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><Coins size={16} /></span>
                <input id="promo-discount" name="discount" required maxLength={60} placeholder="Contoh: 20% atau Rp 10.000" onChange={(e) => validateField("discount", e.currentTarget.value)} />
              </div>
              {fieldError("discount")}
            </div>
            <div className="om-field om-field--anim" style={{ "--i": 3 } as React.CSSProperties}>
              <label htmlFor="promo-period">Periode Berlaku</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><CalendarDays size={16} /></span>
                <input id="promo-period" name="period" type="date" />
              </div>
            </div>
          </div>
          <div className="om-field om-field--anim" style={{ "--i": 4 } as React.CSSProperties}>
            <label htmlFor="promo-status">Status</label>
            <div className="om-input-wrap om-select-wrap">
              <span className="om-input-icon"><ClipboardList size={16} /></span>
              <select id="promo-status" name="status" defaultValue="Aktif">
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>
          <div className="om-actions">
            <button type="button" className="om-btn-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="om-btn-submit">Simpan Promo</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export default function InfoPromo() {
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("Semua");
  const [page, setPage] = useState(1);
  const [promos, setPromos] = useState<DummyPromo[]>([]);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [promoStats, setPromoStats] = useState<{
    totalActivePromos: { value: string; note: string };
    totalClaims: { value: string; note: string };
    estimatedCustomerSavings: { value: string; note: string };
    mostUsedCoupon: { value: string; note: string };
  } | null>(null);
  const perPage = 5;

  async function loadPromos() {
    try {
      const [promoResponse, statsResponse] = await Promise.all([
        api.get<Array<{
          id: string; title: string; code: string; discountType: string; discountValue: number;
          maxDiscount: number; validUntil: string | null; isActive: boolean;
        }>>("/promos"),
        api.get<typeof promoStats>("/promos/stats"),
      ]);
      setPromos(promoResponse.data.map((promo) => ({
        id: promo.id,
        name: promo.title,
        code: promo.code,
        discount: promo.discountType === "percentage"
          ? `${promo.discountValue}%${promo.maxDiscount ? ` (Maks. Rp ${promo.maxDiscount.toLocaleString("id-ID")})` : ""}`
          : `Potongan Rp ${promo.discountValue.toLocaleString("id-ID")}`,
        period: promo.validUntil ? new Date(promo.validUntil).toLocaleDateString("id-ID") : "Tidak dibatasi",
        status: promo.isActive ? "Aktif" : "Non Aktif",
      })));
      setPromoStats(statsResponse.data);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal memuat promo.");
    }
  }

  useEffect(() => { void loadPromos(); }, []);

  const filteredPromos = promos.filter((promo) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || Object.values(promo).some((value) =>
      String(value).toLowerCase().includes(q),
    );

    if (!matchesSearch) return false;
    if (selectedPill === "Semua") return true;
    return promo.status === selectedPill;
  });

  const promoPillItems = PROMO_PILLS.map((status) => {
    const count =
      status === "Semua"
        ? promos.length
        : promos.filter((promo) => promo.status === status).length;
    return `${status} (${count})`;
  });

  const visiblePromos = filteredPromos.slice((page - 1) * perPage, page * perPage);

  function exportReport() {
    const rows = [
      ["ID Promo", "Nama Promo", "Kode Promo", "Diskon", "Periode Berlaku", "Status"],
      ...filteredPromos.map((promo) => [
        promo.id,
        promo.name,
        promo.code,
        promo.discount,
        promo.period,
        promo.status,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-promo-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function addPromo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim().toUpperCase();
    const discount = String(formData.get("discount") ?? "").trim();
    const period = String(formData.get("period") ?? "").trim();
    const status = formData.get("status") === "Non Aktif" ? "Non Aktif" : "Aktif";
    if (promos.some((promo) => promo.code.toUpperCase() === code)) {
      window.alert("Kode promo sudah digunakan. Gunakan kode yang berbeda.");
      return;
    }

    const discountValue = Number(discount.replace(/[^\d]/g, ""));
    if (!discountValue || (discount.includes("%") && discountValue > 100)) {
      setError("Diskon harus berupa persentase (maksimal 100%) atau nominal Rupiah.");
      return;
    }
    try {
      await api.post("/promos", {
        title: name,
        code,
        discountType: discount.includes("%") ? "percentage" : "fixed",
        discountValue,
        maxDiscount: 0,
        validUntil: period || null,
        isActive: status === "Aktif",
      });
      await loadPromos();
      setSearch("");
      setSelectedPill("Semua");
      setPage(1);
      setIsPromoModalOpen(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Promo gagal disimpan.");
    }
  }

  async function togglePromo(promo: DummyPromo) {
    try {
      await api.put(`/promos/${encodeURIComponent(promo.id)}`, { isActive: promo.status !== "Aktif" });
      await loadPromos();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Status promo gagal diperbarui.");
    }
  }

  async function deletePromo(promo: DummyPromo) {
    if (!window.confirm(`Hapus promo "${promo.name}"?`)) return;
    try {
      await api.delete(`/promos/${encodeURIComponent(promo.id)}`);
      await loadPromos();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Promo gagal dihapus.");
    }
  }

  return (
    <>
      <Header
        title="Info Promo"
        subtitle="Kelola kupon diskon, voucher pelanggan, dan periode promosi laundry"
      />

      <section className="content">
        {error && <p className="order-error" role="alert">{error}</p>}
        {/* STATISTIK PROMO */}
        <div className="promo-stat-grid">
          <StatCard
            label={<>TOTAL PROMO<br />AKTIF</>}
            value={promoStats?.totalActivePromos.value ?? "—"}
            note={promoStats?.totalActivePromos.note ?? ""}
            icon="megaphone"
          />
          <StatCard
            label={<>TOTAL KLAIM<br />VOUCHER</>}
            value={promoStats?.totalClaims.value ?? "—"}
            note={promoStats?.totalClaims.note ?? ""}
            icon="ticket"
          />
          <StatCard
            label={<>ESTIMASI HEMAT<br />PELANGGAN</>}
            value={promoStats?.estimatedCustomerSavings.value ?? "—"}
            note={promoStats?.estimatedCustomerSavings.note ?? ""}
            icon="percent"
          />
          <StatCard
            label={<>PROMO<br />TERPOPULER</>}
            value={promoStats?.mostUsedCoupon.value ?? "—"}
            note={promoStats?.mostUsedCoupon.note ?? ""}
            icon="percent"
          />
        </div>

        {/* TOOLBAR */}
        <div className="toolbar promo-toolbar">
          <SearchBox
            placeholder="Cari promo atau kode voucher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div className="button-group">
            <SecondaryButton icon={FileDown} type="button" onClick={exportReport}>EXPORT LAPORAN</SecondaryButton>
            <SecondaryButton icon={Plus} type="button" onClick={() => setIsPromoModalOpen(true)}>PROMO BARU</SecondaryButton>
          </div>
        </div>

        {/* FILTER */}
        <Pills
          items={promoPillItems}
          active={PROMO_PILLS.indexOf(selectedPill)}
          onChange={(index) => {
            setSelectedPill(PROMO_PILLS[index]);
            setPage(1);
          }}
        />

        {/* TABLE */}
        <EmptyTable
          headers={["NAMA PROMO", "KODE PROMO", "DISKON", "PERIODE BERLAKU", "STATUS", "AKSI"]}
          rows={0}
        >
          {visiblePromos.length > 0 ? (
            visiblePromos.map((promo) => (
              <tr key={promo.id}>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  <strong>{promo.name}</strong>
                  <small>ID: {promo.id}</small>
                </td>
                <td>
                  <span className="promo-code-tag">{promo.code}</span>
                </td>
                <td>
                  <strong>{promo.discount}</strong>
                </td>
                <td>
                  <strong style={{ fontSize: "12px" }}>{promo.period}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    className={`status ${promo.status.toLowerCase().replaceAll(" ", "-")}`}
                    onClick={() => void togglePromo(promo)}
                    aria-label={`${promo.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"} promo ${promo.code}`}
                  >
                    {promo.status}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="order-delete-button order-delete-row"
                    onClick={() => void deletePromo(promo)}
                    aria-label={`Hapus promo ${promo.code}`}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                Tidak ada data promo yang sesuai.
              </td>
            </tr>
          )}
        </EmptyTable>

        <Pagination
          total={filteredPromos.length}
          perPage={perPage}
          page={page}
          onPageChange={setPage}
        />
      </section>
      {isPromoModalOpen && (
        <PromoModal
          onClose={() => setIsPromoModalOpen(false)}
          onSubmit={addPromo}
          existingCodes={promos.map((promo) => promo.code)}
        />
      )}
    </>
  );
}