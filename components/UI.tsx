"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
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

interface StatCardProps { label: ReactNode; value: ReactNode; note?: ReactNode; badge?: ReactNode; icon?: string; wide?: boolean }
export function StatCard({ label, value, note, badge, icon = "receipt", wide = false }: StatCardProps) {
  const Icon = IconMap[icon] ?? ReceiptText;
  return <div className={`stat-card ${wide ? "wide" : ""}`}><div className="stat-copy"><div className="stat-label">{label}</div><div className="stat-value">{value}</div>{note && <div className="stat-note">{note}</div>}</div><div className="stat-icon"><Icon size={25} strokeWidth={2} /></div>{badge && <span className="stat-badge">{badge}</span>}</div>;
}

interface SearchBoxProps { placeholder?: string; className?: string }
export function SearchBox({ placeholder, className = "" }: SearchBoxProps) { return <div className={`search-box ${className}`}><Search size={22} /><input placeholder={placeholder} /></div>; }

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; icon?: LucideIcon; className?: string }
export function PrimaryButton({ children, icon: Icon = Plus, className = "", ...props }: ActionButtonProps) { return <button className={`primary-button ${className}`} {...props}><Icon size={20} />{children}</button>; }
export function SecondaryButton({ children, icon: Icon = FileDown, className = "", ...props }: ActionButtonProps) { return <button className={`secondary-button ${className}`} {...props}><Icon size={20} />{children}</button>; }

interface PillsProps { items: string[]; active?: number; onChange?: (index: number) => void; className?: string }
export function Pills({ items, active = 0, onChange, className = "" }: PillsProps) { const [local, setLocal] = useState(active); const selected = onChange ? active : local; return <div className={`pills ${className}`}>{items.map((item, i) => <button type="button" key={item} className={i === selected ? "selected" : ""} onClick={() => { setLocal(i); onChange?.(i); }}>{item}</button>)}</div>; }

interface PaginationProps { total?: number; perPage?: number }
export function Pagination({ total = 142, perPage = 5 }: PaginationProps) { return <div className="pagination-row"><span>Menampilkan 1 - {perPage} dari {total} pesanan</span><div className="pagination"><button type="button"><ChevronRight size={19} /></button><button type="button" className="current">1</button><button type="button">2</button><button type="button">3</button><button type="button"><ChevronLeft size={19} /></button></div></div>; }

interface EmptyTableProps { headers: string[]; rows?: number; children?: ReactNode }
export function EmptyTable({ headers, rows = 5, children }: EmptyTableProps) { return <div className="table-wrap"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{children ?? Array.from({ length: rows }).map((_, i) => <tr key={i}>{headers.map((_, j) => <td key={j}></td>)}</tr>)}</tbody></table></div>; }
export function SelectBox({ children }: { children: ReactNode }) { return <button type="button" className="select-box">{children}<ChevronDown size={19} /></button>; }
export function ProfileIcon({ small = false }: { small?: boolean }) { return <div className={`profile-circle ${small ? "small" : ""}`}><UserRound size={small ? 54 : 68} strokeWidth={1.6} /></div>; }

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> { label: string; icon?: LucideIcon; type?: string; right?: ReactNode }
export function InputField({ label, icon: Icon, placeholder, type = "text", right, ...props }: InputFieldProps) { return <label className="form-label">{label}<div className="form-field">{Icon && <Icon size={21} />}<input {...props} type={type} placeholder={placeholder} />{right}</div></label>; }

export { Search, Download, CalendarDays, Plus, Percent, Eye, Check, UserRound, Mail, Phone, MapPin, Shield, Trash2 };
