import { clsx } from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatRupiah(value: number | null | undefined) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatCompactPrice(value: number) {
  if (value >= 1000 && value % 1000 === 0) return `${value / 1000}K`;
  if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

export function whatsappLink(phone: string, text: string) {
  const normalized = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export function buildOrderCode() {
  return `KGR-${Math.floor(100000 + Math.random() * 900000)}`;
}
