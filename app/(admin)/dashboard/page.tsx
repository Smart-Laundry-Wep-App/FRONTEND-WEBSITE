"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import { StatCard, Pills, EmptyTable, Pagination } from "@/components/UI";
import { QrCode, Hourglass, Clock3, SquareCheckBig, Truck } from "lucide-react";
import { DUMMY_ORDERS, type DummyOrder } from "@/lib/dummyData";

const PILL_OPTIONS = ["Semua", "Sedang Cuci", "Siap Diambil", "Pengeringan", "Pengantaran"];

function getOrderIcon(status: string, index: number) {
  if (status === "Sedang Cuci") return <Hourglass size={20} />;
  if (status === "Pengeringan") return <Clock3 size={20} />;
  if (status === "Siap Diambil" || status === "Selesai") return <SquareCheckBig size={20} />;
  if (status === "Pengantaran" || status === "Antaran") return <Truck size={20} />;
  return index % 2 === 0 ? <QrCode size={20} /> : <Clock3 size={20} />;
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filteredOrders = useMemo(() => {
    if (selectedFilter === "Semua") return DUMMY_ORDERS;
    return DUMMY_ORDERS.filter((order) => {
      if (selectedFilter === "Pengeringan") {
        return order.status === "Sedang Cuci" || order.service.toLowerCase().includes("kering");
      }
      return order.status.toLowerCase() === selectedFilter.toLowerCase();
    });
  }, [selectedFilter]);

  const totalPages = Math.ceil(filteredOrders.length / perPage) || 1;
  const currentOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Header title="Dashboard" subtitle="Ringkasan & Aktivitas Operasional Laundry" />
      <section className="content dashboard-content">
        <div className="stat-grid dashboard-stats">
          <StatCard
            label="TOTAL PESANAN"
            value={<><b>142</b> Pesanan</>}
            note="Kapasitas 82%"
            icon="receipt"
          />
          <StatCard
            label="PESANAN DIPROSES"
            value={<><b>38</b> Pesanan</>}
            note={
              <>
                <span>● 21 Cuci</span>
                <br />
                <span>● 17 Pengering</span>
              </>
            }
            badge="Aktif"
            icon="wash"
          />
          <StatCard
            label="SELESAI"
            value={<><b>89</b> Paket</>}
            note={
              <>
                <span>● 63 Diambil</span>
                <br />
                <span>● 26 Di Rak</span>
              </>
            }
            badge="On-Time"
            icon="receipt"
          />
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

        <div className="section-heading">
          <h2>Pesanan Terbaru</h2>
          <p>Daftar transaksi laundry terkini yang tercatat pada sistem</p>
        </div>

        <Pills
          items={PILL_OPTIONS}
          active={PILL_OPTIONS.indexOf(selectedFilter)}
          onChange={(index) => {
            setSelectedFilter(PILL_OPTIONS[index]);
            setPage(1);
          }}
        />

        <div className="dashboard-table">
          <EmptyTable headers={["PRE-ORDER", "PELANGGAN", "LAYANAN", "STATUS", "TANGGAL"]} rows={0}>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, i) => (
                <tr key={order.id}>
                  <td>
                    <span className="order-id-badge">
                      {getOrderIcon(order.status, i)}
                      <strong>{order.id}</strong>
                    </span>
                  </td>
                  <td>
                    <strong>{order.customer}</strong>
                    <small>{order.phone}</small>
                  </td>
                  <td>
                    <strong>{order.service}</strong>
                    <small>
                      {order.weight} kg · {formatRupiah(order.totalAmount)}
                    </small>
                  </td>
                  <td>
                    <span className={`status ${order.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                    <small>
                      {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </small>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                  Tidak ada pesanan dengan status "{selectedFilter}".
                </td>
              </tr>
            )}
          </EmptyTable>
        </div>

        <Pagination
          total={filteredOrders.length}
          perPage={perPage}
          page={page}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
