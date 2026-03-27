"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export function AdminImporter() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

    const payload = rows.map((row) => ({
      category: String(row.category || row.Category || "LAINNYA"),
      name: String(row.name || row.Name || "Tanpa Nama"),
      slug: String(row.slug || row.Slug || String(row.name || row.Name || "produk")).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      duration_label: row.duration_label ? String(row.duration_label) : row.Duration ? String(row.Duration) : null,
      description: row.description ? String(row.description) : row.Description ? String(row.Description) : null,
      product_type: String(row.product_type || row.ProductType || "digital"),
      base_price: Number(row.base_price || row.BasePrice || row.price || row.Price || 0),
      display_price: Number(row.display_price || row.DisplayPrice || row.price || row.Price || 0),
      badge: row.badge ? String(row.badge) : null,
      is_active: true,
    }));

    const response = await fetch("/api/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: payload }),
    });
    const result = await response.json();
    setMessage(response.ok ? `Import berhasil: ${result.count} produk` : result.error || "Import gagal");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Import Excel</h3>
          <p className="mt-1 text-sm text-slate-400">Kolom minimal: category, name, base_price, display_price.</p>
        </div>
        <label className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-400">
          Pilih file
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
        </label>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}
