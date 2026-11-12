"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import { StatCard, SearchBox, SecondaryButton, Pills, EmptyTable, Pagination } from "@/components/UI";
import { CalendarDays, Download, ChevronLeft, ChevronRight, X } from "lucide-react";
import api from "@/lib/api";

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
  onApply: (start: Date | null, end: Date | null) => void;
}

function CalendarPopup({ anchorRef, onClose, onApply }: CalendarPopupProps) {
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
            <button
              type="button"
              className="cal-btn-apply"
              disabled={!start}
              onClick={() => {
                onApply(start, end ?? start);
                onClose();
              }}
            >
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

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const TX_PILLS = ["Semua", "Menunggu Pembayaran", "Lunas", "Dibatalkan"];

/* ─── REVENUE CHART ─── */
interface ChartPoint { label: string; value: number }
interface AdminTransaction {
  id: string;
  orderId: string;
  date: string;
  createdAt: string;
  customer: string;
  phone: string;
  paymentMethod: string;
  total: number;
  status: string;
}

function RevenueChart({ chartData }: { chartData: ChartPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const maxValue = Math.max(1, ...chartData.map((point) => point.value));
  const yLabels = ["Rp. 2.000.000", "Rp. 1.500.000", "Rp. 1.000.000", "Rp. 500.000", "Rp. 0"];

  /* SVG canvas */
  const W = 820, H = 190;
  const padL = 8, padR = 20, padT = 12, padB = 0;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const pts = chartData.map((d, i) => ({
    x: padL + (i / Math.max(1, chartData.length - 1)) * plotW,
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
  const firstPoint = pts[0];
  const lastPoint = pts[pts.length - 1];
  const areaPath = firstPoint && lastPoint
    ? `${linePath} L ${lastPoint.x} ${H} L ${firstPoint.x} ${H} Z`
    : "";

  /* dot colour for mid-range (not highest/lowest visible jump) */
  function dotFill(i: number) {
    if (i === 0) return "#4d9d00";
    const diff = chartData[i].value - chartData[i - 1].value;
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
            {areaPath && <path d={areaPath} fill="url(#chartAreaGrad)" />}

            {/* smooth line */}
            {linePath && (
              <path
                className="chart-line"
                d={linePath}
                fill="none"
                stroke="#2531b6"
                strokeWidth="1.8"
                strokeLinecap="round"
                pathLength="1"
              />
            )}

            {!pts.length && (
              <text
                x={W / 2}
                y={H / 2}
                textAnchor="middle"
                fill="#94a3b8"
                style={{ fontSize: 12, fontFamily: "inherit" }}
              >
                Data pendapatan belum tersedia
              </text>
            )}

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
            {hovered !== null && pts[hovered] && (
              <line
                x1={pts[hovered].x} y1={padT}
                x2={pts[hovered].x} y2={H}
                stroke="#2531b6" strokeWidth="1" strokeDasharray="4 3" opacity="0.25"
              />
            )}

            {/* tooltip */}
            {hovered !== null && pts[hovered] && (() => {
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
                    {chartData[hovered].label}
                  </text>
                  <text x={tx + tw / 2} y={ty + 36} textAnchor="middle"
                    style={{ fontSize: 13, fill: "#fff", fontWeight: 700, fontFamily: "inherit" }}>
                    {formatRupiah(chartData[hovered].value)}
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* X-axis labels — rendered as HTML below the SVG */}
          <div className="chart-x-labels">
            {chartData.map((d, i) => (
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
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get<{ transactions: Array<{ id: string; orderId: string; customer: string; amount: number; paymentStatus: string; paymentMethod: string; date: string }> }>("/transactions", { params: { page: 1, limit: 100 } }),
      api.get<{ points: Array<{ day: string; value: number }> }>("/transactions/chart"),
    ]).then(([transactionResponse, chartResponse]) => {
      if (!active) return;
      setTransactions(transactionResponse.data.transactions.map((transaction) => ({
        id: transaction.id,
        orderId: transaction.orderId,
        date: new Date(transaction.date).toLocaleString("id-ID"),
        createdAt: transaction.date,
        customer: transaction.customer,
        phone: "",
        paymentMethod: transaction.paymentMethod,
        total: transaction.amount,
        status: transaction.paymentStatus === "Belum Bayar" ? "Menunggu Pembayaran" : transaction.paymentStatus,
      })));
      setChartData(chartResponse.data.points.map((point) => ({ label: point.day, value: point.value })));
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : "Gagal memuat transaksi.");
    });
    return () => { active = false; };
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || Object.values(tx).some((value) =>
      String(value ?? "").toLowerCase().includes(q),
    );

    if (!matchesSearch) return false;
    const matchesStatus = selectedPill === "Semua" ||
      tx.status.toLowerCase() === selectedPill.toLowerCase();
    const transactionDate = new Date(tx.createdAt);
    const matchesDate = !dateRange || (
      transactionDate >= new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), dateRange.start.getDate()) &&
      transactionDate < new Date(dateRange.end.getFullYear(), dateRange.end.getMonth(), dateRange.end.getDate() + 1)
    );
    return matchesStatus && matchesDate;
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
      ? transactions.length
      : transactions.filter((tx) => tx.status.toLowerCase() === filter.toLowerCase()).length;
    return `${filter} (${count})`;
  });

  return <>
    <Header title="Riwayat Transaksi" subtitle="Rekap lengkap arus kas, metode pembayaran, dan log transaksi pelanggan."/>
    <section className="content history-content">
      {error && <p className="order-error" role="alert">{error}</p>}
      <div className="stat-grid history-stats">
        <StatCard label="TOTAL OMSET 7 HARI" value={formatRupiah(chartData.reduce((sum, point) => sum + point.value, 0))} icon="hand"/>
        <StatCard label="TRANSAKSI" value={`${transactions.length} Transaksi`} icon="receipt"/>
        <StatCard label="PENDAPATAN TERBESAR HARIAN" value={formatRupiah(Math.max(0, ...chartData.map((point) => point.value)))} icon="dollar"/>
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
            <CalendarPopup
              anchorRef={calendarAnchorRef}
              onClose={closeCalendar}
              onApply={(start, end) => setDateRange(start && end ? { start, end } : null)}
            />
          )}
        </div>

        <SecondaryButton icon={Download} onClick={handleDownload}>
          DOWNLOAD
        </SecondaryButton>
      </div>

      <RevenueChart chartData={chartData} />

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
