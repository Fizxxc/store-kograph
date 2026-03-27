import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { DashboardClient } from "@/components/dashboard-client";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/auth");

  const [{ data: profile }, { data: products }, { data: orders }, { data: broadcasts }] = await Promise.all([
    supabase.from("profiles").select("id, email, full_name, role").eq("id", session.user.id).single(),
    supabase.from("products").select("*").eq("is_active", true).order("category").order("display_price"),
    supabase.from("orders").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
    supabase.from("broadcasts").select("id, title, message, created_at").order("created_at", { ascending: false }).limit(20),
  ]);

  if (!profile) redirect("/auth");

  return (
    <main>
      <Header isAdmin={profile.role === "admin"} />
      <section className="container-shell py-10">
        <DashboardClient profile={profile} products={products || []} orders={orders || []} broadcasts={broadcasts || []} />
      </section>
      <MobileNav />
    </main>
  );
}
