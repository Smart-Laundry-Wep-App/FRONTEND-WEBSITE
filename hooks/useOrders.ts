import { useState, useEffect, useCallback } from "react";
import api, { normalizeBackendError } from "@/lib/api";

export interface OrderItem {
  id: string;
  customer: string;
  phone: string;
  service: string;
  weight: number;
  pricePerKg: number;
  status: string;
  createdAt: string;
}

/**
 * Custom Hook: useOrders
 * Mengelola pemuatan data pesanan, filtering, dan reload secara modular
 */
export function useOrders(initialStatus = "Semua") {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{ orders: OrderItem[] }>("/orders", {
        params: { limit: 100 },
      });
      setOrders(response.data?.orders || []);
    } catch (err: any) {
      setError(normalizeBackendError(err?.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    reload: fetchOrders,
  };
}

export default useOrders;
