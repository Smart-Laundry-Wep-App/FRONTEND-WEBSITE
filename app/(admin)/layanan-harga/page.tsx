"use client";

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

export default function LayananHarga() {
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
            label={
              <>
                TOTAL LAYANAN
                <br />
                AKTIF
              </>
            }
            value="16 Layanan"
            note="+2 bulan ini"
            icon="hand"
          />

          <StatCard
            label={
              <>
                KATEGORI
                <br />
                LAYANAN
              </>
            }
            value="4 Kategori"
            note="Kiloan, Satuan, Express, Khusus"
            icon="wash"
          />

          <StatCard
            label={
              <>
                RATA-RATA TARIF
                <br />
                KILOAN
              </>
            }
            value="Rp 9.500/kg"
            note="Standar Harga SCA Smart Laundry"
            icon="dollar"
          />

          <StatCard
            label={
              <>
                LAYANAN
                <br />
                TERLARIS
              </>
            }
            value={
              <>
                Cuci Kering
                <br />
                Setrika
              </>
            }
            note="68% Total Order Masuk"
            icon="shirt"
          />
        </div>

        {/* TOOLBAR */}
        <div className="toolbar service-toolbar">
          <SearchBox placeholder="Cari layanan laundry" />

          <SecondaryButton icon={FileDown}>
            EXPORT CSV
          </SecondaryButton>

          <PrimaryButton icon={ReceiptText}>
            TAMBAH LAYANAN
          </PrimaryButton>
        </div>

        {/* FILTER */}
        <Pills
          items={[
            "Semua Layanan",
            "Cuci Kiloan",
            "Cuci Satuan",
            "Express",
            "Khusus",
          ]}
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
        />

        <Pagination />
      </section>
    </>
  );
}