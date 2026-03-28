import type { Order } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

function statusLabel(status: string) {
  const current = status.toLowerCase();
  if (current === "paid") return "Lunas";
  if (current === "expired") return "Kedaluwarsa";
  if (current === "cancel") return "Dibatalkan";
  if (current === "failed") return "Gagal";
  return "Menunggu";
}

export function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <div className="surface p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Pesanan</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Riwayat transaksi</h3>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/50">{orders.length} total</div>
      </div>
      <div className="mt-6 grid gap-4">
        {orders.length ? orders.map((order) => (
          <article key={order.id} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">{order.category}</div>
                <h4 className="mt-2 text-lg font-semibold text-white">{order.product_name}</h4>
                <p className="mt-1 text-sm text-white/45">{order.order_code}</p>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold text-white">{formatRupiah(order.cashify_total_amount ?? order.display_amount)}</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/55">{statusLabel(order.payment_status)}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.16em] text-white/45">
              <span className="rounded-full border border-white/10 px-3 py-2">{new Date(order.created_at).toLocaleString("id-ID")}</span>
              <span className="rounded-full border border-white/10 px-3 py-2">{order.payment_method}</span>
              <span className="rounded-full border border-white/10 px-3 py-2">{order.order_status}</span>
            </div>
          </article>
        )) : (
          <div className="rounded-[28px] border border-dashed border-white/10 p-8 text-center text-sm text-white/55">Belum ada transaksi.</div>
        )}
      </div>
    </div>
  );
}
