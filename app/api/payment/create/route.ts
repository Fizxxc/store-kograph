import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createCashifyPayment } from "@/lib/cashify";
import { buildOrderCode, whatsappLink } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const productId = body.productId as string;
    if (!productId) return NextResponse.json({ error: "productId wajib diisi" }, { status: 400 });

    const { data: product } = await supabase.from("products").select("*").eq("id", productId).single();
    if (!product) return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    const cashify = await createCashifyPayment(product.display_price);
    const orderCode = buildOrderCode();
    const whatsappText = [
      "Halo admin KOGRAPH STUDIO.ID,",
      `Payment berhasil untuk order ${orderCode}.`,
      `Produk: ${product.name}`,
      `Kategori: ${product.category}`,
      `Metode: QRIS`,
      `Total: Rp${cashify.totalAmount}`,
    ].join("\n");

    const insertPayload = {
      user_id: session.user.id,
      order_code: orderCode,
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      display_amount: product.display_price,
      payment_method: "qris",
      payment_status: cashify.status || "pending",
      order_status: "waiting_payment",
      qr_string: cashify.qr_string,
      cashify_transaction_id: cashify.transactionId,
      cashify_total_amount: cashify.totalAmount,
      unique_nominal: cashify.uniqueNominal,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      whatsapp_url: whatsappLink(process.env.WHATSAPP_ADMIN || "6288991114939", whatsappText),
      meta: cashify,
    };

    const { data: order, error } = await supabase.from("orders").insert(insertPayload).select("*").single();
    if (error) throw error;

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal membuat payment" }, { status: 500 });
  }
}
