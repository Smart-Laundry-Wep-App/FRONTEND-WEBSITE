"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useState, useEffect, useRef, forwardRef } from "react";
import {
  Search, ChevronDown, ChevronLeft, ChevronRight, Download, CalendarDays,
  Plus, Percent, FileDown, Eye, Check, UserRound, Mail, Phone, MapPin, Shield,
  Clock3, TicketPercent, Megaphone, HandCoins, ReceiptText, CircleDollarSign,
  WashingMachine, Shirt, Tag, PackageCheck, Trash2,
} from "lucide-react";

export const IconMap: Record<string, LucideIcon> = {
  receipt: ReceiptText, wash: WashingMachine, hand: HandCoins, clock: Clock3,
  percent: Percent, ticket: TicketPercent, megaphone: Megaphone, shirt: Shirt,
  dollar: CircleDollarSign, tag: Tag, check: PackageCheck,
};

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  note?: ReactNode;
  badge?: ReactNode;
  icon?: string;
  wide?: boolean;
}

export function StatCard({
  label,
  value,
  note,
  badge,
  icon = "receipt",
  wide = false,
}: StatCardProps) {
  const Icon = IconMap[icon] ?? ReceiptText;
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Ripple handler for the card
  function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const circle = document.createElement("span");
    const diameter = Math.max(card.clientWidth, card.clientHeight);
    const rect = card.getBoundingClientRect();
    circle.style.cssText = `
      position:absolute;
      width:${diameter}px;height:${diameter}px;
      left:${e.clientX - rect.left - diameter / 2}px;
      top:${e.clientY - rect.top - diameter / 2}px;
      border-radius:50%;
      background:rgba(70,100,232,0.12);
      transform:scale(0);
      animation:ripple 0.6s linear;
      pointer-events:none;
      z-index:10;
    `;
    card.appendChild(circle);
    setTimeout(() => circle.remove(), 700);
  }

  return (
    <div
      ref={cardRef}
      className={`stat-card ${wide ? "wide" : ""} ${visible ? "stat-card--visible" : ""}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="stat-copy">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {note && <div className="stat-note">{note}</div>}
      </div>

      <div className="stat-icon">
        <Icon size={25} strokeWidth={2} />
      </div>

      {badge && <span className="stat-badge">{badge}</span>}
    </div>
  );
}

interface SearchBoxProps { placeholder?: string; className?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }
export function SearchBox({ placeholder, className = "", value, onChange }: SearchBoxProps) {
  return (
    <div className={`search-box ${className}`}>
      <Search size={22} />
      <input placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

// Ripple-enabled button wrapper
function useRipple() {
  function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    circle.style.cssText = `
      position:absolute;
      width:${diameter}px;height:${diameter}px;
      left:${e.clientX - rect.left - diameter / 2}px;
      top:${e.clientY - rect.top - diameter / 2}px;
      border-radius:50%;
      background:rgba(255,255,255,0.25);
      transform:scale(0);
      animation:ripple 0.55s linear;
      pointer-events:none;
    `;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }
  return addRipple;
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; icon?: LucideIcon; className?: string }

export const PrimaryButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function PrimaryButton({ children, icon: Icon = Plus, className = "", onClick, ...props }, ref) {
    const addRipple = useRipple();
    return (
      <button
        ref={ref}
        className={`primary-button ${className}`}
        onClick={(e) => { addRipple(e); onClick?.(e); }}
        {...props}
      >
        <Icon size={20} />{children}
      </button>
    );
  }
);

export const SecondaryButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function SecondaryButton({ children, icon: Icon = FileDown, className = "", onClick, ...props }, ref) {
    const addRipple = useRipple();
    return (
      <button
        ref={ref}
        className={`secondary-button ${className}`}
        onClick={(e) => { addRipple(e); onClick?.(e); }}
        {...props}
      >
        <Icon size={20} />{children}
      </button>
    );
  }
);

interface PillsProps { items: string[]; active?: number; onChange?: (index: number) => void; className?: string }
export function Pills({ items, active = 0, onChange, className = "" }: PillsProps) {
  const [local, setLocal] = useState(active);
  const selected = onChange ? active : local;

  return (
    <div className={`pills ${className}`}>
      {items.map((item, i) => (
        <button
          type="button"
          key={item}
          className={i === selected ? "selected" : ""}
          onClick={() => { setLocal(i); onChange?.(i); }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

interface PaginationProps { total?: number; perPage?: number; page?: number; onPageChange?: (p: number) => void }
export function Pagination({ total = 142, perPage = 5, page = 1, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="pagination-row">
      <span>Menampilkan {Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} dari {total} pesanan</span>
      <div className="pagination">
        <button type="button" onClick={() => onPageChange?.(Math.max(1, page - 1))}><ChevronLeft size={19} /></button>
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(p => (
          <button type="button" key={p} className={p === page ? "current" : ""} onClick={() => onPageChange?.(p)}>{p}</button>
        ))}
        <button type="button" onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}><ChevronRight size={19} /></button>
      </div>
    </div>
  );
}

interface EmptyTableProps { headers: string[]; rows?: number; children?: ReactNode }
export function EmptyTable({ headers, rows = 5, children }: EmptyTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {children ?? Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>{headers.map((_, j) => <td key={j}></td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SelectBox({ children }: { children: ReactNode }) {
  return (
    <button type="button" className="select-box">
      {children}<ChevronDown size={19} />
    </button>
  );
}

export function ProfileIcon({ small = false }: { small?: boolean }) {
  return (
    <div className={`profile-circle ${small ? "small" : ""}`}>
      <UserRound size={small ? 54 : 68} strokeWidth={1.6} />
    </div>
  );
}

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> { label: string; icon?: LucideIcon; type?: string; right?: ReactNode }
export function InputField({ label, icon: Icon, placeholder, type = "text", right, ...props }: InputFieldProps) {
  return (
    <label className="form-label">
      {label}
      <div className="form-field">
        {Icon && <Icon size={21} />}
        <input {...props} type={type} placeholder={placeholder} />
        {right}
      </div>
    </label>
  );
}

export { Search, Download, CalendarDays, Plus, Percent, Eye, Check, UserRound, Mail, Phone, MapPin, Shield, Trash2 };
