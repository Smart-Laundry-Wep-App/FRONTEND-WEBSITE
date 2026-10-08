"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, WashingMachine, WalletCards, HandCoins, Percent,
  ChartNoAxesCombined, Bell, UserRound, LogOut,
} from "lucide-react";

interface NavItem { href: string; label: string; icon: LucideIcon }

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kelola-pesanan", label: "Kelola Pesanan", icon: WashingMachine },
  { href: "/pembayaran", label: "Pembayaran", icon: WalletCards },
  { href: "/riwayat-transaksi", label: "Riwayat Transaksi", icon: HandCoins },
  { href: "/info-promo", label: "Info Promo", icon: Percent },
  { href: "/layanan-harga", label: "Layanan dan Harga", icon: ChartNoAxesCombined },
  { href: "/notifikasi", label: "Notifikasi", icon: Bell },
  { href: "/profil-admin", label: "Profil Admin", icon: UserRound },
  { href: "/logout", label: "Logout Akun", icon: LogOut },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="brand">
        <Image src="/logo.png" alt="SCA Smart Laundry" width={55} height={55} priority />
        <span>SCA Smart Laundry</span>
      </Link>
      <nav className="sidebar-nav">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`nav-item ${pathname === href ? "active" : ""}`}>
            <div className="nav-icon-container">
              <Icon size={28} strokeWidth={1.9} />
            </div>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
