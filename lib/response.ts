import { NextResponse } from "next/server";

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string | unknown;
}

/**
 * Membungkus response sukses API dengan format standar:
 * { success: true, message: string, data: T, error: null }
 */
export function apiSuccess<T>(data: T, message = "Permintaan berhasil diproses", status = 200) {
  const payload: StandardApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return NextResponse.json(payload, { status });
}

/**
 * Membungkus response error API dengan format standar:
 * { success: false, message: string, data: null, error: any }
 */
export function apiError(message = "Terjadi kesalahan pada server", error: unknown = null, status = 500) {
  const payload: StandardApiResponse = {
    success: false,
    message,
    data: null,
    error: typeof error === "object" && error !== null && "message" in error ? (error as any).message : error,
  };
  return NextResponse.json(payload, { status });
}
