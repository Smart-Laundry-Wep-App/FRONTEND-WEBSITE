# SCA Smart Laundry — Next.js + TypeScript/TSX

Project UI admin SCA Smart Laundry berdasarkan referensi UI WEB.
Frontend terhubung ke REST API Express di backend melalui `NEXT_PUBLIC_API_URL`.

## Tech stack
- Next.js 15
- React 19
- TypeScript
- TSX
- Lucide React

## Menjalankan project

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

Pastikan backend dan MySQL sudah dikonfigurasi, migrasi serta seed admin telah dijalankan. Login menggunakan username/email dan password admin yang dibuat saat seed. Dashboard, pesanan, pembayaran, promo, layanan, transaksi, notifikasi, dan profil membaca atau menyimpan data melalui backend. URL API dapat diubah lewat `NEXT_PUBLIC_API_URL` di `.env.local`; nilai development default adalah `http://localhost:5000/api`.

## Struktur source

Seluruh source halaman dan komponen menggunakan TypeScript/TSX:
- `app/**/*.tsx`
- `components/**/*.tsx`
- `lib/**/*.tsx`

Tidak ada source `.js` atau `.jsx` di project.
