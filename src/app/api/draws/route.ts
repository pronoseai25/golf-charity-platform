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

    // Fetch published draws
    const { data: draws, error: drawError } = await supabase
      .from("draws")
      .select(`
        *,
        tier1_winners:draw_entries!inner(count),
        tier2_winners:draw_entries!inner(count),
        tier3_winners:draw_entries!inner(count)
      `)
      .eq("status", "published")
      .eq("draw_entries.match_count", 5)
      .eq("draw_entries.match_count", 4)
      .eq("draw_entries.match_count", 3)
      .order("draw_date", { ascending: false });

    // Note: The previous query is complex. Supabase's count filtering is tricky.
    // Let's rewrite it more simply with manual counting.
    
    const { data: publishedDraws, error: publishedError } = await supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("draw_date", { ascending: false });

    if (publishedError) throw publishedError;

    // Fetch winner counts for each draw
    const results = await Promise.all((publishedDraws || []).map(async (draw) => {
      const { data: winnerCounts, error: countError } = await supabase
        .from("draw_entries")
        .select("match_count")
        .eq("draw_id", draw.id)
        .gte("match_count", 3);

      if (countError) throw countError;

      return {
        ...draw,
        winner_counts: {
          tier1: (winnerCounts || []).filter(w => w.match_count === 5).length,
          tier2: (winnerCounts || []).filter(w => w.match_count === 4).length,
          tier3: (winnerCounts || []).filter(w => w.match_count === 3).length,
        }
      };
    }));

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error: any) {
    console.error("Fetch published draws error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
