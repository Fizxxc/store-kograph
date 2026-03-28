import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ADMIN_ROUTE } from "@/lib/constants";

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-white">
          KOGRAPH STUDIO.ID
        </Link>

        <nav className="hidden items-center gap-3 text-sm text-white/72 md:flex">
          <a href="#produk" className="rounded-full px-3 py-2 hover:text-white">Produk</a>
          <Link href="/auth" className="rounded-full px-3 py-2 hover:text-white">
            Masuk
          </Link>
          <Link href="/dashboard" className="rounded-full border border-white bg-white px-4 py-2 font-medium text-black hover:bg-white/90">
            Dashboard
          </Link>
          {isAdmin ? (
            <Link href={`/${ADMIN_ROUTE}`} className="rounded-full border border-white/15 px-4 py-2 text-white/80">
              <ShieldCheck className="mr-2 inline h-4 w-4" /> Console
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
