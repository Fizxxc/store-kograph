import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { ADMIN_ROUTE } from "@/lib/constants";

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/75 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-[0.2em] text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-200 shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs uppercase text-slate-400">KOGRAPH</div>
            <div className="text-sm">STUDIO.ID</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#produk" className="hover:text-white">Produk</a>
          <a href="#fitur" className="hover:text-white">Fitur</a>
          <a href="#payment" className="hover:text-white">Payment</a>
          <Link href="/auth" className="rounded-full border border-white/10 px-4 py-2 hover:border-brand-400 hover:text-white">
            Login / Register
          </Link>
          <Link href="/dashboard" className="rounded-full bg-brand-500 px-4 py-2 font-medium text-white shadow-glow hover:bg-brand-400">
            Dashboard
          </Link>
          {isAdmin ? (
            <Link href={`/${ADMIN_ROUTE}`} className="rounded-full border border-emerald-400/30 px-4 py-2 text-emerald-200">
              <ShieldCheck className="mr-2 inline h-4 w-4" /> Console
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
