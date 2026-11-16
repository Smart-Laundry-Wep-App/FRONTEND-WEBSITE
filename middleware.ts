import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar rute yang memerlukan otentikasi login
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/kelola-pesanan",
  "/layanan-harga",
  "/pembayaran",
  "/riwayat-transaksi",
  "/notifikasi",
  "/profil-admin",
  "/info-promo",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sca_auth_token")?.value;

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAuthRoute = pathname === "/login" || pathname.startsWith("/login");

  // Jika mengakses rute terlindungi tanpa token -> redirect ke login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah punya token dan mencoba buka halaman /login -> redirect ke /dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Tambahkan request header augmentasi (contoh: x-user-authenticated)
  const response = NextResponse.next();
  if (token) {
    response.headers.set("x-user-authenticated", "true");
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/kelola-pesanan/:path*",
    "/layanan-harga/:path*",
    "/pembayaran/:path*",
    "/riwayat-transaksi/:path*",
    "/notifikasi/:path*",
    "/profil-admin/:path*",
    "/info-promo/:path*",
    "/login",
  ],
};
