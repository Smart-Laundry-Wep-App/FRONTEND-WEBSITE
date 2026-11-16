import { z } from "zod";

/**
 * Skema Validasi Zod untuk Login & Autentikasi
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Email atau Username minimal 3 karakter" })
    .max(50, { message: "Email atau Username maksimal 50 karakter" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
