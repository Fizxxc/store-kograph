import type { Order } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

export function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <div className="surface p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Order saya</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Riwayat pesanan</h3>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">{orders.length} total</div>
      </div>
      <div className="mt-6 grid gap-4">
        {orders.length ? orders.map((order) => (
          <article key={order.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{order.category}</div>
                <h4 className="mt-1 text-lg font-semibold text-white">{order.product_name}</h4>
                <p className="mt-1 text-sm text-slate-400">{order.order_code}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">{formatRupiah(order.cashify_total_amount ?? order.display_amount)}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.15em] text-emerald-200">{order.payment_status}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-white/10 px-3 py-1">{new Date(order.created_at).toLocaleString("id-ID")}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">{order.payment_method}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">{order.order_status}</span>
            </div>
          </article>
        )) : (
          <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">Belum ada order.</div>
        )}
      </div>
    </div>
  );
}
