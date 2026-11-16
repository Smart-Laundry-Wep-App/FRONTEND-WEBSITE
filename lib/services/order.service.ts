/**
 * Business Logic Service - Orders
 * Memisahkan logika bisnis dari route handler secara modular
 */

import { findOrdersWithRoleFilter, findOrderByIdWithRoleFilter, type OrderQueryFilter } from "@/lib/dal/orders";

export class OrderService {
  /**
   * Mengambil daftar pesanan dengan verifikasi hak akses role
   */
  static async getOrders(token: string, filter: OrderQueryFilter) {
    if (!token) {
      throw new Error("Autentikasi diperlukan untuk mengakses daftar pesanan.");
    }
    return await findOrdersWithRoleFilter(token, filter);
  }

  /**
   * Mengambil detail pesanan tunggal
   */
  static async getOrderDetail(token: string, orderId: string, filter: OrderQueryFilter) {
    if (!token) {
      throw new Error("Autentikasi diperlukan.");
    }
    if (!orderId) {
      throw new Error("ID pesanan wajib disertakan.");
    }
    return await findOrderByIdWithRoleFilter(token, orderId, filter);
  }

  /**
   * Menghitung estimasi biaya pencucian
   */
  static calculateTotal(weight: number, pricePerKg: number): number {
    if (weight <= 0 || pricePerKg <= 0) return 0;
    return Math.round(weight * pricePerKg);
  }
}
