/**
 * Data Access Layer (DAL) - Orders
 * Memisahkan query/fetching dengan menyertakan filter hak akses (user_id / role)
 */

import { API_BASE_URL } from "@/lib/api";

export interface OrderQueryFilter {
  role?: "Admin" | "Kasir" | "Customer" | string;
  userId?: string;
  status?: string;
  limit?: number;
  page?: number;
}

export async function findOrdersWithRoleFilter(token: string, filter: OrderQueryFilter) {
  const url = new URL(`${API_BASE_URL}/orders`);
  if (filter.status && filter.status !== "Semua") {
    url.searchParams.set("status", filter.status);
  }
  if (filter.limit) {
    url.searchParams.set("limit", String(filter.limit));
  }
  if (filter.page) {
    url.searchParams.set("page", String(filter.page));
  }

  // Caching Next.js ISR: revalidate 60 detik untuk efisiensi
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Gagal memuat pesanan dari DAL (Status: ${response.status})`);
  }

  const json = await response.json();
  const rawOrders = json.data?.orders || json.data || [];

  // Filter otorisasi DAL: jika role adalah Customer, hanya boleh melihat pesanannya sendiri
  if (filter.role === "Customer" && filter.userId) {
    return rawOrders.filter((order: any) => String(order.userId) === String(filter.userId));
  }

  // Admin dan Kasir berhak melihat seluruh antrean pesanan
  return rawOrders;
}

export async function findOrderByIdWithRoleFilter(token: string, orderId: string, filter: OrderQueryFilter) {
  const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error(`Pesanan #${orderId} tidak ditemukan.`);
  }

  const json = await response.json();
  const order = json.data;

  if (filter.role === "Customer" && filter.userId && String(order.userId) !== String(filter.userId)) {
    throw new Error("Akses ditolak: Anda tidak memiliki izin untuk melihat pesanan ini.");
  }

  return order;
}
