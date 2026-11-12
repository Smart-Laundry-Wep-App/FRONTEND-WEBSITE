"use client";

import { useEffect, useState, type FormEvent } from "react";
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
import { AlertCircle, ClipboardList, Clock3, Coins, FileDown, Plus, ReceiptText, Trash2, WashingMachine, X } from "lucide-react";
import { api } from "@/lib/api";
import type { DummyService } from "@/lib/dummyData";

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      <section className={`om-card${visible ? " om-card--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
        <header className="om-header">
          <div className="om-header-icon"><ReceiptText size={22} /></div>
          <div className="om-header-copy">
            <h2 id="service-modal-title">Tambah Layanan</h2>
            <p>Lengkapi detail layanan dan tarif laundry.</p>
          </div>
          <button type="button" className="om-close" aria-label="Tutup" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <form className="om-form" onSubmit={handleSubmit} noValidate>
          <div className="om-row">
            <div className="om-field om-field--anim" style={{ "--i": 0 } as React.CSSProperties}>
              <label htmlFor="service-name">Nama Layanan</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><WashingMachine size={16} /></span>
                <input id="service-name" name="name" required maxLength={80} placeholder="Contoh: Cuci Kering Lipat" onChange={(event) => validateField("name", event.currentTarget.value)} />
              </div>
              {fieldError("name")}
            </div>
            <div className="om-field om-field--anim" style={{ "--i": 1 } as React.CSSProperties}>
              <label htmlFor="service-category">Kategori</label>
              <div className="om-input-wrap om-select-wrap">
                <span className="om-input-icon"><ClipboardList size={16} /></span>
                <select id="service-category" name="category" defaultValue="Cuci Kiloan">
                  {SERVICE_PILLS.slice(1).map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="om-row">
            <div className="om-field om-field--anim" style={{ "--i": 2 } as React.CSSProperties}>
              <label htmlFor="service-estimated-time">Estimasi Waktu</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><Clock3 size={16} /></span>
                <input id="service-estimated-time" name="estimatedTime" required maxLength={40} placeholder="Contoh: 24 Jam" onChange={(event) => validateField("estimatedTime", event.currentTarget.value)} />
              </div>
              {fieldError("estimatedTime")}
            </div>
            <div className="om-field om-field--anim" style={{ "--i": 3 } as React.CSSProperties}>
              <label htmlFor="service-price">Tarif</label>
              <div className="om-input-wrap">
                <span className="om-input-icon"><Coins size={16} /></span>
                <input id="service-price" name="price" required maxLength={40} placeholder="Contoh: Rp 9.500 / kg" onChange={(event) => validateField("price", event.currentTarget.value)} />
              </div>
              {fieldError("price")}
            </div>
          </div>
          <div className="om-field om-field--anim" style={{ "--i": 4 } as React.CSSProperties}>
            <label htmlFor="service-status">Status</label>
            <div className="om-input-wrap om-select-wrap">
              <span className="om-input-icon"><ClipboardList size={16} /></span>
              <select id="service-status" name="status" defaultValue="Aktif">
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>
          <div className="om-actions">
            <button type="button" className="om-btn-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="om-btn-submit">Simpan Layanan</button>
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
  const [services, setServices] = useState<DummyService[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [serviceStats, setServiceStats] = useState<{
    totalActiveServices: { value: string; note: string };
    categoriesCount: { value: string; note: string };
    avgKiloanPrice: { value: string; note: string };
    bestSellerService: { value: string; note: string };
  } | null>(null);
  const perPage = 5;

  async function loadServices() {
    try {
      const [response, statsResponse] = await Promise.all([api.get<Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        unit: string;
        estimatedHours: number;
        isActive: boolean;
      }>>("/services"), api.get<typeof serviceStats>("/services/stats")]);
      setServices(response.data.map((service) => ({
        id: service.id,
        name: service.name,
        category: service.category === "Kiloan" ? "Cuci Kiloan"
          : service.category === "Satuan" ? "Cuci Satuan"
            : service.category as DummyService["category"],
        estimatedTime: `${service.estimatedHours} Jam`,
        price: `Rp ${service.price.toLocaleString("id-ID")} / ${service.unit}`,
        status: service.isActive ? "Aktif" : "Non Aktif",
      })));
      setServiceStats(statsResponse.data);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal memuat layanan.");
    }
  }

  useEffect(() => { void loadServices(); }, []);

  const filteredServices = services.filter((service) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || Object.values(service).some((value) =>
      String(value).toLowerCase().includes(q),
    );

    if (!matchesSearch) return false;
    if (selectedPill === "Semua Layanan") return true;
    return service.category === selectedPill;
  });

  const servicePillItems = SERVICE_PILLS.map((category) => {
    const count =
      category === "Semua Layanan"
        ? services.length
        : services.filter((service) => service.category === category).length;
    return `${category} (${count})`;
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

  async function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawPrice = String(formData.get("price") ?? "");
    const parsedPrice = Number(rawPrice.replace(/[^\d]/g, ""));
    const rawHours = String(formData.get("estimatedTime") ?? "");
    const estimatedHours = Number(rawHours.match(/\d+/)?.[0]);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0 || !estimatedHours || estimatedHours > 720) {
      setError("Harga harus berupa nominal Rupiah dan estimasi waktu harus 1–720 jam.");
      return;
    }
    const category = String(formData.get("category") ?? "Kiloan")
      .replace("Cuci ", "");
    try {
      const created = await api.post<{ id: string }>("/services", {
        name: String(formData.get("name") ?? "").trim(),
        category,
        price: parsedPrice,
        unit: category === "Kiloan" || category === "Express" ? "kg" : "pcs",
        estimatedHours,
      });
      if (formData.get("status") === "Non Aktif") {
        await api.put(`/services/${encodeURIComponent(created.data.id)}`, { isActive: false });
      }
      await loadServices();
      setSearch("");
      setSelectedPill("Semua Layanan");
      setPage(1);
      setIsServiceModalOpen(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Layanan gagal disimpan.");
    }
  }

  async function toggleService(service: DummyService) {
    try {
      await api.put(`/services/${encodeURIComponent(service.id)}`, { isActive: service.status !== "Aktif" });
      await loadServices();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Status layanan gagal diperbarui.");
    }
  }

  async function deleteService(service: DummyService) {
    if (!window.confirm(`Hapus layanan "${service.name}"?`)) return;
    try {
      await api.delete(`/services/${encodeURIComponent(service.id)}`);
      await loadServices();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Layanan gagal dihapus.");
    }
  }

  return (
    <>
      <Header
        title="Layanan dan Harga"
        subtitle="Kelola data katalog, layanan cuci, kategori laundry, serta harga laundry"
      />

      <section className="content">
        {error && <p className="order-error" role="alert">{error}</p>}
        {/* STATISTIK LAYANAN */}
        <div className="service-stat-grid">
          <StatCard
            label={<>TOTAL LAYANAN<br />AKTIF</>}
            value={serviceStats?.totalActiveServices.value ?? "—"}
            note={serviceStats?.totalActiveServices.note ?? ""}
            icon="hand"
          />
          <StatCard
            label={<>KATEGORI<br />LAYANAN</>}
            value={serviceStats?.categoriesCount.value ?? "—"}
            note={serviceStats?.categoriesCount.note ?? ""}
            icon="wash"
          />
          <StatCard
            label={<>RATA-RATA TARIF<br />KILOAN</>}
            value={serviceStats?.avgKiloanPrice.value ?? "—"}
            note={serviceStats?.avgKiloanPrice.note ?? ""}
            icon="dollar"
          />
          <StatCard
            label={<>LAYANAN<br />TERLARIS</>}
            value={serviceStats?.bestSellerService.value ?? "—"}
            note={serviceStats?.bestSellerService.note ?? ""}
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
          items={servicePillItems}
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
            "AKSI",
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
                  <button
                    type="button"
                    className={`status ${service.status.toLowerCase().replaceAll(" ", "-")}`}
                    onClick={() => void toggleService(service)}
                    aria-label={`${service.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"} ${service.name}`}
                  >
                    {service.status}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="order-delete-button order-delete-row"
                    onClick={() => void deleteService(service)}
                    aria-label={`Hapus layanan ${service.name}`}
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