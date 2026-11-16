import { NextRequest } from "next/server";
import { OrderService } from "@/lib/services/order.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("sca_auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return apiError("Unauthorized: Token tidak ditemukan", null, 401);
    }

    const order = await OrderService.getOrderDetail(token, id, { role: "Admin" });
    return apiSuccess(order, `Detail pesanan #${id} berhasil diambil`);
  } catch (error: any) {
    return apiError(error.message || "Gagal memuat detail pesanan", error, 404);
  }
}
