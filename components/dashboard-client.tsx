"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Broadcast, Order, Product, Profile } from "@/lib/types";
import { PaymentSheet } from "@/components/payment-sheet";
import { OrdersList } from "@/components/orders-list";
import { BroadcastList } from "@/components/broadcast-list";
import { SubscribePush } from "@/components/subscribe-push";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DashboardClient({ profile, products, orders, broadcasts }: { profile: Profile; products: Product[]; orders: Order[]; broadcasts: Broadcast[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const tab = params.get("tab") || "home";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[260px,1fr]">
      <aside className="surface hidden h-fit p-5 xl:block">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="text-[11px] uppercase tracking-[0.3em] text-white/45">Akun</div>
          <h2 className="mt-2 text-xl font-semibold text-white">{profile.full_name || profile.email}</h2>
          <p className="mt-2 text-sm text-white/55">{profile.role}</p>
        </div>
        <div className="mt-5 space-y-2 text-sm text-white/70">
          <a className="block rounded-2xl border border-white/10 px-4 py-3 hover:border-white" href="/dashboard">Ringkasan</a>
          <a className="block rounded-2xl border border-white/10 px-4 py-3 hover:border-white" href="/dashboard?tab=pay">Pembayaran</a>
          <a className="block rounded-2xl border border-white/10 px-4 py-3 hover:border-white" href="/dashboard?tab=orders">Pesanan</a>
          <a className="block rounded-2xl border border-white/10 px-4 py-3 hover:border-white" href="/dashboard?tab=broadcasts">Info</a>
        </div>
        <button onClick={handleLogout} className="mt-6 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm text-white hover:border-white">Keluar</button>
      </aside>

      <section className="space-y-6 pb-28 md:pb-8">
        <div className="surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Halo, {profile.full_name || profile.email}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/55">Kelola pembayaran dan pantau status transaksi dari satu tempat.</p>
            </div>
            <button onClick={handleLogout} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white hover:border-white xl:hidden">Keluar</button>
          </div>
        </div>

        {tab === "home" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <SubscribePush />
            <div className="surface p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Ringkasan</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"><div className="text-sm text-white/55">Produk</div><div className="mt-2 text-3xl font-semibold text-white">{products.length}</div></div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"><div className="text-sm text-white/55">Transaksi</div><div className="mt-2 text-3xl font-semibold text-white">{orders.length}</div></div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"><div className="text-sm text-white/55">Info</div><div className="mt-2 text-3xl font-semibold text-white">{broadcasts.length}</div></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <PaymentSheet products={products} />
            </div>
          </div>
        ) : null}

        {tab === "pay" ? <PaymentSheet products={products} /> : null}
        {tab === "orders" ? <OrdersList orders={orders} /> : null}
        {tab === "broadcasts" ? <BroadcastList broadcasts={broadcasts} /> : null}
      </section>
    </div>
  );
}
