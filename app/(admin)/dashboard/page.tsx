"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import { StatCard, Pills, EmptyTable, Pagination } from "@/components/UI";
import { QrCode, Hourglass, Clock3, SquareCheckBig, Truck } from "lucide-react";
import api, { normalizeBackendError } from "@/lib/api";

const PILL_OPTIONS = ["Semua", "Sedang Cuci", "Siap Diambil", "Pengantaran", "Selesai"];

function normalizeOrderStatus(status: string) {
  if (status === "Antaran") return "Selesai";
  if (status === "Pengeringan") return "Sedang Cuci";
  return status;
}

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

interface DashboardOrder {
  id: string;
  customer: string;
  phone: string;
  service: string;
  weight: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalOrders: { value: number };
  inProcess: { value: number; breakdown: string[] };
  completed: { value: number; breakdown: string[] };
  pending: { value: number; breakdown: string[] };
}

function matchesOrderFilter(order: DashboardOrder, filter: string) {
  if (filter === "Pengeringan") {
    return order.status === "Sedang Cuci" || order.service.toLowerCase().includes("kering");
  }
  if (filter === "Pengantaran") {
    return order.status === "Pengantaran" || order.status === "Antaran";
  }
  return order.status.toLowerCase() === filter.toLowerCase();
}

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const perPage = 5;

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get<DashboardStats>("/dashboard/stats"),
      api.get<DashboardOrder[]>("/dashboard/recent-orders", { params: { limit: 50 } }),
    ]).then(([statsResponse, ordersResponse]) => {
      if (!active) return;
      setStats(statsResponse.data);
      setOrders(ordersResponse.data);
    }).catch((requestError: unknown) => {
      if (active) {
        const message = requestError instanceof Error ? requestError.message : "Gagal memuat dashboard.";
        setError(normalizeBackendError(message));
      }
    });
    return () => { active = false; };
  }, []);

  const filteredOrders = useMemo(() => {
    if (selectedFilter === "Semua") return orders;
    return orders.filter((order) => matchesOrderFilter(order, selectedFilter));
  }, [orders, selectedFilter]);

  const pillItems = PILL_OPTIONS.map((filter) => {
    const count = filter === "Semua"
      ? orders.length
      : orders.filter((order) => matchesOrderFilter(order, filter)).length;
    return `${filter} (${count})`;
  });

  const currentOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Header title="Dashboard" subtitle="Ringkasan & Aktivitas Operasional Laundry" />
      <section className="content dashboard-content">
        {error && <p className="order-error" role="alert">{error}</p>}
        <div className="stat-grid dashboard-stats">
          <StatCard
            label="TOTAL PESANAN"
            value={<><b>{stats?.totalOrders.value ?? "—"}</b> Pesanan</>}
            note="Total pesanan tercatat"
            icon="receipt"
          />
          <StatCard
            label="PESANAN DIPROSES"
            value={<><b>{stats?.inProcess.value ?? "—"}</b> Pesanan</>}
            note={stats?.inProcess.breakdown.join(" · ") ?? "Memuat data"}
            badge="Aktif"
            icon="wash"
          />
          <StatCard
            label="SELESAI"
            value={<><b>{stats?.completed.value ?? "—"}</b> Paket</>}
            note={stats?.completed.breakdown.join(" · ") ?? "Memuat data"}
            badge="On-Time"
            icon="receipt"
          />
          <StatCard
            label="PENDING/ANTREAN"
            value={<><b>{stats?.pending.value ?? "—"}</b> Antrean</>}
            note={stats?.pending.breakdown.join(" · ") ?? "Memuat data"}
            badge="Prioritas"
            icon="clock"
          />
        </div>

        <div className="section-heading">
          <h2>Pesanan Terbaru</h2>
          <p>Daftar transaksi laundry terkini yang tercatat pada sistem</p>
        </div>

        <Pills
          items={pillItems}
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
                    <span className={`status ${normalizeOrderStatus(order.status).toLowerCase().replaceAll(" ", "-")}`}>
                      {normalizeOrderStatus(order.status)}
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
                  {error ? "Data dashboard belum dapat dimuat." : `Tidak ada pesanan dengan status "${selectedFilter}".`}
                </td>
              </tr>
            )}
          </EmptyTable>
        </div>

        <Pagination
          total={filteredOrders.length}
          perPage={perPage}
          page={page}
          minPages={3}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
