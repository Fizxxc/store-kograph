"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WHATSAPP_ADMIN } from "@/lib/constants";

const TARGET_DATE_ISO = "2026-03-30T10:00:00+07:00";

function getCountdownParts() {
  const target = new Date(TARGET_DATE_ISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const completed = diff <= 0;

  return { days, hours, minutes, seconds, completed };
}

function formatWhatsappLink(phone: string) {
  const normalized = phone.replace(/\D/g, "");
  const text = encodeURIComponent("Halo admin, saya ingin menanyakan info maintenance Kograph Studio.");
  return `https://wa.me/${normalized}?text=${text}`;
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function MaintenanceScreen() {
  const [countdown, setCountdown] = useState(getCountdownParts);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const whatsappHref = useMemo(() => formatWhatsappLink(WHATSAPP_ADMIN), []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.11),transparent_32%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      <section className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur sm:p-10 lg:min-h-[calc(100vh-64px)] lg:flex-row lg:gap-16 lg:p-14">
          <div className="flex max-w-2xl flex-1 flex-col justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-white/65">
                KOGRAPH.ID - MAINTENANCE
              </div>
              <p className="mt-8 text-sm uppercase tracking-[0.45em] text-white/45">Kograph Studio.id</p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Website sedang dalam proses peningkatan sistem.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                Kami sedang merapikan pengalaman belanja dan pembayaran agar lebih stabil, lebih cepat, dan lebih nyaman saat digunakan.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Tampilan", "Lebih bersih dan fokus pada informasi penting."],
                ["Pembayaran", "Alur transaksi sedang disempurnakan agar lebih konsisten."],
                ["Rilis", "Website akan dibuka kembali setelah proses selesai."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/50">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full max-w-xl flex-col justify-between rounded-[28px] border border-white/10 bg-black/70 p-5 sm:p-6 lg:min-w-[420px] lg:p-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-white/45">estimasi selesai</p>
                  <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">30 Maret 2026 · 10.00 WIB</p>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
                  {countdown.completed ? "Selesai" : "Dalam proses"}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [countdown.days, "Hari"],
                  [countdown.hours, "Jam"],
                  [countdown.minutes, "Menit"],
                  [countdown.seconds, "Detik"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-5 text-center">
                    <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{pad(Number(value))}</div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.28em] text-white/40">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.025] p-4">
                <p className="text-sm font-medium text-white">Butuh bantuan lebih cepat?</p>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Hubungi admin untuk pertanyaan pesanan, pembayaran, atau kebutuhan informasi lainnya.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Hubungi WhatsApp Admin
              </a>
              <Link
                href="/auth"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-white/85 transition hover:border-white hover:text-white"
              >
                Masuk ke akun
              </Link>
            </div>

            <p className="mt-5 text-xs leading-6 text-white/35">
              Countdown berjalan menuju jadwal pembukaan kembali. Waktu dapat berubah bila proses peningkatan membutuhkan penyesuaian tambahan.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
