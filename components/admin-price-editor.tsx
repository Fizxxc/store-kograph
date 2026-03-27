"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

export function AdminPriceEditor({ products }: { products: Product[] }) {
  const [status, setStatus] = useState<string | null>(null);

  async function updatePrice(productId: string, displayPrice: number) {
    const response = await fetch("/api/admin/manual-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, displayPrice }),
    });
    const payload = await response.json();
    setStatus(response.ok ? `Harga ${payload.product.name} diperbarui.` : payload.error || "Update gagal");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Harga manual</h3>
          <p className="mt-1 text-sm text-slate-400">Admin bisa override harga tampil tanpa mengubah struktur produk.</p>
        </div>
        {status ? <span className="text-xs text-slate-300">{status}</span> : null}
      </div>
      <div className="mt-4 grid gap-3">
        {products.map((product) => (
          <div key={product.id} className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-[1fr,180px,120px] md:items-center">
            <div>
              <div className="text-sm font-semibold text-white">{product.name}</div>
              <div className="text-xs text-slate-500">{product.category}</div>
            </div>
            <input type="number" defaultValue={product.display_price} onBlur={(e) => updatePrice(product.id, Number(e.target.value))} />
            <div className="text-xs text-slate-500">Blur input untuk simpan</div>
          </div>
        ))}
      </div>
    </div>
  );
}
