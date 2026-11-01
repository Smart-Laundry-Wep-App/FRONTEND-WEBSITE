// lib/dummyData.ts
// Dataset dummy lengkap untuk demonstrasi dan presentasi sistem laundry SCA Smart Laundry

export interface DummyOrder {
  id: string;
  customer: string;
  phone: string;
  service: string;
  weight: number;
  pricePerKg: number;
  totalAmount: number;
  status: "Sedang Cuci" | "Pengantaran" | "Siap Diambil" | "Antaran" | "Pengeringan" | "Selesai";
  paymentStatus: "Lunas" | "Menunggu Pembayaran" | "Belum Bayar" | "Dibatalkan";
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  estimatedCompletion: string;
}

export const DUMMY_ORDERS: DummyOrder[] = [
  {
    id: "ORD-8921",
    customer: "Ahmad Fauzi",
    phone: "081299881122",
    service: "Cuci Kering Setrika",
    weight: 4.5,
    pricePerKg: 9500,
    totalAmount: 42750,
    status: "Sedang Cuci",
    paymentStatus: "Lunas",
    paymentMethod: "QRIS BCA",
    notes: "Pisahkan baju luntur warna merah",
    createdAt: "2026-10-28T08:30:00.000Z",
    estimatedCompletion: "2026-10-29T17:00:00.000Z",
  },
  {
    id: "ORD-8922",
    customer: "Siti Rahmawati",
    phone: "085712345678",
    service: "Cuci Bedcover & Selimut",
    weight: 6.0,
    pricePerKg: 15000,
    totalAmount: 90000,
    status: "Sedang Cuci",
    paymentStatus: "Lunas",
    paymentMethod: "Transfer Bank BCA",
    notes: "Gunakan pewangi aroma lavender",
    createdAt: "2026-10-28T09:15:00.000Z",
    estimatedCompletion: "2026-10-30T12:00:00.000Z",
  },
  {
    id: "ORD-8923",
    customer: "Dewi Lestari",
    phone: "087855443322",
    service: "Cuci Kering Lipat",
    weight: 3.2,
    pricePerKg: 7500,
    totalAmount: 24000,
    status: "Siap Diambil",
    paymentStatus: "Lunas",
    paymentMethod: "Tunai (Kasir)",
    notes: "Baju seragam kantor",
    createdAt: "2026-10-27T14:10:00.000Z",
    estimatedCompletion: "2026-10-28T10:00:00.000Z",
  },
  {
    id: "ORD-8924",
    customer: "Bambang Pamungkas",
    phone: "081377889900",
    service: "Express 3 Jam (Kilat)",
    weight: 2.5,
    pricePerKg: 18000,
    totalAmount: 45000,
    status: "Pengantaran",
    paymentStatus: "Menunggu Pembayaran",
    paymentMethod: "COD / Tagihan Antar",
    notes: "Antar ke Apartemen Lotus Tower B Lt. 12",
    createdAt: "2026-10-28T10:00:00.000Z",
    estimatedCompletion: "2026-10-28T13:00:00.000Z",
  },
  {
    id: "ORD-8925",
    customer: "Hendra Gunawan",
    phone: "082144332211",
    service: "Cuci Sepatu Premium",
    weight: 1.0,
    pricePerKg: 35000,
    totalAmount: 35000,
    status: "Sedang Cuci",
    paymentStatus: "Lunas",
    paymentMethod: "QRIS Mandiri",
    notes: "Sneakers bahan suede putih",
    createdAt: "2026-10-28T10:45:00.000Z",
    estimatedCompletion: "2026-10-30T15:00:00.000Z",
  },
  {
    id: "ORD-8926",
    customer: "Clarissa Putri",
    phone: "081900112233",
    service: "Cuci Kering Setrika",
    weight: 5.8,
    pricePerKg: 9500,
    totalAmount: 55100,
    status: "Antaran",
    paymentStatus: "Menunggu Pembayaran",
    paymentMethod: "Transfer Mandiri",
    notes: "Gantungan baju sudah disiapkan di tas",
    createdAt: "2026-10-27T11:20:00.000Z",
    estimatedCompletion: "2026-10-28T17:00:00.000Z",
  },
  {
    id: "ORD-8927",
    customer: "Rizky Ramadhan",
    phone: "085611223344",
    service: "Setrika Uap Saja",
    weight: 4.0,
    pricePerKg: 5000,
    totalAmount: 20000,
    status: "Siap Diambil",
    paymentStatus: "Lunas",
    paymentMethod: "Tunai (Kasir)",
    notes: "Kemeja kerja tanpa lipatan lengan",
    createdAt: "2026-10-27T16:00:00.000Z",
    estimatedCompletion: "2026-10-28T11:00:00.000Z",
  },
  {
    id: "ORD-8928",
    customer: "Naufal Pratama",
    phone: "081288229911",
    service: "Cuci Jas Formal & Blazer",
    weight: 2.0,
    pricePerKg: 25000,
    totalAmount: 50000,
    status: "Sedang Cuci",
    paymentStatus: "Lunas",
    paymentMethod: "QRIS BCA",
    notes: "Jas formal bahan wol warna navy",
    createdAt: "2026-10-28T11:15:00.000Z",
    estimatedCompletion: "2026-10-30T10:00:00.000Z",
  },
];

