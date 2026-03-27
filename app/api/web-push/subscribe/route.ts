import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscription = await request.json();
    const { error } = await supabaseAdmin.from("push_subscriptions").upsert({
      user_id: session.user.id,
      endpoint: subscription.endpoint,
      subscription,
    }, { onConflict: "endpoint" });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal simpan subscription" }, { status: 500 });
  }
}
