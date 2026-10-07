"use client";
import Header from "@/components/Header";
import { StatCard, SearchBox, SecondaryButton, Pills, EmptyTable, Pagination } from "@/components/UI";
import { CalendarDays, Download } from "lucide-react";

export default function RiwayatTransaksi() {
 return <>
  <Header title="Riwayat Transaksi" subtitle="Rekap lengkap arus kas, metode pembayaran, dan log transaksi pelanggan."/>
  <section className="content history-content">
   <div className="stat-grid history-stats">
    <StatCard label="TOTAL OMSET BULAN INI" value="Rp. 489.000" icon="hand"/>
    <StatCard label="TRANSAKSI BULAN INI" value="1.287 Transaksi" icon="receipt"/>
    <StatCard label="TRANSAKSI PENDAPATAN TERBESAR" value="Rp. 360.000" icon="dollar"/>
   </div>
   <div className="toolbar history-toolbar"><SearchBox placeholder="Cari Riwayat Transaksi, No Pembayaran, Layanan"/><SecondaryButton icon={CalendarDays}>TANGGAL</SecondaryButton><SecondaryButton icon={Download}>DOWNLOAD</SecondaryButton></div>
   <div className="chart-card"><div className="chart-label">TOTAL OMSET / PENDAPATAN</div><div className="chart"><div className="chart-y"><span>Rp. 2.000.000</span><span>Rp. 1.500.000</span><span>Rp. 1.000.000</span><span>Rp. 500.000</span><span>Rp. 0</span></div><svg viewBox="0 0 820 155" preserveAspectRatio="none"><path d="M30 150 L70 98 L135 98 L230 55 L350 88 L500 78 L650 30 L790 38 L790 150 Z" fill="rgba(68,94,221,.68)" stroke="#2531b6" strokeWidth="1.2"/><g fill="#2531b6"><circle cx="70" cy="98" r="3.5"/><circle cx="135" cy="98" r="3.5"/><circle cx="230" cy="55" r="3.5"/><circle cx="350" cy="88" r="3.5"/><circle cx="500" cy="78" r="3.5"/><circle cx="650" cy="30" r="3.5"/><circle cx="790" cy="38" r="3.5"/></g></svg></div></div>
   <Pills items={["Semua","Menunggu Pembayaran","Lunas","Dibatalkan"]}/>
   <EmptyTable headers={["TANGGAL","NO. TRANSAKSI","PELANGGAN","METODE PEMBAYARAN","STATUS"]} rows={3}/>
   <Pagination/>
  </section>
 </>;
}
