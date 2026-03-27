import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkCashifyStatus } from "@/lib/cashify";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { transactionId, orderId } = await request.json();
    const statusPayload = await checkCashifyStatus(transactionId);

    const patch: Record<string, unknown> = {
      payment_status: statusPayload.status,
      meta: statusPayload,
      updated_at: new Date().toISOString(),
    };

    if (statusPayload.status === "paid") {
      patch.order_status = "done";
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update(patch)
      .eq("id", orderId)
      .eq("user_id", session.user.id)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ order, status: statusPayload });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal cek status payment" }, { status: 500 });
  }
}
