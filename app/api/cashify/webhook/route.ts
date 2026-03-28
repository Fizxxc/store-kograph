import { NextResponse } from "next/server";
import { isCashifyPaid, normalizeCashifyStatus } from "@/lib/cashify";
import { supabaseAdmin } from "@/lib/supabase/admin";

function verifyWebhook(headers: Headers) {
  const incoming =
    headers.get("x-webhook-secret") ||
    headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";
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

  const status = normalizeCashifyStatus(payload.status || payload.data?.status || "pending");

  await supabaseAdmin.from("webhook_logs").insert({
    provider: "cashify",
    event_name: status,
    payload,
  });

  if (!verifyWebhook(request.headers)) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  const transactionId = payload.transactionId || payload.data?.transactionId;
  if (!transactionId) return NextResponse.json({ ok: true, ignored: true });

  const patch: Record<string, unknown> = {
    payment_status: status,
    cashify_total_amount: payload.totalAmount || payload.data?.totalAmount || payload.amount || payload.data?.amount || null,
    expires_at: payload.expiredAt || payload.data?.expiredAt || null,
    meta: payload,
    updated_at: new Date().toISOString(),
  };

  if (isCashifyPaid(status)) patch.order_status = "done";

  const { data: order } = await supabaseAdmin
    .from("orders")
    .update(patch)
    .eq("cashify_transaction_id", transactionId)
    .select("id, user_id, order_code, product_name, cashify_total_amount")
    .maybeSingle();

  if (order && isCashifyPaid(status)) {
    const { data: subscriptions } = await supabaseAdmin
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", order.user_id);

    const webpush = (await import("@/lib/web-push")).getWebPush();
    await Promise.allSettled(
      (subscriptions || []).map((item: any) =>
        webpush.sendNotification(
          item.subscription,
          JSON.stringify({
            title: "Pembayaran diterima",
            body: `${order.order_code} • ${order.product_name}`,
            url: "/dashboard?tab=orders",
          }),
        ),
      ),
    );
  }

  return NextResponse.json({ ok: true });
}
