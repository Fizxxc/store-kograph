import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function verifyWebhook(headers: Headers) {
  const incoming = headers.get("x-webhook-secret") || headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return incoming && incoming === process.env.CASHIFY_WEBHOOK_SECRET;
}

export async function POST(request: Request) {
  const rawPayload = await request.text();
  let payload: any = {};
  try {
    payload = rawPayload ? JSON.parse(rawPayload) : {};
  } catch {
    payload = { rawPayload };
  }

  await supabaseAdmin.from("webhook_logs").insert({
    provider: "cashify",
    event_name: payload.status || payload.event || "unknown",
    payload,
  });

  if (!verifyWebhook(request.headers)) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  const transactionId = payload.transactionId || payload.data?.transactionId;
  const status = payload.status || payload.data?.status || "pending";
  if (!transactionId) return NextResponse.json({ ok: true, ignored: true });

  const patch: Record<string, unknown> = {
    payment_status: status,
    meta: payload,
    updated_at: new Date().toISOString(),
  };
  if (status === "paid") patch.order_status = "done";

  const { data: order } = await supabaseAdmin
    .from("orders")
    .update(patch)
    .eq("cashify_transaction_id", transactionId)
    .select("id, user_id, order_code, product_name, cashify_total_amount")
    .maybeSingle();

  if (order && status === "paid") {
    const { data: subscriptions } = await supabaseAdmin
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", order.user_id);

    const webpush = (await import("@/lib/web-push")).getWebPush();
    await Promise.allSettled((subscriptions || []).map((item: any) =>
      webpush.sendNotification(item.subscription, JSON.stringify({
        title: "Payment berhasil",
        body: `${order.order_code} • ${order.product_name} berhasil dibayar`,
        url: "/dashboard?tab=orders",
      }))
    ));
  }

  return NextResponse.json({ ok: true });
}