export interface DummyPayment {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  total: number;
  status: "Lunas" | "Menunggu Pembayaran" | "Selesai";
  paymentMethod: string;
  paidAt?: string;
}

export const DUMMY_PAYMENTS: DummyPayment[] = [
  {
    id: "PAY-1001",
    orderId: "ORD-8921",
    customer: "Ahmad Fauzi",
    phone: "0812-9988-1122",
    total: 42750,
    status: "Lunas",
    paymentMethod: "QRIS BCA",
    paidAt: "28 Okt 2026, 08:32 WIB",
  },
  {
    id: "PAY-1002",
    orderId: "ORD-8922",
    customer: "Siti Rahmawati",
    phone: "0857-1234-5678",
    total: 90000,
    status: "Lunas",
    paymentMethod: "Transfer Bank BCA",
    paidAt: "28 Okt 2026, 09:20 WIB",
  },
  {
    id: "PAY-1003",
    orderId: "ORD-8924",
    customer: "Bambang Pamungkas",
    phone: "0813-7788-9900",
    total: 45000,
    status: "Menunggu Pembayaran",
    paymentMethod: "COD / Tagihan Antar",
  },
  {
    id: "PAY-1004",
    orderId: "ORD-8926",
    customer: "Clarissa Putri",
    phone: "0819-0011-2233",
    total: 55000,
    status: "Menunggu Pembayaran",
    paymentMethod: "Transfer Mandiri",
  },
  {
    id: "PAY-1005",
    orderId: "ORD-8925",
    customer: "Hendra Gunawan",
    phone: "0821-4433-2211",
    total: 35000,
    status: "Lunas",
    paymentMethod: "QRIS Mandiri",
    paidAt: "28 Okt 2026, 10:46 WIB",
  },
  {
    id: "PAY-1006",
    orderId: "ORD-8923",
    customer: "Dewi Lestari",
    phone: "0878-5544-3322",
    total: 24000,
    status: "Selesai",
    paymentMethod: "Tunai (Kasir)",
    paidAt: "27 Okt 2026, 14:15 WIB",
  },
  {
    id: "PAY-1007",
    orderId: "ORD-8927",
    customer: "Rizky Ramadhan",
    phone: "0856-1122-3344",
    total: 20000,
    status: "Selesai",
    paymentMethod: "Tunai (Kasir)",
    paidAt: "27 Okt 2026, 16:05 WIB",
  },
];

export interface DummyTransaction {
  id: string;
  orderId: string;
  date: string;
  customer: string;
  phone: string;
  paymentMethod: string;
  total: number;
  status: "Lunas" | "Menunggu Pembayaran" | "Dibatalkan";
}

