import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";

export const getPublicProducts = cache(async () => {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("display_price");
  return data ?? [];
});
