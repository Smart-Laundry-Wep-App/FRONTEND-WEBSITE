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

/* ─── REVENUE CHART ─── */
const CHART_DATA = [
  { label: "Mei '26",  value: 320000 },
  { label: "Jun '26",  value: 780000 },
  { label: "Jul '26",  value: 1250000 },
  { label: "Agu '26",  value: 950000 },
  { label: "Sep '26",  value: 1050000 },
  { label: "Okt '26",  value: 1680000 },
  { label: "Nov '26",  value: 1580000 },
];

function RevenueChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  const maxValue = 2000000;
  const yLabels = ["Rp. 2.000.000", "Rp. 1.500.000", "Rp. 1.000.000", "Rp. 500.000", "Rp. 0"];

  /* SVG canvas */
  const W = 820, H = 190;
  const padL = 8, padR = 20, padT = 12, padB = 0;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const pts = CHART_DATA.map((d, i) => ({
    x: padL + (i / (CHART_DATA.length - 1)) * plotW,
    y: padT + plotH - (d.value / maxValue) * plotH,
    ...d,
  }));

  /* smooth cubic bezier through all points */
  function smoothLine(p: { x: number; y: number }[]) {
    if (p.length < 2) return "";
    let d = `M ${p[0].x} ${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const cpx = (p[i].x + p[i + 1].x) / 2;
      d += ` C ${cpx} ${p[i].y}, ${cpx} ${p[i + 1].y}, ${p[i + 1].x} ${p[i + 1].y}`;
    }
    return d;
  }

  const linePath = smoothLine(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  /* dot colour for mid-range (not highest/lowest visible jump) */
  function dotFill(i: number) {
    if (i === 0) return "#4d9d00";
    const diff = CHART_DATA[i].value - CHART_DATA[i - 1].value;
    if (diff > 200000) return "#4d9d00";
    if (diff < -200000) return "#ef4444";
    return "#ff8a65";
  }

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div className="chart-label">TOTAL OMSET / PENDAPATAN</div>
        <span className="chart-badge">Grafik Arus Kas</span>
      </div>

      <div className="chart">
        {/* Y-axis */}
        <div className="chart-y">
          {yLabels.map((l) => <span key={l}>{l}</span>)}
        </div>

        {/* SVG plot area */}
        <div className="chart-svg-wrap">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(70,100,232,0.18)" />
                <stop offset="100%" stopColor="rgba(70,100,232,0.03)" />
              </linearGradient>
            </defs>

            {/* area fill */}
            <path d={areaPath} fill="url(#chartAreaGrad)" />

            {/* smooth line */}
            <path
              className="chart-line"
              d={linePath}
              fill="none"
              stroke="#2531b6"
              strokeWidth="1.8"
              strokeLinecap="round"
              pathLength="1"
            />

            {/* dots */}
            {pts.map((p, i) => (
              <g key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
                {hovered === i && (
                  <circle cx={p.x} cy={p.y} r="9"
                    fill={dotFill(i) === "#4d9d00" ? "rgba(77,157,0,0.12)" : dotFill(i) === "#ef4444" ? "rgba(239,68,68,0.12)" : "rgba(255,138,101,0.12)"}
                  />
                )}
                <circle
                  className="chart-point"
                  cx={p.x} cy={p.y}
                  r={hovered === i ? 5 : 3.5}
                  fill={dotFill(i)}
                />
              </g>
            ))}

            {/* hover vertical line */}
            {hovered !== null && (
              <line
                x1={pts[hovered].x} y1={padT}
                x2={pts[hovered].x} y2={H}
                stroke="#2531b6" strokeWidth="1" strokeDasharray="4 3" opacity="0.25"
              />
            )}

            {/* tooltip */}
            {hovered !== null && (() => {
              const p = pts[hovered];
              const tw = 148, th = 46;
              let tx = p.x - tw / 2;
              if (tx < 4) tx = 4;
              if (tx + tw > W - 4) tx = W - tw - 4;
              const ty = Math.max(4, p.y - th - 14);
              return (
                <g>
                  <rect x={tx} y={ty} width={tw} height={th} rx="7"
                    fill="#1a2060" opacity="0.93" />
                  <polygon
                    points={`${p.x - 5},${ty + th} ${p.x + 5},${ty + th} ${p.x},${ty + th + 6}`}
                    fill="#1a2060" opacity="0.93"
                  />
                  <text x={tx + tw / 2} y={ty + 17} textAnchor="middle"
                    style={{ fontSize: 11, fill: "#a5b4fc", fontWeight: 500, fontFamily: "inherit" }}>
                    {CHART_DATA[hovered].label}
                  </text>
                  <text x={tx + tw / 2} y={ty + 36} textAnchor="middle"
                    style={{ fontSize: 13, fill: "#fff", fontWeight: 700, fontFamily: "inherit" }}>
                    {formatRupiah(CHART_DATA[hovered].value)}
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* X-axis labels — rendered as HTML below the SVG */}
          <div className="chart-x-labels">
            {CHART_DATA.map((d, i) => (
              <span
                key={i}
                className={`chart-x-label${hovered === i ? " chart-x-label--active" : ""}`}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const txPillItems = TX_PILLS.map((filter) => {
    const count = filter === "Semua"
      ? DUMMY_TRANSACTIONS.length
      : DUMMY_TRANSACTIONS.filter((tx) => tx.status.toLowerCase() === filter.toLowerCase()).length;
    return `${filter} (${count})`;
  });

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

<<<<<<< HEAD
      <RevenueChart />
=======
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
            <svg viewBox="0 0 820 180" preserveAspectRatio="none">
              <g>
                <path
                  className="chart-line"
                  d="M10 130 C55 130 83 105 140 100 C190 96 220 77 270 75 C320 73 350 96 400 95 C445 94 485 89 530 88 C580 87 610 48 660 45 C710 43 755 53 800 53"
                  fill="none"
                  stroke="#2531b6"
                  strokeWidth="1.2"
                  pathLength="1"
                />
                <circle className="chart-point" cx="10" cy="130" r="3.5" fill="#4d9d00" />
                <circle className="chart-point" cx="140" cy="100" r="3.5" fill="#4d9d00" />
                <circle className="chart-point" cx="270" cy="75" r="3.5" fill="#4d9d00" />
                <circle className="chart-point" cx="400" cy="95" r="3.5" fill="#ef4444" />
                <circle className="chart-point" cx="530" cy="88" r="3.5" fill="#ef4444" />
                <circle className="chart-point" cx="660" cy="45" r="3.5" fill="#4d9d00" />
                <circle className="chart-point" cx="800" cy="53" r="3.5" fill="#ef4444" />
                <g fill="#496185" fontSize="13">
                  <text x="12" y="170" textAnchor="start">Mei '26</text>
                  <text x="140" y="170" textAnchor="middle">Jun '26</text>
                  <text x="270" y="170" textAnchor="middle">Jul '26</text>
                  <text x="400" y="170" textAnchor="middle">Agu '26</text>
                  <text x="530" y="170" textAnchor="middle">Sep '26</text>
                  <text x="660" y="170" textAnchor="middle">Okt '26</text>
                  <text x="808" y="170" textAnchor="end">Nov '26</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
>>>>>>> e78ca98 (revisi finall)

      <Pills
        items={txPillItems}
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
