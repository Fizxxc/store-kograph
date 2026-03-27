import type { Broadcast } from "@/lib/types";

export function BroadcastList({ broadcasts }: { broadcasts: Broadcast[] }) {
  return (
    <div className="surface p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Broadcast admin</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Info terbaru untuk user</h3>
      <div className="mt-6 grid gap-4">
        {broadcasts.length ? broadcasts.map((item) => (
          <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-white">{item.title}</h4>
              <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{item.message}</p>
          </article>
        )) : <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">Belum ada broadcast.</div>}
      </div>
    </div>
  );
}
