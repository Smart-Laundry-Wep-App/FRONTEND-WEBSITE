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
import { AlertCircle, Check, FileDown, Plus, ReceiptText, X } from "lucide-react";
import { DUMMY_SERVICES, type DummyService } from "@/lib/dummyData";

const SERVICE_PILLS = [
  "Semua Layanan",
  "Cuci Kiloan",
  "Cuci Satuan",
  "Express",
  "Khusus",
];

type ServiceField = "name" | "estimatedTime" | "price";

interface ServiceModalProps {
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function ServiceModal({ onClose, onSubmit }: ServiceModalProps) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ServiceField, string>>>({});

  function validateField(field: ServiceField, value: string) {
    setFieldErrors((current) => ({
      ...current,
      [field]: value.trim() ? "" : "Bagian ini wajib diisi.",
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const errors: Partial<Record<ServiceField, string>> = {};
    for (const field of ["name", "estimatedTime", "price"] as const) {
      if (!String(formData.get(field) ?? "").trim()) {
        errors[field] = "Bagian ini wajib diisi.";
      }
    }
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    onSubmit(event);
  }

  function fieldError(field: ServiceField) {
    return fieldErrors[field] ? (
      <small className="promo-field-error"><AlertCircle size={13} />{fieldErrors[field]}</small>
    ) : null;
  }

  return (
    <div className="promo-modal-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="promo-modal" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
        <header className="promo-modal-header">
          <div className="promo-modal-icon"><ReceiptText size={22} /></div>
          <div>
            <h2 id="service-modal-title">Tambah Layanan</h2>
            <p>Lengkapi detail layanan dan tarif laundry.</p>
          </div>
          <button type="button" className="promo-modal-close" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <form className="promo-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="promo-modal-row">
            <label>
              Nama Layanan
              <input name="name" required maxLength={80} placeholder="Contoh: Cuci Kering Lipat" onChange={(event) => validateField("name", event.currentTarget.value)} />
              {fieldError("name")}
            </label>
            <label>
              Kategori
              <select name="category" defaultValue="Cuci Kiloan">
                {SERVICE_PILLS.slice(1).map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
          </div>
          <div className="promo-modal-row">
            <label>
              Estimasi Waktu
              <input name="estimatedTime" required maxLength={40} placeholder="Contoh: 24 Jam" onChange={(event) => validateField("estimatedTime", event.currentTarget.value)} />
              {fieldError("estimatedTime")}
            </label>
            <label>
              Tarif
              <input name="price" required maxLength={40} placeholder="Contoh: Rp 9.500 / kg" onChange={(event) => validateField("price", event.currentTarget.value)} />
              {fieldError("price")}
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
            <button type="submit" className="promo-modal-submit"><Check size={18} />Simpan Layanan</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export default function LayananHarga() {
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("Semua Layanan");
  const [page, setPage] = useState(1);
  const [services, setServices] = useState<DummyService[]>(DUMMY_SERVICES);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const perPage = 5;

  const filteredServices = services.filter((service) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || Object.values(service).some((value) =>
      String(value).toLowerCase().includes(q),
    );

    if (!matchesSearch) return false;
    if (selectedPill === "Semua Layanan") return true;
    return service.category === selectedPill;
  });

  const visibleServices = filteredServices.slice((page - 1) * perPage, page * perPage);

  function exportServices() {
    const rows = [
      ["ID Layanan", "Nama Layanan", "Kategori Laundry", "Estimasi Waktu", "Tarif/Harga", "Status"],
      ...filteredServices.map((service) => [
        service.id,
        service.name,
        service.category,
        service.estimatedTime,
        service.price,
        service.status,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `layanan-laundry-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newService: DummyService = {
      id: `srv-${Date.now()}`,
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "Cuci Kiloan") as DummyService["category"],
      estimatedTime: String(formData.get("estimatedTime") ?? "").trim(),
      price: String(formData.get("price") ?? "").trim(),
      status: formData.get("status") === "Non Aktif" ? "Non Aktif" : "Aktif",
    };
    setServices((current) => [newService, ...current]);
    setSearch("");
    setSelectedPill("Semua Layanan");
    setPage(1);
    setIsServiceModalOpen(false);
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
          <SecondaryButton icon={FileDown} type="button" onClick={exportServices}>EXPORT CSV</SecondaryButton>
          <SecondaryButton icon={ReceiptText} type="button" onClick={() => setIsServiceModalOpen(true)}>TAMBAH LAYANAN</SecondaryButton>
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
      {isServiceModalOpen && (
        <ServiceModal
          onClose={() => setIsServiceModalOpen(false)}
          onSubmit={addService}
        />
      )}
    </>
  );
}