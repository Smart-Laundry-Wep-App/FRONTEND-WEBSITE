"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Header from "@/components/Header";
import { StatCard, SearchBox, SecondaryButton, Pills, EmptyTable, Pagination } from "@/components/UI";
import { CalendarDays, Download, ChevronLeft, ChevronRight, X } from "lucide-react";

/* ─── helpers ─── */
const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS   = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}
function inRange(d: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const t = d.getTime();
  return t > Math.min(start.getTime(), end.getTime()) &&
         t < Math.max(start.getTime(), end.getTime());
}
function fmt(d: Date | null) {
  if (!d) return "";
  return `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
}

/* ─── CalendarPopup ─── */
interface CalendarPopupProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

function CalendarPopup({ anchorRef, onClose }: CalendarPopupProps) {
  const today  = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [start, setStart]   = useState<Date | null>(null);
  const [end,   setEnd]     = useState<Date | null>(null);
  const [hover, setHover]   = useState<Date | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    requestAnimationFrame(() => setVisible(true));
  }, []);

  /* Click outside → close */
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node;
      if (
        popupRef.current && !popupRef.current.contains(target) &&
        anchorRef.current && !anchorRef.current.contains(target)
      ) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  /* ESC */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  /* Build calendar grid */
  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];
  // pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  function handleDayClick(d: Date) {
    if (!start || (start && end)) {
      setStart(d); setEnd(null); setHover(null);
    } else {
      if (d < start) { setEnd(start); setStart(d); }
      else            { setEnd(d); }
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const presets = [
    { label: "Hari ini",       action: () => { setStart(today); setEnd(today); } },
    { label: "7 hari terakhir", action: () => { const d = new Date(today); d.setDate(d.getDate()-6); setStart(d); setEnd(today); } },
    { label: "30 hari terakhir",action: () => { const d = new Date(today); d.setDate(d.getDate()-29); setStart(d); setEnd(today); } },
    { label: "Bulan ini",      action: () => { setStart(new Date(today.getFullYear(), today.getMonth(), 1)); setEnd(today); } },
  ];

  const effectiveEnd = end ?? hover;

  const calendarModal = (
    <div className="history-calendar-overlay">
      <div
        ref={popupRef}
        className={`cal-popup history-calendar-popup${visible ? " cal-popup--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Pilih rentang tanggal"
      >
      {/* Presets sidebar */}
      <div className="cal-presets">
        <p className="cal-presets-title">Pintasan</p>
        {presets.map(p => (
          <button key={p.label} type="button" className="cal-preset-btn" onClick={p.action}>
            {p.label}
          </button>
        ))}
        <hr className="cal-divider" />
        <button
          type="button"
          className="cal-preset-btn cal-preset-reset"
          onClick={() => { setStart(null); setEnd(null); setHover(null); }}
        >
          Reset
        </button>
      </div>

      {/* Calendar main */}
      <div className="cal-main">
        {/* Header nav */}
        <div className="cal-nav">
          <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Bulan sebelumnya">
            <ChevronLeft size={16} />
          </button>
          <span className="cal-nav-title">{MONTHS[viewMonth]} {viewYear}</span>
          <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Bulan berikutnya">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="cal-grid cal-dow-row">
          {DAYS.map(d => <span key={d} className="cal-dow">{d}</span>)}
        </div>

        {/* Date cells */}
        <div className="cal-grid">
          {cells.map((d, i) => {
            if (!d) return <span key={`e-${i}`} className="cal-cell cal-cell--empty" />;
            const isStart   = start && sameDay(d, start);
            const isEnd     = end   && sameDay(d, end);
            const isToday   = sameDay(d, today);
            const isMid     = inRange(d, start, effectiveEnd);
            const isHoverEnd= !end && hover && sameDay(d, hover);
            return (
              <button
                key={d.toISOString()}
                type="button"
                className={[
                  "cal-cell",
                  isToday              ? "cal-cell--today"    : "",
                  isStart              ? "cal-cell--start"    : "",
                  isEnd || isHoverEnd  ? "cal-cell--end"      : "",
                  isMid                ? "cal-cell--mid"      : "",
                  (isStart && (end || hover)) ? "cal-cell--cap-left"  : "",
                  (isEnd   || isHoverEnd)     ? "cal-cell--cap-right" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => handleDayClick(d)}
                onMouseEnter={() => { if (start && !end) setHover(d); }}
                onMouseLeave={() => setHover(null)}
                aria-label={`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`}
                aria-pressed={!!(isStart || isEnd)}
              >
                <span className="cal-day-num">{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        {/* Footer: selected range display + apply */}
        <div className="cal-footer">
          <div className="cal-range-display">
            <span className={`cal-range-chip${start ? " cal-range-chip--filled" : ""}`}>
              {start ? fmt(start) : "Dari tanggal"}
            </span>
            <span className="cal-range-arrow">→</span>
            <span className={`cal-range-chip${end ? " cal-range-chip--filled" : ""}`}>
              {end ? fmt(end) : "Sampai tanggal"}
            </span>
          </div>
          <div className="cal-footer-actions">
            <button type="button" className="cal-btn-cancel" onClick={onClose}>Batal</button>
            <button
              type="button"
              className="cal-btn-apply"
              disabled={!start}
              onClick={onClose}
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>

      {/* Close icon */}
        <button type="button" className="cal-close" aria-label="Tutup kalender" onClick={onClose}>
          <X size={14} />
        </button>
      </div>
    </div>
  );

  return mounted ? createPortal(calendarModal, document.body) : null;
}

/* ─── PAGE ─── */
export default function RiwayatTransaksi() {
  const [calOpen, setCalOpen] = useState(false);
  const calBtnRef = useRef<HTMLButtonElement>(null);
  const closeCalendar = useCallback(() => setCalOpen(false), []);

  return <>
    <Header title="Riwayat Transaksi" subtitle="Rekap lengkap arus kas, metode pembayaran, dan log transaksi pelanggan."/>
    <section className="content history-content">
      <div className="stat-grid history-stats">
        <StatCard label="TOTAL OMSET BULAN INI" value="Rp. 489.000" icon="hand"/>
        <StatCard label="TRANSAKSI BULAN INI" value="1.287 Transaksi" icon="receipt"/>
        <StatCard label="TRANSAKSI PENDAPATAN TERBESAR" value="Rp. 360.000" icon="dollar"/>
      </div>

      <div className="toolbar history-toolbar" style={{ position: "relative" }}>
        <SearchBox placeholder="Cari Riwayat Transaksi, No Pembayaran, Layanan"/>

        {/* TANGGAL button — opens calendar */}
        <SecondaryButton
          ref={calBtnRef}
          icon={CalendarDays}
          onClick={() => setCalOpen(v => !v)}
          aria-expanded={calOpen}
          aria-haspopup="dialog"
        >
          TANGGAL
        </SecondaryButton>

        <SecondaryButton icon={Download}>DOWNLOAD</SecondaryButton>

        {/* Calendar popup */}
        {calOpen && (
          <CalendarPopup anchorRef={calBtnRef} onClose={closeCalendar} />
        )}
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-label">TOTAL OMSET / PENDAPATAN</div>
          <span className="chart-badge">Grafik Arus Kas</span>
        </div>
        <div className="chart">
          <div className="chart-y">
            <span>Rp. 2.000.000</span>
            <span>Rp. 1.500.000</span>
            <span>Rp. 1.000.000</span>
            <span>Rp. 500.000</span>
            <span>Rp. 0</span>
          </div>
          <div className="chart-svg-wrap">
            <svg viewBox="0 0 820 155" preserveAspectRatio="none">
              <g>
                <path
                  d="M70 146 L120 98 L210 55 L330 85 L465 78 L630 28 L770 35 L770 155 L70 155 Z"
                  fill="rgba(70, 100, 232, 0.1)"
                />
                <path
                  className="chart-line"
                  d="M70 146 L120 98 L210 55 L330 85 L465 78 L630 28 L770 35"
                  fill="none"
                  stroke="#2531b6"
                  strokeWidth="1.2"
                  pathLength="1"
                />
                <circle className="chart-point" cx="70" cy="146" r="3.5" fill="#ef4444" />
                <circle className="chart-point" cx="120" cy="98" r="3.5" fill="#ff8a65" />
                <circle className="chart-point" cx="210" cy="55" r="3.5" fill="#4d9d00" />
                <circle className="chart-point" cx="330" cy="85" r="3.5" fill="#ff8a65" />
                <circle className="chart-point" cx="465" cy="78" r="3.5" fill="#ff8a65" />
                <circle className="chart-point" cx="630" cy="28" r="3.5" fill="#4d9d00" />
                <circle className="chart-point" cx="770" cy="35" r="3.5" fill="#4d9d00" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <Pills items={["Semua","Menunggu Pembayaran","Lunas","Dibatalkan"]}/>
      <EmptyTable headers={["TANGGAL","NO. TRANSAKSI","PELANGGAN","METODE PEMBAYARAN","STATUS"]} rows={3}/>
      <Pagination/>
    </section>
  </>;
}
