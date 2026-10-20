import { Bell, CircleUserRound } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  hide?: boolean;
}

export default function Header({ title, subtitle, hide = false }: HeaderProps) {
  return (
    <header className={`page-header ${hide ? "header-empty" : ""}`}>
      {!hide && (
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      <div className="header-account">
        <Bell size={28} strokeWidth={1.9} />
        <span><CircleUserRound size={28} strokeWidth={1.9} />Admin Laundry</span>
      </div>
    </header>
  );
}