export const DUMMY_TRANSACTIONS: DummyTransaction[] = [
  {
    id: "TRX-20261028-001",
    orderId: "ORD-8921",
    date: "28 Okt 2026, 08:30 WIB",
    customer: "Ahmad Fauzi",
    phone: "0812-9988-1122",
    paymentMethod: "QRIS BCA",
    total: 42750,
    status: "Lunas",
  },
  {
    id: "TRX-20261028-002",
    orderId: "ORD-8922",
    date: "28 Okt 2026, 09:15 WIB",
    customer: "Siti Rahmawati",
    phone: "0857-1234-5678",
    paymentMethod: "Transfer Bank BCA",
    total: 90000,
    status: "Lunas",
  },
  {
    id: "TRX-20261028-003",
    orderId: "ORD-8924",
    date: "28 Okt 2026, 10:00 WIB",
    customer: "Bambang Pamungkas",
    phone: "0813-7788-9900",
    paymentMethod: "COD / Kasir",
    total: 45000,
    status: "Menunggu Pembayaran",
  },
  {
    id: "TRX-20261028-004",
    orderId: "ORD-8925",
    date: "28 Okt 2026, 10:45 WIB",
    customer: "Hendra Gunawan",
    phone: "0821-4433-2211",
    paymentMethod: "QRIS Mandiri",
    total: 35000,
    status: "Lunas",
  },
  {
    id: "TRX-20261027-005",
    orderId: "ORD-8926",
    date: "27 Okt 2026, 11:20 WIB",
    customer: "Clarissa Putri",
    phone: "0819-0011-2233",
    paymentMethod: "Transfer Bank Mandiri",
    total: 55100,
    status: "Menunggu Pembayaran",
  },
  {
    id: "TRX-20261027-006",
    orderId: "ORD-8923",
    date: "27 Okt 2026, 14:10 WIB",
    customer: "Dewi Lestari",
    phone: "0878-5544-3322",
    paymentMethod: "Tunai (Kasir)",
    total: 24000,
    status: "Lunas",
  },
  {
    id: "TRX-20261027-007",
    orderId: "ORD-8920",
    date: "27 Okt 2026, 09:00 WIB",
    customer: "Budi Kurniawan",
    phone: "0852-3344-5566",
    paymentMethod: "Transfer Bank BRI",
    total: 18000,
    status: "Dibatalkan",
  },
];

export interface DummyNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  status: "Terkirim" | "Sedang diproses" | "Gagal";
}

export const DUMMY_NOTIFICATIONS: DummyNotification[] = [
  {
    id: "notif-001",
    title: "Pesanan #ORD-8921",
    message: "Halo Kak Ahmad Fauzi, cucian Anda (4.5 kg) sedang dalam proses pencucian & higienisasi di mesin 02.",
    date: "28 OKT 2026",
    status: "Terkirim",
  },
  {
    id: "notif-002",
    title: "Pembayaran #ORD-8922",
    message: "Halo Kak Siti Rahmawati, verifikasi pembayaran Rp 90.000 via Transfer BCA berhasil. Terima kasih!",
    date: "28 OKT 2026",
    status: "Terkirim",
  },
  {
    id: "notif-003",
    title: "Kurir Antar #ORD-8924",
    message: "Halo Kak Bambang, kurir express sedang mengantarkan cucian Anda ke Apartemen Lotus Tower B.",
    date: "28 OKT 2026",
    status: "Sedang diproses",
  },
  {
    id: "notif-004",
    title: "Pesanan Siap #ORD-8923",
    message: "Halo Kak Dewi Lestari, cucian Anda sudah selesai disetrika wangi & siap diambil di Outlet Sigura.",
    date: "27 OKT 2026",
    status: "Terkirim",
  },
  {
    id: "notif-005",
    title: "Tagihan Belum Lunas #ORD-8926",
    message: "Halo Kak Clarissa, pengingat tagihan Rp 55.000 untuk pesanan #ORD-8926 via WhatsApp gateway.",
    date: "27 OKT 2026",
    status: "Gagal",
  },
  {
    id: "notif-006",
    title: "Promo Spesial Member",
    message: "Halo Kak Hendra Gunawan, gunakan voucher DISKONMEMBER untuk potongan 15% pesanan berikutnya!",
    date: "26 OKT 2026",
    status: "Terkirim",
  },
];

