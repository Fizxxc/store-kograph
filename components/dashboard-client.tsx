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
    <div className="grid gap-6 xl:grid-cols-[280px,1fr]">
      <aside className="surface hidden h-fit p-5 xl:block">
        <div className="rounded-3xl border border-white/10 bg-brand-500/10 p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-brand-200">Akun aktif</div>
          <h2 className="mt-2 text-xl font-semibold text-white">{profile.full_name || profile.email}</h2>
          <p className="mt-1 text-sm text-slate-300">Role: {profile.role}</p>
        </div>
        <div className="mt-5 space-y-3 text-sm text-slate-300">
          <a className="block rounded-2xl border border-white/10 px-4 py-3 hover:border-brand-400" href="/dashboard">Overview</a>
          <a className="block rounded-2xl border border-white/10 px-4 py-3 hover:border-brand-400" href="/dashboard?tab=pay">Payment</a>
          <a className="block rounded-2xl border border-white/10 px-4 py-3 hover:border-brand-400" href="/dashboard?tab=orders">Orders</a>
          <a className="block rounded-2xl border border-white/10 px-4 py-3 hover:border-brand-400" href="/dashboard?tab=broadcasts">Broadcast</a>
        </div>
        <button onClick={handleLogout} className="mt-6 w-full rounded-2xl border border-red-400/20 px-4 py-3 text-sm text-red-200 hover:bg-red-500/10">Logout</button>
      </aside>

      <section className="space-y-6 pb-28 md:pb-8">
        <div className="surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Dashboard user</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Halo, {profile.full_name || profile.email}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">Dashboard user difokuskan untuk melihat pricelist, menerima broadcast admin, dan checkout QRIS secara realtime.</p>
            </div>
            <button onClick={handleLogout} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white hover:border-brand-400 xl:hidden">Logout</button>
          </div>
        </div>

        {tab === "home" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <SubscribePush />
            <div className="surface p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Ringkasan</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><div className="text-sm text-slate-400">Produk aktif</div><div className="mt-2 text-3xl font-semibold text-white">{products.length}</div></div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><div className="text-sm text-slate-400">Order saya</div><div className="mt-2 text-3xl font-semibold text-white">{orders.length}</div></div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><div className="text-sm text-slate-400">Broadcast</div><div className="mt-2 text-3xl font-semibold text-white">{broadcasts.length}</div></div>
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
