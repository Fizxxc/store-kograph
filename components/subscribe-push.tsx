"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function SubscribePush() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleEnable() {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setMessage("Browser ini belum mendukung web push.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || ""),
      });

      const response = await fetch("/api/web-push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Gagal menyimpan subscription");
      setMessage("Web push aktif. Kamu akan terima broadcast dan status payment.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengaktifkan web push");
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">Aktifkan web push</h3>
          <p className="mt-1 text-sm text-slate-400">Tanpa API pihak ketiga. Notifikasi dikirim dari service worker dan route internal project.</p>
        </div>
        <button onClick={handleEnable} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-400">
          Enable
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}
