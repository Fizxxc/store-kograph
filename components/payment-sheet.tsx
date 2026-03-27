"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Order, Product } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

export function PaymentSheet({ products }: { products: Product[] }) {
  const [selectedId, setSelectedId] = useState(products[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Order | null>(null);
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
      if (!response.ok) throw new Error(payload.error || "Gagal membuat payment");
      setResult(payload.order);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatus() {
    if (!result?.cashify_transaction_id) return;
    const response = await fetch("/api/payment/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId: result.cashify_transaction_id, orderId: result.id }),
    });
    const payload = await response.json();
    if (response.ok && payload.order) setResult(payload.order);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr,.9fr]">
      <div className="surface p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Checkout</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Buat pembayaran QRIS GoPay</h3>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">Realtime via webhook + polling</div>
        </div>
        <div className="mt-6 space-y-4">
          <label className="block text-sm text-slate-300">Pilih produk</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.category} — {product.name}</option>
            ))}
          </select>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Detail produk</p>
            <h4 className="mt-2 text-lg font-semibold text-white">{selectedProduct?.name}</h4>
            <p className="mt-1 text-sm text-slate-400">{selectedProduct?.description}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-xs text-slate-500">Harga tampil</div>
                <div className="text-2xl font-semibold text-white">{formatRupiah(selectedProduct?.display_price)}</div>
              </div>
              <button disabled={loading || !selectedProduct} onClick={createPayment} className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-400 disabled:opacity-60">
                {loading ? "Memproses..." : "Buat pembayaran"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="surface p-6">
        {result ? (
          <>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Transaksi aktif</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{result.order_code}</h3>
            <div className="mt-4 flex justify-center rounded-3xl border border-white/10 bg-white p-4">
              {result.qr_string ? <QRCodeSVG value={result.qr_string} size={220} /> : <div className="text-slate-900">QR belum tersedia</div>}
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>Metode</span><span>QRIS • GoPay</span></div>
              <div className="flex justify-between"><span>Total bayar</span><span>{formatRupiah(result.cashify_total_amount ?? result.display_amount)}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="capitalize">{result.payment_status}</span></div>
              <div className="flex justify-between"><span>Expired</span><span>{result.expires_at ? new Date(result.expires_at).toLocaleString("id-ID") : "-"}</span></div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={refreshStatus} className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white hover:border-brand-400">Cek status</button>
              {result.whatsapp_url ? <a href={result.whatsapp_url} target="_blank" className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-400">Hubungi admin</a> : null}
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-500">Setelah payment berhasil, user diarahkan untuk menghubungi admin dengan detail order, payment berhasil, dan metode QRIS.</p>
          </>
        ) : (
          <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
            <h3 className="text-xl font-semibold text-white">Belum ada pembayaran aktif</h3>
            <p className="mt-3 max-w-sm text-sm text-slate-400">Pilih produk lalu generate QRIS. Nominal yang ditampilkan akan mengikuti totalAmount dari Cashify saat unique code aktif.</p>
          </div>
        )}
      </div>
    </div>
  );
}
