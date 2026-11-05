# SCA Smart Laundry — Next.js + TypeScript/TSX

Project UI admin SCA Smart Laundry berdasarkan referensi UI WEB.

## Tech stack
- Next.js 15
- React 19
- TypeScript
- TSX
- Lucide React

## Menjalankan project

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Login dengan Google

1. Buat OAuth 2.0 Client ID bertipe Web application di Google Cloud Console.
2. Tambahkan `http://localhost:3000` sebagai Authorized JavaScript origin dan
   `http://localhost:3000/api/auth/callback/google` sebagai Authorized redirect URI.
3. Salin `.env.example` menjadi `.env.local`, lalu isi `AUTH_GOOGLE_ID` dan
   `AUTH_GOOGLE_SECRET` dengan kredensial client tersebut. Isi `AUTH_SECRET`
   dengan secret acak yang kuat.
4. Restart server pengembangan setelah mengubah `.env.local`.

Untuk production, tambahkan domain aplikasi dan callback
`https://<domain>/api/auth/callback/google` di Google Cloud Console, lalu set
`AUTH_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, dan `AUTH_GOOGLE_SECRET` pada
environment deployment.

## Struktur source

Seluruh source halaman dan komponen menggunakan TypeScript/TSX:
- `app/**/*.tsx`
- `components/**/*.tsx`
- `lib/**/*.tsx`

Tidak ada source `.js` atau `.jsx` di project.
