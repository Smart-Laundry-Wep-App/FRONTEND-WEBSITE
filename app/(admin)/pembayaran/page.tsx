"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Header from "@/components/Header";
import {
  SearchBox,
  StatCard,
  Pills,
  EmptyTable,
  Pagination,
} from "@/components/UI";
import { Trash2, CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isBetween(day: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  return day > start && day < end;
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

interface PaymentCalendarProps {
  anchorRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

function PaymentCalendar({ anchorRef, onClose }: PaymentCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const [visible, setVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!anchorRef.current?.contains(event.target as Node)) onClose();
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [anchorRef, onClose]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(viewYear, viewMonth, index + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function changeMonth(offset: number) {
    const date = new Date(viewYear, viewMonth + offset, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  }

  function selectDay(date: Date) {
    if (!start || end) {
      setStart(date);
      setEnd(null);
      setHover(null);
    } else if (date < start) {
      setEnd(start);
      setStart(date);
    } else {
      setEnd(date);
    }
  }

  const effectiveEnd = end ?? hover;

  return (
    <div
      ref={popupRef}
      className={`cal-popup payment-calendar-popup${visible ? " cal-popup--open" : ""}`}
      role="dialog"
      aria-label="Pilih rentang tanggal pembayaran"
    >
      <div className="cal-main">
        <div className="cal-nav">
          <button type="button" className="cal-nav-btn" onClick={() => changeMonth(-1)} aria-label="Bulan sebelumnya">
            <ChevronLeft size={16} />
          </button>
          <span className="cal-nav-title">{MONTHS[viewMonth]} {viewYear}</span>
          <button type="button" className="cal-nav-btn" onClick={() => changeMonth(1)} aria-label="Bulan berikutnya">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="cal-grid cal-dow-row">
          {DAYS.map((day) => <span key={day} className="cal-dow">{day}</span>)}
        </div>

        <div className="cal-grid">
          {cells.map((date, index) => {
            if (!date) return <span key={`empty-${index}`} className="cal-cell cal-cell--empty" />;
            const isStart = !!start && sameDay(date, start);
            const isEnd = !!end && sameDay(date, end);
            const isToday = sameDay(date, today);
            const isHoverEnd = !end && !!hover && sameDay(date, hover);
            const isMid = isBetween(date, start, effectiveEnd);
            return (
              <button
                key={date.toISOString()}
                type="button"
                className={[
                  "cal-cell",
                  isToday ? "cal-cell--today" : "",
                  isStart ? "cal-cell--start" : "",
                  isEnd || isHoverEnd ? "cal-cell--end" : "",
                  isMid ? "cal-cell--mid" : "",
                  isStart && (end || hover) ? "cal-cell--cap-left" : "",
                  isEnd || isHoverEnd ? "cal-cell--cap-right" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => selectDay(date)}
                onMouseEnter={() => { if (start && !end) setHover(date); }}
                onMouseLeave={() => setHover(null)}
                aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
                aria-pressed={isStart || isEnd}
              >
                <span className="cal-day-num">{date.getDate()}</span>
              </button>
            );
          })}
        </div>

        <div className="cal-footer">
          <div className="cal-range-display">
            <span className={`cal-range-chip${start ? " cal-range-chip--filled" : ""}`}>
              {start ? formatDate(start) : "Dari tanggal"}
            </span>
            <span className="cal-range-arrow">→</span>
            <span className={`cal-range-chip${end ? " cal-range-chip--filled" : ""}`}>
              {end ? formatDate(end) : "Sampai tanggal"}
            </span>
          </div>
          <div className="cal-footer-actions">
            <button type="button" className="cal-btn-cancel" onClick={onClose}>Batal</button>
            <button type="button" className="cal-btn-apply" disabled={!start} onClick={onClose}>
              Terapkan
            </button>
          </div>
        </div>
      </div>
      <button type="button" className="cal-close" aria-label="Tutup kalender" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}

export default function Pembayaran() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Header
        title="Pembayaran"
        subtitle="Verifikasi tagihan pelanggan dan pembayaran laundry"
      />

      <section className="content">
        <div className="payment-top">
          <SearchBox placeholder="Cari No Pembayaran, Nama Pelanggan" />

          <StatCard
            label="MENUNGGU PELUNASAN"
            value="Rp. 100.000"
            note="2 Order"
            icon="clock"
          />

          <StatCard
            label="LUNAS HARI INI"
            value="Rp. 480.000"
            note="7 Order"
            icon="hand"
          />
        </div>

        <div className="payment-controls">
          <Pills
            items={[
              "Menunggu Pembayaran",
              "Sudah Dibayar",
              "Selesai",
            ]}
          />

          <div className="button-group">
            <button className="danger-button">
              <Trash2 size={19} />
              Delete
            </button>

            <div className="payment-calendar-anchor" ref={calendarAnchorRef}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCalendarOpen((open) => !open)}
                aria-expanded={calendarOpen}
                aria-haspopup="dialog"
              >
                <CalendarDays size={20} />
                Filter Tanggal
              </button>
              {calendarOpen && (
                <PaymentCalendar
                  anchorRef={calendarAnchorRef}
                  onClose={() => setCalendarOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        <EmptyTable
          headers={[
            "NO. ORDER",
            "PELANGGAN",
            "TOTAL",
            "STATUS",
            "PEMBAYARAN",
          ]}
        />

        <Pagination />
      </section>
    </>
  );
}