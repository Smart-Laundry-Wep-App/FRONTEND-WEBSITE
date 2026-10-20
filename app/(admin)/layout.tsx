import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area page-fade">{children}</main>
    </div>
  );
}
