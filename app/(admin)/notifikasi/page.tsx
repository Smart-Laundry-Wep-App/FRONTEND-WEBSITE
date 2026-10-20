"use client";
import Header from "@/components/Header";
import { SearchBox, PrimaryButton, EmptyTable, Pagination } from "@/components/UI";
import { Plus } from "lucide-react";

export default function Notifikasi() {
 const rows = [
  ["Pesanan#ORD-8921","Halo Kak Budi ,cucian Anda sudah selesai dikemas rapi...","24 OKT 2023","Terkirim"],
  ["","","","Sedang diproses"],["","","","Gagal"],["","","","Terkirim"]
 ];
 return <>
  <Header title="Kelola Notifikasi" subtitle="Kelola kupon diskon, voucher pelanggan, dan periode promosi laundry"/>
  <section className="content notification-content">
   <div className="toolbar notification-toolbar"><SearchBox placeholder="Cari Notifikasi"/><PrimaryButton icon={Plus}>Kirim Notifikasi</PrimaryButton></div>
   <EmptyTable headers={["JUDUL","PESAN NOTIFIKASI","TANGGAL","STATUS"]} rows={0}>
    <>{rows.map((r,i)=><tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><span className={`status ${r[3].toLowerCase().replaceAll(" ","-")}`}>{r[3]}</span></td></tr>)}</>
   </EmptyTable>
   <Pagination/>
  </section>
 </>;
}
