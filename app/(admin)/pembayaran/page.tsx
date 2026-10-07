"use client";

import Header from "@/components/Header";
import {
  SearchBox,
  StatCard,
  Pills,
  EmptyTable,
  Pagination,
  SecondaryButton,
} from "@/components/UI";
import { Trash2, CalendarDays } from "lucide-react";

export default function Pembayaran() {
  return (
    <>
      <Header
        title="Pembayaran"
        subtitle="Verifikasi tagihan pelanggan dan pembayaran laundry"
      />

      <section className="content">
        <div className="payment-top">
          <SearchBox placeholder="Cari No Pembayaran, Nama Pelanggan" />

          <StatCard
            label="MENUNGGU PELUNASAN"
            value="Rp. 100.000"
            note="2 Order"
            icon="clock"
          />

          <StatCard
            label="LUNAS HARI INI"
            value="Rp. 480.000"
            note="7 Order"
            icon="hand"
          />
        </div>

        <div className="payment-controls">
          <Pills
            items={[
              "Menunggu Pembayaran",
              "Sudah Dibayar",
              "Selesai",
            ]}
          />

          <div className="button-group">
            <button className="danger-button">
              <Trash2 size={19} />
              Delete
            </button>

            <SecondaryButton icon={CalendarDays}>
              Filter Tanggal
            </SecondaryButton>
          </div>
        </div>

        <EmptyTable
          headers={[
            "NO. ORDER",
            "PELANGGAN",
            "TOTAL",
            "STATUS",
            "PEMBAYARAN",
          ]}
        />

        <Pagination />
      </section>
    </>
  );
}