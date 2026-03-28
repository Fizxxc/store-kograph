"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Order, Product } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

const POLL_INTERVAL = 4000;

function isFinalStatus(status?: string | null) {
  return ["paid", "expired", "cancel", "failed"].includes(String(status || "").toLowerCase());
}

function statusLabel(status?: string | null) {
  const current = String(status || "pending").toLowerCase();
  if (current === "paid") return "Lunas";
  if (current === "expired") return "Kedaluwarsa";
  if (current === "cancel") return "Dibatalkan";
  if (current === "failed") return "Gagal";
  return "Menunggu pembayaran";
}

function statusTone(status?: string | null) {
  const current = String(status || "pending").toLowerCase();
  if (current === "paid") return "border-white bg-white text-black";
  if (current === "expired" || current === "cancel" || current === "failed") return "border-white/10 bg-white/5 text-white/70";
  return "border-white/10 bg-white/5 text-white";
}

export function PaymentSheet({ products }: { products: Product[] }) {
  const [selectedId, setSelectedId] = useState(products[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<Order | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedProduct = useMemo(() => products.find((item) => item.id === selectedId), [products, selectedId]);

  async function createPayment() {
    setLoading(true);
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Gagal membuat pembayaran");
      setResult(payload.order);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatus(silent = false) {
    if (!result?.cashify_transaction_id) return;

    if (!silent) setChecking(true);
    try {
      const response = await fetch("/api/payment/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: result.cashify_transaction_id, orderId: result.id }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Gagal cek status pembayaran");
      if (payload.order) setResult(payload.order);
    } catch (error) {
      if (!silent) {
        alert(error instanceof Error ? error.message : "Gagal cek status pembayaran");
      }
    } finally {
      if (!silent) setChecking(false);
    }
  }

  useEffect(() => {
    if (!result?.cashify_transaction_id || isFinalStatus(result.payment_status)) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    pollingRef.current = setInterval(() => {
      void refreshStatus(true);
    }, POLL_INTERVAL);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [result?.cashify_transaction_id, result?.payment_status]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr,.95fr]">
      <div className="surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Checkout</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Buat pembayaran</h3>
          </div>
          <div className="rounded-full border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/55">
            QRIS
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">Pilih produk</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.category} — {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/50">Produk</p>
                <h4 className="mt-2 text-xl font-semibold text-white">{selectedProduct?.name}</h4>
                <p className="mt-2 text-sm leading-6 text-white/60">{selectedProduct?.description || "Layanan digital siap diproses setelah pembayaran terverifikasi."}</p>
              </div>
              {selectedProduct?.badge ? <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">{selectedProduct.badge}</span> : null}
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Harga</div>
                <div className="mt-2 text-3xl font-semibold text-white">{formatRupiah(selectedProduct?.display_price)}</div>
              </div>
              <button
                disabled={loading || !selectedProduct}
                onClick={createPayment}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Lanjut bayar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="surface p-5 sm:p-6">
        {result ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Transaksi aktif</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{result.order_code}</h3>
              </div>
              <span className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.2em] ${statusTone(result.payment_status)}`}>
                {statusLabel(result.payment_status)}
              </span>
            </div>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-white p-4 sm:p-6">
              <div className="flex justify-center">
                {result.qr_string ? <QRCodeSVG value={result.qr_string} size={220} className="h-auto max-w-full" /> : <div className="text-black">QR belum tersedia</div>}
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-white/72">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span>Nominal dasar</span>
                <span className="font-medium text-white">{formatRupiah(result.display_amount)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span>Total pembayaran</span>
                <span className="font-semibold text-white">{formatRupiah(result.cashify_total_amount ?? result.display_amount)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span>Berlaku sampai</span>
                <span className="font-medium text-white">{result.expires_at ? new Date(result.expires_at).toLocaleString("id-ID") : "-"}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button onClick={() => refreshStatus(false)} disabled={checking} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white hover:border-white disabled:opacity-50">
                {checking ? "Memeriksa..." : "Cek status"}
              </button>
              {String(result.payment_status).toLowerCase() === "paid" && result.whatsapp_url ? (
                <a href={result.whatsapp_url} target="_blank" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:bg-white/90">
                  Konfirmasi ke admin
                </a>
              ) : (
                <div className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-white/55">
                  Status diperbarui otomatis setiap {POLL_INTERVAL / 1000} detik.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
            <h3 className="text-2xl font-semibold text-white">Belum ada transaksi</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">Pilih produk, lalu buat pembayaran. Nominal final akan mengikuti totalAmount dari Cashify.</p>
          </div>
        )}
      </div>
    </div>
  );
}
