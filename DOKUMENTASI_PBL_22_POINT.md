# DOKUMENTASI LENGKAP INTEGRASI 22 POIN PBL
## Proyek: SCA Smart Laundry (Next.js Fullstack & Express MySQL Backend)

Dokumen ini disusun sebagai bukti ketercapaian 22 poin indikator penilaian PBL (Project-Based Learning) sesuai dengan standar arsitektur Next.js modern dan integrasi backend database MySQL.

---

### Ringkasan Status 22 Poin Indikator

| No | Aspek | Indikator Ketercapaian di PBL | Status | Lokasi Berkas / Implementasi |
|:--:|---|---|:---:|---|
| **1** | **Side Rendering** | Mengelompokkan komponen/halaman ke kategori SSR, CSR (`'use client'`), dan RSC dengan tepat | ✅ Terpenuhi | [app/layout.tsx](file:///app/layout.tsx) (RSC), [app/(auth)/layout.tsx](file:///app/(auth)/layout.tsx) (RSC), Halaman interaktif (CSR `'use client'`) |
| **2** | **Hierarchy Component** | Memetakan struktur komponen Parent dan Child beserta lokasi berkasnya | ✅ Terpenuhi | Lihat Bab 2 di dokumen ini (Diagram & Tabel Hirarki) |
| **3** | **App Router** | Menggunakan direktori `/app` sebagai dasar folder-based routing | ✅ Terpenuhi | Direktori [app/](file:///app/) Next.js 15+ |
| **4** | **Special Files** | Menerapkan `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` | ✅ Terpenuhi | [app/layout.tsx](file:///app/layout.tsx), [app/loading.tsx](file:///app/loading.tsx), [app/error.tsx](file:///app/error.tsx), [app/not-found.tsx](file:///app/not-found.tsx) |
| **5** | **Dynamic Routes & Route Groups** | Menerapkan Dynamic Routes (`/[id]`) dan Route Groups (`/(auth)`, `/(dashboard)`) | ✅ Terpenuhi | [app/(auth)/login/page.tsx](file:///app/(auth)/login/page.tsx), [app/(admin)/kelola-pesanan/[id]/page.tsx](file:///app/(admin)/kelola-pesanan/[id]/page.tsx) |
| **6** | **State Management** | Menerapkan state lokal (`useState`) dan global state/context untuk modal, form, sesi | ✅ Terpenuhi | [context/AuthContext.tsx](file:///context/AuthContext.tsx) (Global Auth), `useState` di form modal |
| **7** | **React Hooks** | Menggunakan built-in hooks (`useState`, `useEffect`, `useContext`) & custom hooks | ✅ Terpenuhi | [hooks/useAuth.ts](file:///hooks/useAuth.ts), [hooks/useOrders.ts](file:///hooks/useOrders.ts), [hooks/useDebounce.ts](file:///hooks/useDebounce.ts) |
| **8** | **Sistem Caching** | Caching data fetching (`revalidate` / ISR / `force-cache`) beserta durasinya | ✅ Terpenuhi | [lib/dal/orders.ts](file:///lib/dal/orders.ts) (`next: { revalidate: 60 }`), ISR di Next.js Data Cache |
| **9** | **Integrasi FE & BE** | Menghubungkan frontend ke database MySQL backend via REST API & DAL | ✅ Terpenuhi | [lib/api.ts](file:///lib/api.ts) terhubung ke `http://localhost:5000/api` (Express + MySQL) |
| **10** | **Middleware** | Memiliki `middleware.ts` untuk verifikasi token/sesi, proteksi rute, dan redirect | ✅ Terpenuhi | [middleware.ts](file:///middleware.ts) di root proyek (membaca token cookie `sca_auth_token`) |
| **11** | **Modular Routing** | Memisahkan rute API (`/app/api/[module]`) dan logika bisnis (`/lib/services`) | ✅ Terpenuhi | [app/api/orders/route.ts](file:///app/api/orders/route.ts), [app/api/orders/[id]/route.ts](file:///app/api/orders/[id]/route.ts), [lib/services/order.service.ts](file:///lib/services/order.service.ts) |
| **12** | **Augmentasi Request** | Menambahkan atribut kustom (`user`, `role`) pada Request beserta tipe `.d.ts` | ✅ Terpenuhi | [types/request.d.ts](file:///types/request.d.ts) & [globals.d.ts](file:///globals.d.ts) (Augmentasi `NextRequest` & `Request`) |
| **13** | **Standarisasi Response** | Membungkus response API dengan format standar (`success`, `data`, `error`) | ✅ Terpenuhi | [lib/response.ts](file:///lib/response.ts) (`apiSuccess`, `apiError`, interface `StandardApiResponse`) |
| **14** | **Async vs Sync** | Memetakan kode yang berjalan Asynchronous (DB, fetch, bcrypt) vs Sync (Zod, utils) | ✅ Terpenuhi | Lihat Bab 3 di dokumen ini (Tabel Klasifikasi Eksekusi) |
| **15** | **Konektivitas Database** | Menerapkan Connection Pooling / singleton instance ORM (`mysql2`/`Prisma`) | ✅ Terpenuhi | Backend `src/db.ts` / `src/models/db.js` (`mysql2.createPool` dengan pool limit) |
| **16** | **Auth & Authorization** | Sesi/token (JWT Cookie / NextAuth) dan pembagian role (Admin vs Kasir vs User) | ✅ Terpenuhi | JWT tersimpan di Cookie & `localStorage`, verifikasi di [middleware.ts](file:///middleware.ts) & [components/AdminAuthGuard.tsx](file:///components/AdminAuthGuard.tsx) |
| **17** | **Data Access Layer** | Memisahkan query di `/lib/dal` dengan filter hak akses (`user_id` / `role`) | ✅ Terpenuhi | [lib/dal/orders.ts](file:///lib/dal/orders.ts) (`findOrdersWithRoleFilter` membatasi data berdasarkan role) |
| **18** | **Form & Schema Validation** | Mengelola form, validasi skema (Zod), dan mutasi CRUD (Server Actions / API) | ✅ Terpenuhi | [lib/validations/order.schema.ts](file:///lib/validations/order.schema.ts), [app/actions/order.actions.ts](file:///app/actions/order.actions.ts) (`"use server"`) |
| **19** | **File Upload Management** | Integrasi fitur unggah berkas ke cloud storage & menyimpan URL-nya | ✅ Terpenuhi | [lib/upload.ts](file:///lib/upload.ts) & [app/(admin)/profil-admin/page.tsx](file:///app/(admin)/profil-admin/page.tsx) (Upload Avatar) |
| **20** | **Keamanan & Validasi File** | Membatasi ukuran maksimum dan MIME type sebelum diunggah & tolak file tidak valid | ✅ Terpenuhi | [lib/validations/file.validator.ts](file:///lib/validations/file.validator.ts) (Max 2MB, MIME `image/jpeg`, `image/png`, `image/webp`) |
| **21** | **Error Handling** | Memisahkan error terduga & tak terduga di komponen, route, global handler + HTTP status | ✅ Terpenuhi | [app/error.tsx](file:///app/error.tsx), [app/not-found.tsx](file:///app/not-found.tsx), [lib/api.ts](file:///lib/api.ts) (`normalizeBackendError`), [lib/response.ts](file:///lib/response.ts) |
| **22** | **Deployment** | Mengamankan environment variables produksi, lolos production build, dan online | ✅ Terpenuhi | [.env.example](file:///env.example), lolos `npm run build`, panduan deploy Vercel & Railway |

---

### Bab 1: Pemetaan Kategori Side Rendering (Poin 1)

Next.js mengkombinasikan Server Component (RSC) dan Client Component (CSR):
1. **React Server Components (RSC):**
   - `app/layout.tsx`: Root shell, penentu metadata SEO dan font.
   - `app/(auth)/layout.tsx`: Shell rute autentikasi.
   - `app/loading.tsx`: Komponen streaming suspense render di sisi server.
   - `app/not-found.tsx`: Halaman 404 statis di sisi server.
   - `app/actions/order.actions.ts`: Kode Server Action (`"use server"`).
2. **Client Components (CSR `'use client'`):**
   - `app/(auth)/login/page.tsx`: Memerlukan state form login, visibilitas password, dan interaksi Google Sign-in.
   - `app/(admin)/kelola-pesanan/page.tsx`: Memerlukan interaktivitas filter status, modal, live search, dan paginasi.
   - `app/(admin)/kelola-pesanan/[id]/page.tsx`: Menampilkan dynamic param dan detail pesanan dengan navigasi balik.
   - `app/(admin)/profil-admin/page.tsx`: Menggunakan file input kamera dan upload avatar.
   - `components/Sidebar.tsx`, `components/Header.tsx`, `components/AdminAuthGuard.tsx`: Membutuhkan akses routing dan lifecycle event.

---

### Bab 2: Pemetaan Struktur Hirarki Komponen Parent & Child (Poin 2)

```
RootLayout (app/layout.tsx) [Parent]
├── AuthProvider (context/AuthContext.tsx) [Global State Provider]
│   │
│   ├── (auth) Route Group
│   │   └── AuthLayout (app/(auth)/layout.tsx) [Parent]
│   │       └── LoginPage (app/(auth)/login/page.tsx) [Child]
│   │           ├── Header & Brand
│   │           ├── Form Login
│   │           └── HelpModal (Child Modal)
│   │
│   └── (admin) Route Group
│       └── AdminLayout (app/(admin)/layout.tsx) [Parent]
│           ├── AdminAuthGuard (components/AdminAuthGuard.tsx) [Security Wrapper]
│           ├── Sidebar (components/Sidebar.tsx) [Navigation Child]
│           └── Main Area [Dynamic Content]
│               ├── DashboardPage (app/(admin)/dashboard/page.tsx)
│               │   ├── Header (components/Header.tsx)
│               │   ├── StatCard (components/UI.tsx)
│               │   ├── Pills (components/UI.tsx)
│               │   ├── EmptyTable (components/UI.tsx)
│               │   └── Pagination (components/UI.tsx)
│               │
│               ├── KelolaPesananPage (app/(admin)/kelola-pesanan/page.tsx)
│               │   ├── Header (components/Header.tsx)
│               │   ├── SearchBox (components/UI.tsx)
│               │   ├── AddOrderModal (Child Dialog Modal)
│               │   └── Dynamic Order Link -> OrderDetailPage (app/(admin)/kelola-pesanan/[id]/page.tsx)
│               │
│               └── ProfilAdminPage (app/(admin)/profil-admin/page.tsx)
│                   ├── Header (components/Header.tsx)
│                   ├── ProfileIcon (components/UI.tsx)
│                   ├── Avatar Upload Trigger (lib/upload.ts)
│                   └── InputField (components/UI.tsx)
```

---

### Bab 3: Pemetaan Asynchronous vs Synchronous (Poin 14)

| Operasi | Kategori | Alasan Arsitektural | Lokasi Berkas |
|---|:---:|---|---|
| Query Database MySQL | **Asynchronous** | Operasi I/O jaringan ke server basis data MySQL | Backend `src/db.ts` & `src/controllers/` |
| `fetch` REST API | **Asynchronous** | Permintaan HTTP I/O antara browser/Server ke backend | `lib/api.ts`, `lib/dal/orders.ts` |
| Hashing `bcryptjs` | **Asynchronous** | Komputasi kriptografi intensif (non-blocking thread pool) | Backend `src/auth.ts` |
| Upload File ke Storage | **Asynchronous** | Pengiriman payload multipart file melalui jaringan | `lib/upload.ts` |
| Validasi Skema Zod | **Synchronous** | Validasi memori CPU murni terhadap struktur objek data | `lib/validations/order.schema.ts`, `order.validator.js` |
| Array Filter & Map | **Synchronous** | Transformasi data list dalam memory JavaScript | `lib/dal/orders.ts`, `kelola-pesanan/page.tsx` |
| Formatting Rupiah | **Synchronous** | Utility formatting angka ke mata uang IDR | `lib/data.tsx`, `components/UI.tsx` |
| Validasi MIME & Size | **Synchronous** | Pengecekan atribut `file.size` dan `file.type` lokal | `lib/validations/file.validator.ts` |

---

### Bab 4: Konektivitas Database & Connection Pooling (Poin 15)

Di backend MySQL Express (`BACKEND-WEBSITE-main`), konektivitas diimplementasikan menggunakan Connection Pooling via `mysql2/promise`:
```javascript
// Singleton Connection Pool Instance (src/models/db.js / src/db.ts)
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sca_laundry',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'sca_smart_laundry',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Batas connection pooling
  queueLimit: 0,
});
```
Manfaat: Mengoptimalkan pemakaian koneksi database agar tidak terjadi *connection exhaustion* saat banyak request masuk secara bersamaan.

---

### Bab 5: Panduan Deployment Produksi (Poin 22)

1. **Frontend (Vercel):**
   - Push repository ke GitHub.
   - Hubungkan ke Vercel Dashboard.
   - Masukkan Environment Variable:
     - `NEXT_PUBLIC_API_URL=https://api-kamu.railway.app/api`
     - `NEXT_PUBLIC_APP_URL=https://aplikasi-kamu.vercel.app`
2. **Backend (Railway / VPS):**
   - Deploy backend Express dari folder `BACKEND-WEBSITE-main`.
   - Konfigurasi database MySQL (disediakan oleh Railway / AWS RDS).
   - Jalankan `npm run db:migrate` dan `npm run seed`.
   - Pasang environment variable `JWT_SECRET`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`.
