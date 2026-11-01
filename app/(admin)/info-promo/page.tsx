"use client";

import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import {
  StatCard,
  SearchBox,
  Pills,
  EmptyTable,
  Pagination,
} from "@/components/UI";
import { FileDown, Plus } from "lucide-react";
import { DUMMY_PROMOS, type DummyPromo } from "@/lib/dummyData";

const PROMO_PILLS = ["Semua", "Aktif", "Non Aktif"];

export default function InfoPromo() {
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("Semua");
  const [page, setPage] = useState(1);
  const [promos, setPromos] = useState<DummyPromo[]>(DUMMY_PROMOS);
  const [isPromoFormOpen, setIsPromoFormOpen] = useState(false);
  const perPage = 5;

  const filteredPromos = promos.filter((promo) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      promo.name.toLowerCase().includes(q) ||
      promo.code.toLowerCase().includes(q) ||
      promo.discount.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedPill === "Semua") return true;
    return promo.status === selectedPill;
  });

  const visiblePromos = filteredPromos.slice((page - 1) * perPage, page * perPage);

  function exportPromoReport() {
    const header = ["ID", "Nama Promo", "Kode Promo", "Diskon", "Periode", "Status"];
    const rows = filteredPromos.map((promo) => [
      promo.id,
      promo.name,
      promo.code,
      promo.discount,
      promo.period,
      promo.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-promo.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function addPromo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPromo: DummyPromo = {
      id: `prm-${Date.now().toString().slice(-6)}`,
      name: String(formData.get("name") ?? "").trim(),
      code: String(formData.get("code") ?? "").trim().toUpperCase(),
      discount: String(formData.get("discount") ?? "").trim(),
      period: String(formData.get("period") ?? "").trim(),
      status: String(formData.get("status") ?? "Aktif") as DummyPromo["status"],
    };
    setPromos((current) => [newPromo, ...current]);
    setIsPromoFormOpen(false);
    setSelectedPill("Semua");
    setPage(1);
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
          <div className="promo-action-cards">
            <button type="button" className="promo-action-card" onClick={exportPromoReport}>
              <span className="promo-action-icon"><FileDown size={20} /></span>
              <span>
                <strong>Export Laporan</strong>
                <small>Unduh data promo CSV</small>
              </span>
            </button>
            <button type="button" className="promo-action-card" onClick={() => setIsPromoFormOpen(true)}>
              <span className="promo-action-icon"><Plus size={21} /></span>
              <span>
                <strong>Promo Baru</strong>
                <small>Tambah promosi baru</small>
              </span>
            </button>
          </div>
        </div>

        {/* FILTER */}
        <Pills
          items={PROMO_PILLS}
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

      {isPromoFormOpen && (
        <div className="promo-modal-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsPromoFormOpen(false);
        }}>
          <form className="promo-modal-card" onSubmit={addPromo}>
            <div className="promo-modal-header">
              <div className="promo-modal-header-icon"><Plus size={22} /></div>
              <div className="promo-modal-header-copy">
                <h2>Tambah Promo</h2>
                <p>Isi detail kupon diskon dan periode promosi</p>
              </div>
              <button type="button" className="promo-modal-close" aria-label="Tutup" onClick={() => setIsPromoFormOpen(false)}>×</button>
            </div>

            <div className="promo-form-grid">
              <label>
                Nama Promo
                <input name="name" required placeholder="Contoh: Diskon Akhir Pekan" />
              </label>
              <label>
                Kode Promo
                <input name="code" required placeholder="Contoh: WEEKENDHEMAT" />
              </label>
              <label>
                Diskon
                <input name="discount" required placeholder="Contoh: 20% atau Rp 10.000" />
              </label>
              <label>
                Periode Berlaku
                <input name="period" required placeholder="Contoh: 01 - 31 Des 2026" />
              </label>
              <label className="promo-form-full">
                Status
                <select name="status" defaultValue="Aktif">
                  <option value="Aktif">Aktif</option>
                  <option value="Non Aktif">Non Aktif</option>
                </select>
              </label>
            </div>

            <div className="promo-modal-actions">
              <button type="button" className="promo-modal-cancel" onClick={() => setIsPromoFormOpen(false)}>Batal</button>
              <button type="submit" className="promo-modal-submit"><Plus size={18} />Simpan Promo</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}