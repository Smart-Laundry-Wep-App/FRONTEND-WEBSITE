/**
 * Augmentasi Tipe Request kustom untuk PBL Next.js
 * Menambahkan atribut kustom (user, role) pada Request beserta deklarasi tipe .d.ts
 */

export interface AuthUserData {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "Admin" | "Kasir" | "Customer" | string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserData;
      role?: string;
    }
  }

  interface Request {
    user?: AuthUserData;
    role?: string;
  }
}

declare module "next/server" {
  interface NextRequest {
    user?: AuthUserData;
    role?: string;
  }
}

export {};
