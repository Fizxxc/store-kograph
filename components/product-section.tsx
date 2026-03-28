import { formatCompactPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductSection({ title, subtitle, products }: { title: string; subtitle: string; products: Product[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{subtitle}</h3>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
          {products.length} item
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{product.category}</p>
                <h4 className="mt-2 text-lg font-semibold text-white">{product.name}</h4>
              </div>
              {product.badge ? <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/70">{product.badge}</span> : null}
            </div>
            <p className="mt-2 text-sm text-white/70">{product.duration_label || "Tersedia"}</p>
            <p className="mt-4 min-h-12 text-sm leading-6 text-white/55">{product.description}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Harga</div>
                <div className="mt-2 text-2xl font-semibold text-white">{formatCompactPrice(product.display_price)}</div>
              </div>
              <a href="/auth" className="rounded-full border border-white bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
                Pesan
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
