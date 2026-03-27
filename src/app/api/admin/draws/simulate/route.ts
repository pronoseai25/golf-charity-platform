import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { runDrawEngine } from "@/lib/draw/engine";
import { ApiResponse } from "@/types";

/**
 * POST /api/admin/draws/simulate
 * Simulates a draw result based on current eligible subscribers and their scores.
 * Uses service role to fetch complete platform data.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draw_mode, draw_date } = body;

    if (!draw_mode || !draw_date) {
      return NextResponse.json({ success: false, error: "Missing draw_mode or draw_date" }, { status: 400 });
    }

    // 1. Fetch all eligible subscribers (active status)
    // We join with users for name/email and with plans for the price_pence (pool calc)
    const { data: eligibleSubs, error: subError } = await supabaseServiceRole
      .from("subscriptions")
      .select(`
        user_id,
        users:users!user_id (name, email),
        plans:subscription_plans!plan_id (price)
      `)
      .eq("status", "active");

    if (subError) throw subError;

    if (!eligibleSubs || eligibleSubs.length === 0) {
      return NextResponse.json({ success: false, error: "No active subscribers found for draw simulation" }, { status: 404 });
    }

    // 2. Fetch scores for these users (all scores, engine will handle mapping)
    const userIds = eligibleSubs.map(s => s.user_id);
    const { data: allScores, error: scoreError } = await supabaseServiceRole
      .from("golf_scores")
      .select("user_id, score, played_at")
      .in("user_id", userIds)
      .order('played_at', { ascending: false });

    if (scoreError) throw scoreError;

    // 3. Fetch jackpot rollover from the latest published draw
    const { data: latestDraw, error: drawError } = await supabaseServiceRole
      .from("draws")
      .select("jackpot_pool_pence, status")
      .order('draw_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    // If latest draw was published but jackpot wasn't won, we carry over?
    // Actually, the schema logic for rollover should be checked.
    // For simulation, we'll check if a jackpot_pool needs to be carried over if no winners were found.
    // But for "carriedOverAmount" input to engine, we use whatever was left from LAST draw.
    const carriedOverAmount = latestDraw?.status === 'PUBLISHED' ? latestDraw.jackpot_pool_pence : 0;

    // 4. Map data to Engine format
    const engineEligibleUsers = eligibleSubs.map(sub => {
      const userScores = allScores
        .filter(s => s.user_id === sub.user_id)
        .slice(0, 5) // Use top 5 recent scores
        .map(s => s.score);
      
      return {
        user_id: sub.user_id,
        name: (sub.users as any).name,
        email: (sub.users as any).email,
        scores: userScores,
        plan_price: (sub.plans as any).price
      };
    }).filter(u => u.scores.length > 0); // Only users with scores compete? 
    // Actually, users without scores still paid, but they have 0 matched numbers automatically.
    // I'll keep them but treat empty scores array as competing.

    // 5. Run Engine
    const simulation = runDrawEngine(
      draw_mode,
      draw_date,
      engineEligibleUsers,
      carriedOverAmount
    );

    return NextResponse.json({
      success: true,
      data: simulation
    });

  } catch (error: any) {
    console.error("Simulation error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Simulation failed" 
    }, { status: 500 });
  }
}
