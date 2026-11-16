import { NextRequest } from "next/server";
import { OrderService } from "@/lib/services/order.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("sca_auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return apiError("Unauthorized: Token tidak ditemukan", null, 401);
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") || "Semua";
    const limit = Number(searchParams.get("limit")) || 50;

    const orders = await OrderService.getOrders(token, {
      role: "Admin",
      status,
      limit,
    });

    return apiSuccess({ orders, count: orders.length }, "Data pesanan berhasil diambil");
  } catch (error: any) {
    return apiError(error.message || "Gagal memproses data pesanan", error, 500);
  }
}
