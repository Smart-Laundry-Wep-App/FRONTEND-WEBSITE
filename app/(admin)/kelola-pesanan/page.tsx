"use client";
import Header from "@/components/Header";
import { SearchBox, SelectBox, PrimaryButton, Pills, EmptyTable, Pagination } from "@/components/UI";

export default function KelolaPesanan() {
  return <>
    <Header title="Kelola Pesanan" subtitle="Kelola pesanan masuk, pantau status pengerjaan, dan atur jadwal pengantaran pelanggan"/>
    <section className="content">
      <div className="toolbar order-toolbar">
        <SearchBox placeholder="Cari pesanan (No. order, nama pelanggan, layanan...)"/>
        <SelectBox>Status Pesanan</SelectBox>
        <PrimaryButton>+ Tambah Pesanan</PrimaryButton>
      </div>
      <Pills items={["Semua (42)","Sedang Cuci (25)","Pengantaran (17)","Siap Diambil (63)","Antaran (5)"]}/>
      <EmptyTable headers={["NO. PELANGGAN","PELANGGAN","LAYANAN STATUS","STATUS"]} />
      <Pagination/>
    </section>
  </>;
}
