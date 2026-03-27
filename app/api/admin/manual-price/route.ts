import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { productId, displayPrice } = await request.json();
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update({ display_price: displayPrice, updated_at: new Date().toISOString() })
      .eq("id", productId)
      .select("id, name, display_price")
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal update harga" }, { status: 500 });
  }
}
