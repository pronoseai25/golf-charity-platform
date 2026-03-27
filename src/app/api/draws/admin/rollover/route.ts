import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Admin role check
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Fetch rollover records with draw details
    const { data: rollovers, error: rolloverError } = await supabase
      .from("jackpot_rollovers")
      .select(`
        *,
        from_draw:draws!from_draw_id (
          draw_date,
          jackpot_pool_pence,
          status
        ),
        to_draw:draws!to_draw_id (
          draw_date,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (rolloverError) throw rolloverError;

    return NextResponse.json({
      success: true,
      data: rollovers
    });

  } catch (error: any) {
    console.error("Fetch rollover history error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
