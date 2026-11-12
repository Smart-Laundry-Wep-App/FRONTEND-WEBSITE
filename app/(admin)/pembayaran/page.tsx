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
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import api from "@/lib/api";

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
  onApply: (start: Date | null, end: Date | null) => void;
}

function PaymentCalendar({ anchorRef, onClose, onApply }: PaymentCalendarProps) {
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

const PAYMENT_PILLS = ["Semua", "Menunggu Pembayaran", "Lunas", "Gagal"];

interface PaymentRow {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  total: number;
  status: string;
  paymentMethod: string;
  paidAt?: string;
  createdAt: string;
}

export default function Pembayaran() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarAnchorRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [selectedPill, setSelectedPill] = useState("Semua");
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [stats, setStats] = useState<{ totalRevenue: number; paidCount: number; pendingCount: number } | null>(null);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState("");
  const perPage = 5;

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get<{ payments: Array<{ id: string; orderId: string; customer: string; phone: string; amount: number; status: string; method: string; paidAt: string | null; createdAt: string }> }>("/payments", { params: { page: 1, limit: 100 } }),
      api.get<typeof stats>("/payments/stats"),
    ]).then(([paymentResponse, statsResponse]) => {
      if (!active) return;
      setPayments(paymentResponse.data.payments.map((payment) => ({
          id: payment.id,
          orderId: payment.orderId,
          customer: payment.customer,
          phone: payment.phone,
          total: payment.amount,
          status: payment.status === "Belum Bayar" ? "Menunggu Pembayaran" : payment.status,
          paymentMethod: payment.method,
          paidAt: payment.paidAt ?? undefined,
          createdAt: payment.createdAt,
      })));
      setStats(statsResponse.data);
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : "Gagal memuat pembayaran.");
    });
    return () => { active = false; };
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || Object.values(payment).some((value) =>
      String(value ?? "").toLowerCase().includes(q),
    );

    if (!matchesSearch) return false;

    const matchesStatus = selectedPill === "Semua" ||
      payment.status.toLowerCase() === selectedPill.toLowerCase();
    const paymentDate = new Date(payment.createdAt);
    const matchesDate = !dateRange || (
      paymentDate >= new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), dateRange.start.getDate()) &&
      paymentDate < new Date(dateRange.end.getFullYear(), dateRange.end.getMonth(), dateRange.end.getDate() + 1)
    );
    return matchesStatus && matchesDate;
  });

  async function markAsPaid(payment: PaymentRow) {
    setUpdatingPaymentId(payment.id);
    try {
      await api.patch(`/payments/${encodeURIComponent(payment.id)}/status`, { status: "Lunas" });
      setPayments((current) => current.map((item) => item.id === payment.id
        ? { ...item, status: "Lunas", paidAt: new Date().toISOString() }
        : item));
      setStats((current) => current ? {
        ...current,
        paidCount: current.paidCount + 1,
        pendingCount: Math.max(0, current.pendingCount - 1),
        totalRevenue: current.totalRevenue + payment.total,
      } : current);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Status pembayaran gagal diperbarui.");
    } finally {
      setUpdatingPaymentId("");
    }
  }

  const paymentPillItems = PAYMENT_PILLS.map((status) => {
    const count =
      status === "Semua"
        ? payments.length
        : payments.filter((payment) => payment.status === (status === "Menunggu Pembayaran" ? "Menunggu Pembayaran" : status)).length;
    return `${status} (${count})`;
  });

  const visiblePayments = filteredPayments.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Header
        title="Pembayaran"
        subtitle="Verifikasi tagihan pelanggan dan pembayaran laundry"
      />

      <section className="content payment-content">
        {error && <p className="order-error" role="alert">{error}</p>}
        <div className="payment-top">
          <StatCard
            label="MENUNGGU PELUNASAN"
            value={formatRupiah(payments.filter((payment) => payment.status === "Menunggu Pembayaran").reduce((sum, payment) => sum + payment.total, 0))}
            note={`${stats?.pendingCount ?? 0} Order`}
            icon="clock"
          />

          <StatCard
            label="TOTAL PEMBAYARAN LUNAS"
            value={formatRupiah(stats?.totalRevenue ?? 0)}
            note={`${stats?.paidCount ?? 0} Order`}
            icon="hand"
          />
        </div>

        <div className="payment-search-row">
          <SearchBox
            placeholder="Cari No Pembayaran, Nama Pelanggan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <div className="button-group payment-action-group">
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
                  onApply={(start, end) => setDateRange(start && end ? { start, end } : null)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="payment-controls">
          <Pills
            items={paymentPillItems}
            active={PAYMENT_PILLS.indexOf(selectedPill)}
            onChange={(index) => {
              setSelectedPill(PAYMENT_PILLS[index]);
              setPage(1);
            }}
          />
        </div>

        <EmptyTable
          headers={[
            "NO. ORDER",
            "PELANGGAN",
            "TOTAL",
            "STATUS",
            "PEMBAYARAN",
            "AKSI",
          ]}
          rows={0}
        >
          {visiblePayments.length > 0 ? (
            visiblePayments.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.orderId}</strong>
                  <small>{p.paidAt ? new Date(p.paidAt).toLocaleString("id-ID") : "Menunggu konfirmasi"}</small>
                </td>
                <td>
                  <strong>{p.customer}</strong>
                  <small>{p.phone}</small>
                </td>
                <td>
                  <strong>{formatRupiah(p.total)}</strong>
                </td>
                <td>
                  <span className={`status ${p.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <strong>{p.paymentMethod}</strong>
                  <small>{p.id}</small>
                </td>
                <td>
                  {p.status === "Menunggu Pembayaran" ? (
                    <button
                      className="secondary-button payment-mark-paid-button"
                      type="button"
                      disabled={updatingPaymentId === p.id}
                      aria-label={`Verifikasi pembayaran ${p.id}`}
                      onClick={() => void markAsPaid(p)}
                    >
                      {updatingPaymentId === p.id ? "Memproses..." : "Tandai Lunas"}
                    </button>
                  ) : <span aria-label="Pembayaran telah diproses">—</span>}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                Tidak ada data pembayaran yang sesuai kriteria pencarian.
              </td>
            </tr>
          )}
        </EmptyTable>

        <Pagination
          total={filteredPayments.length}
          perPage={perPage}
          page={page}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
