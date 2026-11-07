import { DUMMY_NOTIFICATIONS, type DummyNotification } from "@/lib/dummyData";

export const NOTIFICATIONS_STORAGE_KEY = "sca-smart-laundry-notifications";
export const NOTIFICATIONS_UPDATED_EVENT = "sca-notifications-updated";

function isNotification(value: unknown): value is DummyNotification {
  if (!value || typeof value !== "object") return false;
  const notification = value as Partial<DummyNotification>;

  return (
    typeof notification.id === "string" &&
    typeof notification.title === "string" &&
    typeof notification.message === "string" &&
    typeof notification.date === "string" &&
    (notification.status === "Terkirim" ||
      notification.status === "Sedang diproses" ||
      notification.status === "Gagal")
  );
}

export function readNotifications(): DummyNotification[] {
  const stored = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (stored === null) return DUMMY_NOTIFICATIONS;

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every(isNotification)) {
    throw new Error("Data notifikasi tersimpan tidak valid.");
  }

  return parsed;
}

export function saveNotifications(notifications: DummyNotification[]) {
  window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}
