import { Header } from "@/components/header";
import { ProductSection } from "@/components/product-section";
import { getPublicProducts } from "@/lib/data";
import { ShieldCheck, Smartphone, Wallet } from "lucide-react";

export default async function HomePage() {
  const products = await getPublicProducts();
  const grouped = (products as any[]).reduce((acc: Record<string, any[]>, item: any) => {
    const key = item.category || "Lainnya";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  return (
    <main>
      <Header />
      <section className="container-shell py-16 sm:py-24">
        <div className="grid gap-10 xl:grid-cols-[1.2fr,.8fr] xl:items-center">
          <div>
            <div className="inline-flex rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-100">
              Apps Beli kebutuhan digital dengan payment QRIS
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Payment website <span className="text-gradient">KOGRAPH STUDIO.ID</span> untuk digital service yang rapi, aman, dan cepat.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Desain mobile-first dengan navbar bawah, payment QRIS GoPay via Cashify, import produk dari Excel, harga manual oleh admin, broadcast ke user, order code otomatis, dan panel admin yang tidak ditampilkan di publik.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/auth" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-brand-400">Mulai sekarang</a>
              <a href="#produk" className="rounded-full border border-white/10 px-6 py-3 text-sm text-white hover:border-brand-400">Lihat pricelist</a>
            </div>
          </div>
          <div className="surface overflow-hidden p-6">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <Wallet className="h-7 w-7 text-brand-200" />
                <h3 className="mt-4 text-lg font-semibold text-white">Cashify v2 QRIS</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">Generate QR dengan unique code, tampilkan totalAmount, dan cek status secara realtime.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <ShieldCheck className="h-7 w-7 text-emerald-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">Supabase RLS</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">Auth tanpa sistem token manual. Akses admin/user diatur dari role dan RLS policy.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <Smartphone className="h-7 w-7 text-amber-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">Mobile ready</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">Bottom navigation khusus mobile supaya checkout dan tracking order lebih enak di HP.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="container-shell py-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Admin disembunyikan", "Route admin sengaja tidak ditampilkan di navbar publik. Akses tetap dibatasi lagi oleh role admin di database dan API route."],
            ["Order code otomatis", "Setiap checkout membentuk kode seperti KGR-482913 lalu disimpan ke database beserta QR string dan status payment."],
            ["Broadcast & web push", "Admin bisa kirim info ke user tanpa layanan push pihak ketiga. Service worker memproses notifikasi dari route internal."],
          ].map(([title, body]) => (
            <div key={title} className="surface p-6">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="produk" className="container-shell space-y-12 py-16">
        {Object.entries(grouped).map(([category, items]) => (
          <ProductSection key={category} title={category} subtitle={`Katalog ${category}`} products={items || []} />
        ))}
      </section>

      <section id="payment" className="container-shell py-16">
        <div className="surface grid gap-8 p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Flow payment</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Flow yang dipakai di project ini</h2>
            <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <li>1. User login/register lewat Supabase Auth.</li>
              <li>2. Pilih produk dari pricelist yang disimpan di tabel products.</li>
              <li>3. Server route membuat order + request Cashify generate QRIS.</li>
              <li>4. User bayar sesuai nominal final.</li>
              <li>5. Webhook dan polling sama-sama mengupdate status ke Supabase.</li>
              <li>6. Saat paid, tombol WhatsApp admin langsung muncul dengan detail pesanan.</li>
            </ol>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="rounded-3xl border border-white/10 p-4"><div className="text-slate-500">Payment method</div><div className="mt-2 text-lg font-semibold text-white">QRIS GoPay</div></div>
              <div className="rounded-3xl border border-white/10 p-4"><div className="text-slate-500">Backend</div><div className="mt-2 text-lg font-semibold text-white">Next.js API</div></div>
              <div className="rounded-3xl border border-white/10 p-4"><div className="text-slate-500">Database</div><div className="mt-2 text-lg font-semibold text-white">Supabase</div></div>
              <div className="rounded-3xl border border-white/10 p-4"><div className="text-slate-500">Push</div><div className="mt-2 text-lg font-semibold text-white">Service Worker</div></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
