import { createServerSupabase } from "@/lib/supabase/server";

export async function getSessionProfile() {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { session: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", session.user.id)
    .single();

  return { session, profile };
}
