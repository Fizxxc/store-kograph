"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, House, ReceiptText, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard?tab=pay", label: "Bayar", icon: WalletCards },
  { href: "/dashboard?tab=orders", label: "Order", icon: ReceiptText },
  { href: "/dashboard?tab=broadcasts", label: "Info", icon: BellRing },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 gap-2 rounded-3xl border border-white/10 bg-white/5 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === "/dashboard" && item.href.startsWith("/dashboard");
          return (
            <Link key={item.label} href={item.href} className={cn("flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs text-slate-400", active && "bg-brand-500/20 text-white")}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
