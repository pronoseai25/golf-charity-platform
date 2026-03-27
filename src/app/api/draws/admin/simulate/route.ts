import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { SimulateDrawSchema } from "@/lib/validators/draw";
import { runDrawEngine } from "@/lib/draw/engine";
import { calculatePrizeAmounts } from "@/lib/draw/prize-calculator";
import { matchScores } from "@/lib/draw/matching";

export async function POST(req: NextRequest) {
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

    // 3. Validate body
    const body = await req.json();
    const validated = SimulateDrawSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.message }, { status: 400 });
    }

    const { draw_date, draw_mode } = validated.data;
    const yearMonth = draw_date.substring(0, 7); // YYYY-MM

    // 4. Check no published draw exists for this month
    const { data: existingDraw } = await supabaseServiceRole
      .from("draws")
      .select("id")
      .eq("status", "published")
      .gte("draw_date", `${yearMonth}-01`)
      .lte("draw_date", `${yearMonth}-31`)
      .limit(1)
      .maybeSingle();

    if (existingDraw) {
      return NextResponse.json({ 
        error: "A draw is already published for this month" 
      }, { status: 400 });
    }

    // 5. Fetch all active subscribers with their latest 5 scores
    // We'll fetch them and process the score limit in JS
    const { data: subscribers, error: subError } = await supabaseServiceRole
      .from("users")
      .select(`
        id,
        name,
        email,
        subscriptions!inner (
          status,
          subscription_plans (
            price
          )
        ),
        golf_scores (
          score,
          played_at
        )
      `)
      .eq("subscriptions.status", "active")
      .order("played_at", { foreignTable: "golf_scores", ascending: false });

    if (subError) throw subError;

    const processedSubscribers = (subscribers || []).map(sub => ({
      user_id: sub.id,
      name: sub.name,
      email: sub.email,
      // @ts-ignore - Handle nested structure
      plan_price: sub.subscriptions[0]?.subscription_plans?.price || 0,
      // Take up to 5 latest scores
      scores: (sub.golf_scores || [])
        .slice(0, 5)
        .map((gs: any) => gs.score)
    }));

    // 6. Fetch pending carried over jackpot amount
    const { data: rolloverData } = await supabaseServiceRole
      .from("jackpot_rollovers")
      .select("amount_pence")
      .is("to_draw_id", null)
      .single();

    const carriedOverAmount = rolloverData?.amount_pence || 0;

    // 7. Run engine
    const engineResult = runDrawEngine(
      draw_mode,
      draw_date,
      processedSubscribers,
      carriedOverAmount
    );

    // 8. Save draw to DB with status = 'simulated'
    // First, check if there's an existing 'simulated' draw for this month to overwrite or handle
    const { data: prevSim } = await supabaseServiceRole
      .from("draws")
      .select("id")
      .eq("status", "simulated")
      .gte("draw_date", `${yearMonth}-01`)
      .lte("draw_date", `${yearMonth}-31`)
      .maybeSingle();

    if (prevSim) {
      // Delete old simulation entries first
      await supabaseServiceRole.from("draw_entries").delete().eq("draw_id", prevSim.id);
      await supabaseServiceRole.from("draws").delete().eq("id", prevSim.id);
    }

    const { data: newDraw, error: drawError } = await supabaseServiceRole
      .from("draws")
      .insert({
        draw_date,
        drawn_numbers: engineResult.drawn_numbers,
        draw_mode: engineResult.draw_mode,
        status: "simulated",
        total_prize_pool_pence: engineResult.total_prize_pool_pence,
        jackpot_pool_pence: engineResult.jackpot_pool_pence,
        tier2_pool_pence: engineResult.tier2_pool_pence,
        tier3_pool_pence: engineResult.tier3_pool_pence,
        carried_over_amount_pence: engineResult.carried_over_amount_pence,
        created_by: user.id
      })
      .select()
      .single();

    if (drawError) throw drawError;

    // 9. Save draw entries
    const entriesToInsert = processedSubscribers.map(sub => {
      const match = matchScores(sub.scores, engineResult.drawn_numbers);
      
      // Calculate individual prize amount
      // (engine already did this but we need to map back to right users)
      let prize_amount_pence = 0;
      if (match.matchCount === 5) {
        prize_amount_pence = engineResult.winner_counts.tier1 > 0 
          ? Math.floor(engineResult.jackpot_pool_pence / engineResult.winner_counts.tier1) 
          : 0;
      } else if (match.matchCount === 4) {
        prize_amount_pence = engineResult.winner_counts.tier2 > 0 
          ? Math.floor(engineResult.tier2_pool_pence / engineResult.winner_counts.tier2) 
          : 0;
      } else if (match.matchCount === 3) {
        prize_amount_pence = engineResult.winner_counts.tier3 > 0 
          ? Math.floor(engineResult.tier3_pool_pence / engineResult.winner_counts.tier3) 
          : 0;
      }

      return {
        draw_id: newDraw.id,
        user_id: sub.user_id,
        scores_snapshot: sub.scores,
        matched_numbers: match.matchedNumbers,
        match_count: match.matchCount,
        prize_amount_pence: prize_amount_pence,
        payment_status: "unpaid"
      };
    });

    const { error: entriesError } = await supabaseServiceRole
      .from("draw_entries")
      .insert(entriesToInsert);

    if (entriesError) throw entriesError;

    engineResult.draw_id = newDraw.id;

    return NextResponse.json({
      success: true,
      data: engineResult
    });

  } catch (error: any) {
    console.error("Simulation error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
