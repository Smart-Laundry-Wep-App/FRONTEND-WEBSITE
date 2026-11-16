"use server";

import { orderSchema, type OrderFormData } from "@/lib/validations/order.schema";
import { API_BASE_URL } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Server Action: Create Order dengan Validasi Zod
 */
export async function createOrderAction(formData: OrderFormData): Promise<ActionResult> {
  // 1. Validasi skema Zod secara Synchronous di server
  const parseResult = orderSchema.safeParse(formData);
  if (!parseResult.success) {
    const flattened = parseResult.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Validasi form gagal. Periksa kembali input Anda.",
      errors: flattened,
    };
  }

  const validData = parseResult.data;
  const cookieStore = await cookies();
  const token = cookieStore.get("sca_auth_token")?.value;

  // 2. Eksekusi Asynchronous ke API backend
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(validData),
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Gagal menyimpan pesanan ke backend.",
      };
    }

    // 3. Revalidasi cache halaman pesanan
    revalidatePath("/kelola-pesanan");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Pesanan berhasil dibuat melalui Server Action!",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Terjadi kesalahan jaringan saat memproses Server Action.",
    };
  }
}
