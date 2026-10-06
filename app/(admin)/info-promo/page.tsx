"use client";
import Header from "@/components/Header";
import { StatCard, SearchBox, SecondaryButton, PrimaryButton, Pills, EmptyTable, Pagination } from "@/components/UI";
import { FileDown, Percent as PercentIcon } from "lucide-react";

export default function InfoPromo() {
 return <>
  <Header title="Info Promo" subtitle="Kelola kupon diskon, voucher pelanggan, dan periode promosi laundry"/>
  <section className="content">
   <div className="stat-grid">
    <StatCard label={<>TOTAL PROMO<br/>AKTIF</>} value="8 Promo" note="+2 bulan ini" icon="megaphone"/>
    <StatCard label={<>TOTAL KLAIM<br/>VOUCHER</>} value="1.425 x" note="Meningkat 18%" icon="ticket"/>
    <StatCard label={<>ESTIMASI HEMAT<br/>PELANGGAN</>} value="Rp 12.850.000" note="Total subsidi diskon" icon="percent"/>
    <StatCard label="PROMO TERPOPULER" value="KILATHEMAT (25%)" note="420x digunakan di pesanan" icon="percent"/>
   </div>
   <div className="toolbar promo-toolbar"><SearchBox placeholder="Cari promo atau kode voucher"/><SecondaryButton icon={FileDown}>EXPORT LAPORAN</SecondaryButton><PrimaryButton icon={PercentIcon}>PROMO BARU</PrimaryButton></div>
   <Pills items={["Semua","Aktif","Non Aktif"]}/>
   <EmptyTable headers={["NAMA PROMO","KODE PROMO","DISKON","PERIODE BERLAKU","STATUS"]}/>
   <Pagination/>
  </section>
 </>;
}
