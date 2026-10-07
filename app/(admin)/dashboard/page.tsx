import Header from "@/components/Header";
import { StatCard, Pills, EmptyTable, Pagination } from "@/components/UI";
import { QrCode, Hourglass, Clock3, SquareCheckBig } from "lucide-react";

export const metadata = { title: "Dashboard | SCA Smart Laundry" };

export default function Dashboard() {
  const rows = Array.from({length:7});
  return <>
    <Header title="Dashboard" subtitle="Ringkasan & Aktivitas Operasional Laundry" />
    <section className="content dashboard-content">
      <div className="stat-grid dashboard-stats">
        <StatCard label="TOTAL PESANAN" value={<><b>142</b> Pesanan</>} note="Kapasitas 82%" icon="receipt"/>
        <StatCard label="PESANAN DIPROSES" value={<><b>38</b> Pesanan</>} note={<><span>●21 Cuci</span><br/><span>●17 Pengering</span></>} badge="Aktif" icon="wash"/>
        <StatCard label="SELESAI" value={<><b>89</b> Paket</>} note={<><span>● 63 Diambil</span><br/><span>● 26 Di Rak</span></>} badge="On-Time" icon="receipt"/>
        <StatCard
  label="PENDING/ANTREAN"
  value={<><b>142</b> Antrean</>}
  note={
    <>
      <span>● 9 Konfirmasi</span>
      <br />
      <span>● 6 Timbang</span>
    </>
  }
  badge="Prioritas"
  icon="clock"
/>
      </div>
      <div className="section-heading"><h2>Pesanan Terbaru</h2><p>Daftar transaksi laundry terkini yang tercatat pada sistem</p></div>
      <Pills items={["Semua","Sedang Cuci","Siap Diambil","Pengeringan","Filter"]}/>
      <div className="dashboard-table">
        <EmptyTable headers={["PRE-ORDER","PELANGGAN","LAYANAN","STATUS","TANGGAL"]} rows={0}>
          <>{rows.map((_,i)=><tr key={i}><td>{i===2||i===5?<Hourglass size={29}/>:i===4?<Clock3 size={25}/>:i===6?<SquareCheckBig size={26}/>:<QrCode size={28}/>}</td><td></td><td></td><td></td><td></td></tr>)}</>
        </EmptyTable>
      </div>
      <Pagination/>
    </section>
  </>;
}
