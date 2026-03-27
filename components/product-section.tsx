import { formatCompactPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductSection({ title, subtitle, products }: { title: string; subtitle: string; products: Product[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{subtitle}</h3>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">
          {products.length} produk aktif
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-200">{product.category}</p>
                <h4 className="mt-2 text-lg font-semibold text-white">{product.name}</h4>
              </div>
              {product.badge ? (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">{product.badge}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-slate-300">{product.duration_label || "Instant setup"}</p>
            <p className="mt-4 min-h-12 text-sm text-slate-400">{product.description}</p>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Mulai dari</div>
                <div className="text-2xl font-semibold text-white">{formatCompactPrice(product.display_price)}</div>
              </div>
              <a href="/auth" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-brand-500">
                Pesan
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