export interface DummyPromo {
  id: string;
  name: string;
  code: string;
  discount: string;
  period: string;
  status: "Aktif" | "Non Aktif";
}

export const DUMMY_PROMOS: DummyPromo[] = [
  {
    id: "prm-001",
    name: "Diskon Member Baru",
    code: "DISKONMEMBER",
    discount: "15% (Maks. Rp 15.000)",
    period: "01 Okt - 31 Des 2026",
    status: "Aktif",
  },
  {
    id: "prm-002",
    name: "Weekend Hemat Cuci Kiloan",
    code: "WEEKENDHEMAT",
    discount: "Potongan Rp 10.000",
    period: "Sabtu & Minggu",
    status: "Aktif",
  },
  {
    id: "prm-003",
    name: "Kilat Hemat Express 3 Jam",
    code: "KILATHEMAT",
    discount: "25% (Min. 3 kg)",
    period: "10 Okt - 15 Nov 2026",
    status: "Aktif",
  },
  {
    id: "prm-004",
    name: "Spesial Cuci Bedcover & Sprei",
    code: "BEDCOVERWASH",
    discount: "Potongan 20%",
    period: "01 Nov - 30 Nov 2026",
    status: "Aktif",
  },
  {
    id: "prm-005",
    name: "Diskon Pelajar & Mahasiswa",
    code: "STUDENTWASH",
    discount: "Potongan 10%",
    period: "Berlaku s/d Akhir Tahun",
    status: "Aktif",
  },
  {
    id: "prm-006",
    name: "Diskon Gajian Akhir Bulan",
    code: "PAYDAYLAUNDRY",
    discount: "Potongan Rp 15.000",
    period: "25 - 30 Setiap Bulan",
    status: "Non Aktif",
  },
];

export interface DummyService {
  id: string;
  name: string;
  category: "Cuci Kiloan" | "Cuci Satuan" | "Express" | "Khusus";
  estimatedTime: string;
  price: string;
  status: "Aktif" | "Non Aktif";
}

export const DUMMY_SERVICES: DummyService[] = [
  {
    id: "srv-001",
    name: "Cuci Kering Setrika",
    category: "Cuci Kiloan",
    estimatedTime: "24 Jam (1 Hari)",
    price: "Rp 9.500 / kg",
    status: "Aktif",
  },
  {
    id: "srv-002",
    name: "Cuci Kering Lipat",
    category: "Cuci Kiloan",
    estimatedTime: "24 Jam (1 Hari)",
    price: "Rp 7.500 / kg",
    status: "Aktif",
  },
  {
    id: "srv-003",
    name: "Setrika Uap Saja",
    category: "Cuci Kiloan",
    estimatedTime: "12 Jam",
    price: "Rp 5.000 / kg",
    status: "Aktif",
  },
  {
    id: "srv-004",
    name: "Express Kilat 3 Jam (Cuci + Setrika)",
    category: "Express",
    estimatedTime: "3 Jam Selesai",
    price: "Rp 18.000 / kg",
    status: "Aktif",
  },
  {
    id: "srv-005",
    name: "Cuci Sepatu Premium (Deep Clean)",
    category: "Khusus",
    estimatedTime: "48 Jam (2 Hari)",
    price: "Rp 35.000 / pasang",
    status: "Aktif",
  },
  {
    id: "srv-006",
    name: "Cuci Bedcover King Size",
    category: "Khusus",
    estimatedTime: "48 Jam (2 Hari)",
    price: "Rp 35.000 / pcs",
    status: "Aktif",
  },
  {
    id: "srv-007",
    name: "Cuci Jas Formal & Blazer",
    category: "Cuci Satuan",
    estimatedTime: "48 Jam (2 Hari)",
    price: "Rp 25.000 / pcs",
    status: "Aktif",
  },
  {
    id: "srv-008",
    name: "Cuci Karpet Tebal & Permadani",
    category: "Khusus",
    estimatedTime: "72 Jam (3 Hari)",
    price: "Rp 20.000 / meter",
    status: "Aktif",
  },
];
