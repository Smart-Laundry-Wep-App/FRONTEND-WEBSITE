"use client";

import { useState } from "react";
import Header from "@/components/Header";
import {
  StatCard,
  SearchBox,
  SecondaryButton,
  Pills,
  EmptyTable,
  Pagination,
} from "@/components/UI";
import { FileDown, Plus, Pencil, Trash2 } from "lucide-react";
import { DUMMY_PROMOS, type DummyPromo } from "@/lib/dummyData";

const PROMO_PILLS = ["Semua", "Aktif", "Non Aktif"];

export default function InfoPromo() {
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("Semua");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filteredPromos = DUMMY_PROMOS.filter((promo) => {
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
            <SecondaryButton icon={FileDown}>EXPORT LAPORAN</SecondaryButton>
            <SecondaryButton icon={Plus}>PROMO BARU</SecondaryButton>
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
    </>
  );
}