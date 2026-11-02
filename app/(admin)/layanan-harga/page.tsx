"use client";

import { useState } from "react";
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
  const perPage = 5;

  const filteredServices = DUMMY_SERVICES.filter((service) => {
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
          <SecondaryButton icon={FileDown}>EXPORT CSV</SecondaryButton>
          <SecondaryButton icon={ReceiptText}>TAMBAH LAYANAN</SecondaryButton>
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
    </>
  );
}