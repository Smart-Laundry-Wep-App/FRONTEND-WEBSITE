"use client";

import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import {
  StatCard,
  SearchBox,
  SecondaryButton,
  Pills,
  EmptyTable,
  Pagination,
} from "@/components/UI";
import { FileDown, Plus, X, Megaphone, AlertCircle } from "lucide-react";
import { DUMMY_PROMOS, type DummyPromo } from "@/lib/dummyData";

const PROMO_PILLS = ["Semua", "Aktif", "Non Aktif"];

interface PromoModalProps {
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  existingCodes: string[];
}

type PromoField = "name" | "code" | "discount" | "period";

function PromoModal({ onClose, onSubmit, existingCodes }: PromoModalProps) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<PromoField, string>>>({});

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
    const fields: PromoField[] = ["name", "code", "discount", "period"];
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
      <small className="promo-field-error"><AlertCircle size={13} />{fieldErrors[field]}</small>
    ) : null;
  }

  return (
    <div className="promo-modal-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="promo-modal promo-card-modal" role="dialog" aria-modal="true" aria-labelledby="promo-modal-title">
        <header className="promo-modal-header">
          <div className="promo-modal-icon"><Megaphone size={22} /></div>
          <div>
            <h2 id="promo-modal-title">Tambah Promo Baru</h2>
            <p>Lengkapi detail promo dan periode berlakunya.</p>
          </div>
          <button type="button" className="promo-modal-close" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form className="promo-modal-form" onSubmit={handleSubmit} noValidate>
          <label>
            Nama Promo
            <input name="name" required maxLength={80} placeholder="Isi nama promo" onChange={(e) => validateField("name", e.currentTarget.value)} />
            {fieldError("name")}
          </label>
          <label>
            Kode Promo
            <input
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
            {fieldError("code")}
          </label>
          <div className="promo-modal-row">
            <label>
              Diskon
              <input name="discount" required maxLength={60} placeholder="Contoh: 20% atau Rp 10.000" onChange={(e) => validateField("discount", e.currentTarget.value)} />
              {fieldError("discount")}
            </label>
            <label>
              Periode Berlaku
              <input name="period" required maxLength={60} placeholder="Contoh: 01 - 31 Des 2026" onChange={(e) => validateField("period", e.currentTarget.value)} />
              {fieldError("period")}
            </label>
          </div>
          <label>
            Status
            <select name="status" defaultValue="Aktif">
              <option value="Aktif">Aktif</option>
              <option value="Non Aktif">Non Aktif</option>
            </select>
          </label>
          <div className="promo-modal-actions">
            <button type="button" className="promo-modal-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="promo-modal-submit">Simpan Promo</button>
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
  const [promos, setPromos] = useState<DummyPromo[]>(DUMMY_PROMOS);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const perPage = 5;

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

  function addPromo(event: FormEvent<HTMLFormElement>) {
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

    const newPromo: DummyPromo = {
      id: `prm-${Date.now()}`,
      name,
      code,
      discount,
      period,
      status,
    };

    setPromos((current) => [newPromo, ...current]);
    setSearch("");
    setSelectedPill("Semua");
    setPage(1);
    setIsPromoModalOpen(false);
  }

  return (
    <>
      <Header
        title="Info Promo"
        subtitle="Kelola kupon diskon, voucher pelanggan, dan periode promosi laundry"
      />

      <section className="content">
        {/* STATISTIK PROMO */}
        <div className="promo-stat-grid">
          <StatCard
            label={<>TOTAL PROMO<br />AKTIF</>}
            value="8 Promo"
            note="+2 bulan ini"
            icon="megaphone"
          />
          <StatCard
            label={<>TOTAL KLAIM<br />VOUCHER</>}
            value="1.425 x"
            note="Meningkat 18%"
            icon="ticket"
          />
          <StatCard
            label={<>ESTIMASI HEMAT<br />PELANGGAN</>}
            value="Rp 12.850.000"
            note="Total subsidi diskon"
            icon="percent"
          />
          <StatCard
            label={<>PROMO<br />TERPOPULER</>}
            value={<>KILATHEMAT<br />(25%)</>}
            note="420x digunakan di pesanan"
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
          headers={["NAMA PROMO", "KODE PROMO", "DISKON", "PERIODE BERLAKU", "STATUS"]}
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
                  <span className={`status ${promo.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {promo.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
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