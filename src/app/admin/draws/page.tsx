import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDrawsClient from "./AdminDrawsClient";

export default async function AdminDrawsPage() {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // 2. Admin role check
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 3. Fetch initial draws (published)
  const { data: draws, error } = await supabase
    .from("draws")
    .select("*")
    .eq("status", "published")
    .order("draw_date", { ascending: false });

  if (error) {
    console.error("Fetch draws error:", error);
  }

  return <AdminDrawsClient initialDraws={draws || []} />;
}
