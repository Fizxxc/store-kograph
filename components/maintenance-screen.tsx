"use client";

import { useEffect, useMemo, useState } from "react";
import { WHATSAPP_ADMIN } from "@/lib/constants";
import { AUTO_REMOVAL_AT_ISO, getLifecycleCopy, getSiteLifecycleState, MAINTENANCE_END_AT_ISO } from "@/lib/site-status";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatWhatsappLink(phone: string) {
  const normalized = phone.replace(/\D/g, "");
  const text = encodeURIComponent("Halo admin, saya ingin menanyakan status maintenance website.");
  return `https://wa.me/${normalized}?text=${text}`;
}

function buildCountdown(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);

  return {
    completed: diff <= 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function MaintenanceScreen() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const lifecycle = useMemo(() => getLifecycleCopy(new Date(now)), [now]);
  const state = useMemo(() => getSiteLifecycleState(new Date(now)), [now]);
  const maintenanceCountdown = useMemo(() => buildCountdown(MAINTENANCE_END_AT_ISO), [now]);
  const shutdownCountdown = useMemo(() => buildCountdown(AUTO_REMOVAL_AT_ISO), [now]);
  const whatsappHref = useMemo(() => formatWhatsappLink(WHATSAPP_ADMIN), []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.05),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%,transparent_80%,rgba(255,255,255,0.04))]" />

      <section className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div className="flex flex-col justify-between rounded-[28px] border border-white/8 bg-black/40 p-6 sm:p-8">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-white/55">
                {state === "sunset" ? "service discontinued" : "serious maintenance mode"}
              </div>
              <p className="mt-8 text-xs uppercase tracking-[0.5em] text-white/38">Kograph Studio.id</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {lifecycle.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                {lifecycle.message}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Akses website", state === "sunset" ? "Seluruh halaman dinonaktifkan dan tidak lagi melayani akses publik." : "Seluruh halaman publik dan dashboard ditutup selama maintenance berlangsung."],
                ["Pembayaran", state === "sunset" ? "Pembuatan transaksi dan pengecekan pembayaran sudah dihentikan." : "Seluruh proses checkout, payment, dan verifikasi transaksi sementara dibekukan."],
                ["Layanan sistem", state === "sunset" ? "Fitur utama tidak dapat digunakan kembali tanpa aktivasi ulang dari sisi pengembang." : "Jika maintenance melewati toleransi 7 hari, sistem akan menonaktifkan website otomatis."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/50">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col rounded-[28px] border border-white/8 bg-[#050505] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/42">{lifecycle.statusLabel}</p>
                <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {state === "sunset" ? "06 April 2026 · 10.00 WIB" : lifecycle.isPastMaintenanceEnd ? "06 April 2026 · 10.00 WIB" : "30 Maret 2026 · 10.00 WIB"}
                </p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/50">
                {state === "sunset" ? "final" : lifecycle.isPastMaintenanceEnd ? "grace period" : "countdown"}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-white">Status sistem</p>
              <div className="mt-4 space-y-3 text-sm text-white/55">
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                  <span>Akses pengguna</span>
                  <span className="text-white">Dinonaktifkan</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
                  <span>Order & pembayaran</span>
                  <span className="text-white">Tidak tersedia</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>API & fitur internal</span>
                  <span className="text-white">Diblokir sistem</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/42">
                {lifecycle.isPastMaintenanceEnd ? "countdown auto nonaktif" : "countdown maintenance"}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [lifecycle.isPastMaintenanceEnd ? shutdownCountdown.days : maintenanceCountdown.days, "Hari"],
                  [lifecycle.isPastMaintenanceEnd ? shutdownCountdown.hours : maintenanceCountdown.hours, "Jam"],
                  [lifecycle.isPastMaintenanceEnd ? shutdownCountdown.minutes : maintenanceCountdown.minutes, "Menit"],
                  [lifecycle.isPastMaintenanceEnd ? shutdownCountdown.seconds : maintenanceCountdown.seconds, "Detik"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-5 text-center">
                    <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{pad(Number(value))}</div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.28em] text-white/38">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.02] p-4 text-sm leading-7 text-white/55">
              {state === "sunset"
                ? "Website telah masuk status nonaktif otomatis. Untuk kebutuhan informasi lanjutan, seluruh komunikasi dialihkan melalui admin."
                : lifecycle.isPastMaintenanceEnd
                  ? "Maintenance telah melewati jadwal pembukaan kembali. Sistem sedang menghitung batas maksimal 7 hari sebelum website dihentikan otomatis."
                  : "Seluruh fitur sengaja disembunyikan agar tidak ada transaksi, akses dashboard, atau perubahan data selama maintenance berlangsung."}
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Hubungi WhatsApp Admin
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
