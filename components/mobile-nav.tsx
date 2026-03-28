"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { House, ReceiptText, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: House, tab: "home" },
  { href: "/dashboard?tab=pay", label: "Bayar", icon: WalletCards, tab: "pay" },
  { href: "/dashboard?tab=orders", label: "Order", icon: ReceiptText, tab: "orders" },
];

export function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2 rounded-[24px] border border-white/10 bg-white/[0.03] p-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === "/dashboard" && currentTab === item.tab;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[18px] px-2 py-2 text-[11px] uppercase tracking-[0.18em] text-white/45",
                active && "bg-white text-black",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
