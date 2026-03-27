import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getWebPush } from "@/lib/web-push";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { title, message } = await request.json();
    const { data: subscriptions } = await supabaseAdmin.from("push_subscriptions").select("subscription");

    await supabaseAdmin.from("broadcasts").insert({ title, message, created_by: session.user.id });

    const webpush = getWebPush();
    const results = await Promise.allSettled((subscriptions || []).map((item: any) =>
      webpush.sendNotification(item.subscription, JSON.stringify({
        title,
        body: message,
        url: "/dashboard?tab=broadcasts",
      }))
    ));

    return NextResponse.json({ ok: true, count: results.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal broadcast" }, { status: 500 });
  }
}
