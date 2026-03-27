import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch verifications for this user
    const { data: verifications, error } = await supabase
      .from("winner_verifications")
      .select(`
        *,
        draw_entries (
          match_count,
          prize_amount_pence,
          matched_numbers,
          scores_snapshot,
          draws (
            draw_date,
            drawn_numbers,
            draw_mode
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: verifications
    });

  } catch (error: any) {
    console.error("Fetch winnings error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
