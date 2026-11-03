"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CircleUserRound } from "lucide-react";
import {
  NOTIFICATIONS_UPDATED_EVENT,
  readNotifications,
} from "@/lib/notificationStorage";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  hide?: boolean;
}

export default function Header({ title, subtitle, hide = false }: HeaderProps) {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const updateNotificationCount = () => {
      try {
        setNotificationCount(readNotifications().length);
      } catch (error) {
        console.error("Gagal membaca jumlah notifikasi:", error);
      }
    };

    updateNotificationCount();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, updateNotificationCount);
    window.addEventListener("storage", updateNotificationCount);

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, updateNotificationCount);
      window.removeEventListener("storage", updateNotificationCount);
    };
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
        <span><CircleUserRound size={28} strokeWidth={1.9} />Admin Laundry</span>
      </div>
    </header>
  );
}
