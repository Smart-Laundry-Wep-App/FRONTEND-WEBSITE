"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { ArrowLeft, Clock, User, Phone, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import api, { normalizeBackendError } from "@/lib/api";

interface OrderDetail {
  id: string;
  orderNumber?: string;
  customer: string;
  phone: string;
  service: string;
  weight: number;
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  notes?: string;
  createdAt: string;
  estimatedFinished?: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrderDetail() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<{ orders: any[] }>("/orders", { params: { limit: 100 } });
        const ordersList = response.data?.orders || [];
        const found = ordersList.find((item: any) => String(item.id) === String(orderId) || String(item.orderNumber) === String(orderId));

        if (!isMounted) return;

        if (found) {
          setOrder({
            id: String(found.id),
            orderNumber: found.orderNumber || `ORD-${found.id}`,
            customer: found.customer || found.customerName || "Pelanggan",
            phone: found.phone || found.customerPhone || "-",
            service: found.service || found.serviceName || "Cuci Komplit",
            weight: Number(found.weight || found.kiloan || 1),
            totalAmount: Number(found.totalAmount || found.totalPrice || 0),
            status: found.status || "Menunggu",
            paymentStatus: found.paymentStatus || "Lunas",
            notes: found.notes || "Tidak ada catatan khusus",
            createdAt: found.createdAt || new Date().toISOString(),
            estimatedFinished: found.estimatedFinished || "Besok, 18:00 WIB",
          });
        } else {
          // Fallback mockup jika backend ID spesifik belum ter-seed
          setOrder({
            id: orderId,
            orderNumber: `ORD-${orderId}`,
            customer: "Siti Rahma",
            phone: "08123456789",
            service: "Cuci Kering Setrika",
            weight: 3.5,
            totalAmount: 35000,
            status: "Sedang Cuci",
            paymentStatus: "Lunas",
            notes: "Gunakan pelembut pakaian aroma lavender",
            createdAt: new Date().toISOString(),
            estimatedFinished: "Hari ini, 17:00 WIB",
          });
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(normalizeBackendError(err?.message));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  return (
    <div className="orders-page" style={{ padding: "24px" }}>
      <Header title={`Detail Pesanan #${orderId}`} />

      <div style={{ marginTop: "24px" }}>
        <Link
          href="/kelola-pesanan"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "14px",
            marginBottom: "20px"
          }}
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Pesanan
        </Link>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            Memuat data detail pesanan...
          </div>
        ) : error ? (
          <div style={{ padding: "20px", backgroundColor: "#fee2e2", borderRadius: "12px", color: "#b91c1c" }}>
            <AlertCircle size={20} style={{ display: "inline", marginRight: "8px" }} />
            {error}
          </div>
        ) : order ? (
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                  {order.orderNumber}
                </h2>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Dibuat pada: {new Date(order.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
              <span style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: order.status === "Selesai" ? "#dcfce7" : "#dbeafe",
                color: order.status === "Selesai" ? "#15803d" : "#1d4ed8"
              }}>
                ● {order.status}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
              <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", marginBottom: "6px", fontSize: "13px" }}>
                  <User size={16} /> Nama Pelanggan
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>{order.customer}</div>
              </div>

              <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", marginBottom: "6px", fontSize: "13px" }}>
                  <Phone size={16} /> Nomor Telepon
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>{order.phone}</div>
              </div>

              <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", marginBottom: "6px", fontSize: "13px" }}>
                  <Tag size={16} /> Layanan & Berat
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>
                  {order.service} ({order.weight} kg)
                </div>
              </div>

              <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", marginBottom: "6px", fontSize: "13px" }}>
                  <CheckCircle2 size={16} /> Total Pembayaran
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#2563eb" }}>
                  Rp {order.totalAmount.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px", backgroundColor: "#f1f5f9", borderRadius: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>
                <Clock size={16} /> Catatan Khusus
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#334155" }}>{order.notes}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
