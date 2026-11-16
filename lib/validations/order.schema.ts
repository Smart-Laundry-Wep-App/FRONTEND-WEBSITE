import { z } from "zod";

/**
 * Skema Validasi Zod untuk Pesanan Laundry
 */
export const orderSchema = z.object({
  customer: z
    .string()
    .min(3, { message: "Nama pelanggan minimal 3 karakter" })
    .max(100, { message: "Nama pelanggan maksimal 100 karakter" })
    .regex(/^[a-zA-Z\s'.\-]+$/, {
      message: "Nama pelanggan hanya boleh berupa huruf dan tanda baca nama",
    }),
  phone: z
    .string()
    .min(10, { message: "Nomor telepon minimal 10 digit" })
    .max(15, { message: "Nomor telepon maksimal 15 digit" })
    .regex(/^[0-9+]+$/, { message: "Nomor telepon hanya boleh berisi angka" }),
  serviceId: z.string().min(1, { message: "Pilih jenis layanan laundry" }),
  weight: z
    .number()
    .positive({ message: "Berat cucian harus lebih besar dari 0" })
    .max(500, { message: "Berat cucian maksimal 500 kg" }),
  pricePerKg: z
    .number()
    .positive({ message: "Tarif per kg harus lebih besar dari 0" }),
  status: z
    .enum(["Sedang Cuci", "Siap Diambil", "Pengantaran", "Selesai"])
    .default("Sedang Cuci"),
  notes: z.string().max(255).optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
