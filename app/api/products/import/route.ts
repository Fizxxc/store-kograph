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

    const { products } = await request.json();
    if (!Array.isArray(products) || !products.length) {
      return NextResponse.json({ error: "Produk kosong" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("products").upsert(products, { onConflict: "slug" });
    if (error) throw error;
    return NextResponse.json({ ok: true, count: products.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Import gagal" }, { status: 500 });
  }
}
