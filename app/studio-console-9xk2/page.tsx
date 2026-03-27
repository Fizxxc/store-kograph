import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { createServerSupabase } from "@/lib/supabase/server";
import { AdminImporter } from "@/components/admin-importer";
import { AdminBroadcast } from "@/components/admin-broadcast";
import { AdminPriceEditor } from "@/components/admin-price-editor";

export default async function AdminConsolePage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/auth");

  const { data: profile } = await supabase.from("profiles").select("id, role, email, full_name").eq("id", session.user.id).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const [{ data: products }, { data: orders }, { data: logs }] = await Promise.all([
    supabase.from("products").select("*").order("category").order("display_price"),
    supabase.from("orders").select("order_code, product_name, payment_status, display_amount, created_at").order("created_at", { ascending: false }).limit(12),
    supabase.from("webhook_logs").select("id, provider, event_name, created_at, payload").order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <main>
      <Header isAdmin />
      <section className="container-shell space-y-6 py-10">
        <div className="surface p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Hidden admin console</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Console admin Kograph Studio</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">Route ini sengaja tidak dirender di publik. Keamanan utama tetap di role admin + RLS + server route check.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
          <AdminBroadcast />
          <AdminImporter />
        </div>

        <AdminPriceEditor products={products || []} />

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="surface p-6">
            <h2 className="text-xl font-semibold text-white">Order terbaru</h2>
            <div className="mt-4 grid gap-3">
              {(orders || []).map((order) => (
                <div key={order.order_code} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-4"><span className="font-semibold text-white">{order.order_code}</span><span className="uppercase text-emerald-200">{order.payment_status}</span></div>
                  <div className="mt-1">{order.product_name}</div>
                  <div className="mt-1 text-slate-500">{new Date(order.created_at).toLocaleString("id-ID")}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="surface p-6">
            <h2 className="text-xl font-semibold text-white">Webhook logs</h2>
            <div className="mt-4 grid gap-3">
              {(logs || []).map((log) => (
                <div key={log.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-4"><span className="font-semibold text-white">{log.event_name}</span><span>{new Date(log.created_at).toLocaleString("id-ID")}</span></div>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-slate-500">{JSON.stringify(log.payload, null, 2)}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
