import { Header } from "@/components/header";
import { AuthCard } from "@/components/auth-card";

export default function AuthPage() {
  return (
    <main>
      <Header />
      <section className="container-shell py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Autentikasi</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Masuk ke Kograph Studio</h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">Login dan register memakai Supabase Auth. Role admin/user dibaca dari database, bukan dari frontend.</p>
        </div>
        <div className="mt-10">
          <AuthCard />
        </div>
      </section>
    </main>
  );
}
