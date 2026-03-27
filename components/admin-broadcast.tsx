"use client";

import { useState } from "react";

export function AdminBroadcast() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/web-push/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });
    const payload = await response.json();
    setStatus(response.ok ? `Broadcast dikirim ke ${payload.count} subscription.` : payload.error || "Gagal kirim broadcast");
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold text-white">Broadcast ke user</h3>
      <div className="mt-4 grid gap-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul broadcast" required />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Isi pesan" rows={4} required />
        <button className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-400">Kirim broadcast</button>
      </div>
      {status ? <p className="mt-3 text-sm text-slate-300">{status}</p> : null}
    </form>
  );
}
