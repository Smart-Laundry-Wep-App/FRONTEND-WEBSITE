import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import AdminAuthGuard from "@/components/AdminAuthGuard";

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AdminAuthGuard>
      <div className="app-shell">
        <Sidebar />
        <main className="main-area page-fade">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
