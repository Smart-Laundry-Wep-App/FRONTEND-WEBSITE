"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CircleUserRound } from "lucide-react";
import { api } from "@/lib/api";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  hide?: boolean;
}

export default function Header({ title, subtitle, hide = false }: HeaderProps) {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let active = true;
    api.get<{ notifications: unknown[]; pagination: { total: number } }>("/notifications", { params: { page: 1, limit: 1 } })
      .then((response) => {
        if (active) setNotificationCount(response.data.pagination.total);
      })
      .catch((error: unknown) => console.error("Gagal memuat jumlah notifikasi:", error));
    return () => { active = false; };
  }, []);

  return (
    <header className={`page-header ${hide ? "header-empty" : ""}`}>
      {!hide && (
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      <div className="header-account">
        <Link
          href="/notifikasi"
          className="header-notification-link"
          aria-label={`Notifikasi: ${notificationCount}`}
        >
          <Bell size={28} strokeWidth={1.9} />
          {notificationCount > 0 && (
            <span className="header-notification-badge">{notificationCount}</span>
          )}
        </Link>
        <Link href="/profil-admin" className="header-profile-link">
          <CircleUserRound size={28} strokeWidth={1.9} />
          Profil Admin
        </Link>
      </div>
    </header>
  );
}
