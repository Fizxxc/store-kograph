"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthCard() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setMessage("Register berhasil. Cek email jika konfirmasi email aktif, lalu login.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Autentikasi gagal";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface mx-auto max-w-md p-6 sm:p-8">
      <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm">
        <button onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-2 ${mode === "login" ? "bg-brand-500 text-white" : "text-slate-400"}`}>
          Login
        </button>
        <button onClick={() => setMode("register")} className={`flex-1 rounded-full px-4 py-2 ${mode === "register" ? "bg-brand-500 text-white" : "text-slate-400"}`}>
          Register
        </button>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Nama lengkap</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama admin / user" required />
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kamu@email.com" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" required />
        </div>

        <button disabled={loading} className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-medium text-white shadow-glow hover:bg-brand-400 disabled:opacity-60">
          {loading ? "Memproses..." : mode === "login" ? "Masuk dashboard" : "Buat akun"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
      <p className="mt-6 text-xs leading-6 text-slate-500">
        Auth memakai Supabase Auth, tanpa token manual buatan sendiri. Hak akses admin/user dibaca dari tabel profiles di database.
      </p>
    </div>
  );
}
