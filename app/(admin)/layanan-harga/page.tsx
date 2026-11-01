"use client";

import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import {
  StatCard,
  SearchBox,
  SecondaryButton,
  PrimaryButton,
  Pills,
  EmptyTable,
  Pagination,
} from "@/components/UI";
import { FileDown, ReceiptText } from "lucide-react";
import { DUMMY_SERVICES, type DummyService } from "@/lib/dummyData";

const SERVICE_PILLS = [
  "Semua Layanan",
  "Cuci Kiloan",
  "Cuci Satuan",
  "Express",
  "Khusus",
];

export default function LayananHarga() {
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("Semua Layanan");
  const [page, setPage] = useState(1);
  const [services, setServices] = useState<DummyService[]>(DUMMY_SERVICES);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const perPage = 5;

  const filteredServices = services.filter((service) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      service.name.toLowerCase().includes(q) ||
      service.category.toLowerCase().includes(q) ||
      service.price.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedPill === "Semua Layanan") return true;
    return service.category === selectedPill;
  });

  const visibleServices = filteredServices.slice((page - 1) * perPage, page * perPage);

  function exportServiceReport() {
    const header = ["ID", "Nama Layanan", "Kategori", "Estimasi Waktu", "Tarif", "Status"];
    const rows = filteredServices.map((service) => [service.id, service.name, service.category, service.estimatedTime, service.price, service.status]);
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-layanan.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setServices((current) => [{
      id: `srv-${Date.now().toString().slice(-6)}`,
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "Cuci Kiloan") as DummyService["category"],
      estimatedTime: String(formData.get("estimatedTime") ?? "").trim(),
      price: String(formData.get("price") ?? "").trim(),
      status: String(formData.get("status") ?? "Aktif") as DummyService["status"],
    }, ...current]);
    setIsServiceFormOpen(false);
    setSelectedPill("Semua Layanan");
    setPage(1);
  }

  return (
    <>
      <Header
        title="Layanan dan Harga"
        subtitle="Kelola data katalog, layanan cuci, kategori laundry, serta harga laundry"
      />

      <section className="content">
        {/* STATISTIK LAYANAN */}
        <div className="service-stat-grid">
          <StatCard
            label={<>TOTAL LAYANAN<br />AKTIF</>}
            value="16 Layanan"
            note="+2 bulan ini"
            icon="hand"
          />
          <StatCard
            label={<>KATEGORI<br />LAYANAN</>}
            value="4 Kategori"
            note="Kiloan, Satuan, Express, Khusus"
            icon="wash"
          />
          <StatCard
            label={<>RATA-RATA TARIF<br />KILOAN</>}
            value="Rp 9.500/kg"
            note="Standar Harga SCA Smart Laundry"
            icon="dollar"
          />
          <StatCard
            label={<>LAYANAN<br />TERLARIS</>}
            value={<>Cuci Kering<br />Setrika</>}
            note="68% Total Order Masuk"
            icon="shirt"
          />
        </div>

        {/* TOOLBAR */}
        <div className="toolbar service-toolbar">
          <SearchBox
            placeholder="Cari layanan laundry..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div className="service-action-cards">
            <button type="button" className="service-action-card" onClick={exportServiceReport}>
              <span className="service-action-icon"><FileDown size={20} /></span>
              <span><strong>Export CSV</strong><small>Unduh data layanan</small></span>
            </button>
            <button type="button" className="service-action-card" onClick={() => setIsServiceFormOpen(true)}>
              <span className="service-action-icon"><ReceiptText size={20} /></span>
              <span><strong>Tambah Layanan</strong><small>Daftar layanan baru</small></span>
            </button>
          </div>
        </div>

        {/* FILTER */}
        <Pills
          items={SERVICE_PILLS}
          active={SERVICE_PILLS.indexOf(selectedPill)}
          onChange={(index) => {
            setSelectedPill(SERVICE_PILLS[index]);
            setPage(1);
          }}
        />

        {/* TABLE */}
        <EmptyTable
          headers={[
            "NAMA LAYANAN",
            "KATEGORI LAUNDRY",
            "ESTIMASI WAKTU",
            "TARIF/HARGA",
            "STATUS",
          ]}
          rows={0}
        >
          {visibleServices.length > 0 ? (
            visibleServices.map((service) => (
              <tr key={service.id}>
                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                  <strong>{service.name}</strong>
                  <small>ID: {service.id}</small>
                </td>
                <td>
                  <span
                    className="promo-code-tag"
                    style={{
                      background: "#f0fdf4",
                      color: "#166534",
                      borderColor: "#86efac",
                      fontFamily: "inherit",
                      fontWeight: 600,
                    }}
                  >
                    {service.category}
                  </span>
                </td>
                <td>
                  <strong>{service.estimatedTime}</strong>
                </td>
                <td>
                  <strong style={{ color: "#1d4ed8", fontSize: "14px" }}>
                    {service.price}
                  </strong>
                </td>
                <td>
                  <span className={`status ${service.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {service.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                Tidak ada layanan yang sesuai pencarian.
              </td>
            </tr>
          )}
        </EmptyTable>

        <Pagination
          total={filteredServices.length}
          perPage={perPage}
          page={page}
          onPageChange={setPage}
        />
      </section>

      {isServiceFormOpen && (
        <div className="promo-modal-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsServiceFormOpen(false);
        }}>
          <form className="promo-modal-card" onSubmit={addService}>
            <div className="promo-modal-header">
              <div className="promo-modal-header-icon"><ReceiptText size={22} /></div>
              <div className="promo-modal-header-copy">
                <h2>Tambah Layanan</h2>
                <p>Isi detail layanan dan tarif laundry</p>
              </div>
              <button type="button" className="promo-modal-close" aria-label="Tutup" onClick={() => setIsServiceFormOpen(false)}>×</button>
            </div>
            <div className="promo-form-grid">
              <label>Nama Layanan<input name="name" required placeholder="Contoh: Cuci Kering Lipat" /></label>
              <label>Kategori<select name="category" defaultValue="Cuci Kiloan"><option>Cuci Kiloan</option><option>Cuci Satuan</option><option>Express</option><option>Khusus</option></select></label>
              <label>Estimasi Waktu<input name="estimatedTime" required placeholder="Contoh: 24 Jam" /></label>
              <label>Tarif<input name="price" required placeholder="Contoh: Rp 9.500 / kg" /></label>
              <label className="promo-form-full">Status<select name="status" defaultValue="Aktif"><option>Aktif</option><option>Non Aktif</option></select></label>
            </div>
            <div className="promo-modal-actions">
              <button type="button" className="promo-modal-cancel" onClick={() => setIsServiceFormOpen(false)}>Batal</button>
              <button type="submit" className="promo-modal-submit"><ReceiptText size={18} />Simpan Layanan</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}