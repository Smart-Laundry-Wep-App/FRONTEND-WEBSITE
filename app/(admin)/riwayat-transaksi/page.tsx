"use client";
import { useState, useRef, useEffect, useCallback } from "react";
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
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

function CalendarPopup({ anchorRef, onClose }: CalendarPopupProps) {
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

  /* Click outside → close */
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

  /* Build calendar grid */
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
      aria-label="Pilih rentang tanggal riwayat transaksi"
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
            const isMid = inRange(date, start, effectiveEnd);
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
              {start ? fmt(start) : "Dari tanggal"}
            </span>
            <span className="cal-range-arrow">→</span>
            <span className={`cal-range-chip${end ? " cal-range-chip--filled" : ""}`}>
              {end ? fmt(end) : "Sampai tanggal"}
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

import { DUMMY_TRANSACTIONS, type DummyTransaction } from "@/lib/dummyData";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const TX_PILLS = ["Semua", "Menunggu Pembayaran", "Lunas", "Dibatalkan"];

/* ─── PAGE ─── */
export default function RiwayatTransaksi() {
  const [calOpen, setCalOpen] = useState(false);
  const calendarAnchorRef = useRef<HTMLDivElement>(null);
  const closeCalendar = useCallback(() => setCalOpen(false), []);
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("Semua");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filteredTransactions = DUMMY_TRANSACTIONS.filter((tx) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || Object.values(tx).some((value) =>
      String(value ?? "").toLowerCase().includes(q),
    );

    if (!matchesSearch) return false;
    if (selectedPill === "Semua") return true;
    return tx.status.toLowerCase() === selectedPill.toLowerCase();
  });

  const visibleTransactions = filteredTransactions.slice((page - 1) * perPage, page * perPage);

  function handleDownload() {
    const headers = ["Tanggal", "No Transaksi", "No Order", "Pelanggan", "Telepon", "Metode", "Total", "Status"];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.id,
      t.orderId,
      t.customer,
      t.phone,
      t.paymentMethod,
      t.total,
      t.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-transaksi-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return <>
    <Header title="Riwayat Transaksi" subtitle="Rekap lengkap arus kas, metode pembayaran, dan log transaksi pelanggan."/>
    <section className="content history-content">
      <div className="stat-grid history-stats">
        <StatCard label="TOTAL OMSET BULAN INI" value="Rp. 489.000" icon="hand"/>
        <StatCard label="TRANSAKSI BULAN INI" value="1.287 Transaksi" icon="receipt"/>
        <StatCard label="TRANSAKSI PENDAPATAN TERBESAR" value="Rp. 360.000" icon="dollar"/>
      </div>

      <div className="toolbar history-toolbar" style={{ position: "relative" }}>
        <SearchBox
          placeholder="Cari Riwayat Transaksi, No Pembayaran, Pelanggan..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* TANGGAL button & calendar anchor */}
        <div className="payment-calendar-anchor" ref={calendarAnchorRef}>
          <SecondaryButton
            icon={CalendarDays}
            onClick={() => setCalOpen(v => !v)}
            aria-expanded={calOpen}
            aria-haspopup="dialog"
          >
            TANGGAL
          </SecondaryButton>
          {calOpen && (
            <CalendarPopup anchorRef={calendarAnchorRef} onClose={closeCalendar} />
          )}
        </div>

        <SecondaryButton icon={Download} onClick={handleDownload}>
          DOWNLOAD
        </SecondaryButton>
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

      <Pills
        items={TX_PILLS}
        active={TX_PILLS.indexOf(selectedPill)}
        onChange={(index) => {
          setSelectedPill(TX_PILLS[index]);
          setPage(1);
        }}
      />

      <EmptyTable headers={["TANGGAL","NO. TRANSAKSI","PELANGGAN","METODE PEMBAYARAN","STATUS"]} rows={0}>
        {visibleTransactions.length > 0 ? (
          visibleTransactions.map((tx) => (
            <tr key={tx.id}>
              <td>
                <strong>{tx.date.split(",")[0]}</strong>
                <small>{tx.date.split(",")[1]?.trim() ?? ""}</small>
              </td>
              <td>
                <strong>{tx.id}</strong>
                <small>Order: {tx.orderId}</small>
              </td>
              <td>
                <strong>{tx.customer}</strong>
                <small>{tx.phone}</small>
              </td>
              <td>
                <strong>{tx.paymentMethod}</strong>
                <small>{formatRupiah(tx.total)}</small>
              </td>
              <td>
                <span className={`status ${tx.status.toLowerCase().replaceAll(" ", "-")}`}>
                  {tx.status}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
              Tidak ada data riwayat transaksi yang cocok.
            </td>
          </tr>
        )}
      </EmptyTable>

      <Pagination
        total={filteredTransactions.length}
        perPage={perPage}
        page={page}
        onPageChange={setPage}
      />
    </section>
  </>;
}
