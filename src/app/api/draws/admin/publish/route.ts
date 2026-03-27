import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { PublishDrawSchema } from "@/lib/validators/draw";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Admin check
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
    const validated = PublishDrawSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.message }, { status: 400 });
    }

    const { draw_id } = validated.data;

    // 4. Fetch draw
    const { data: draw, error: drawError } = await supabaseServiceRole
      .from("draws")
      .select("*")
      .eq("id", draw_id)
      .single();

    if (drawError || !draw) {
      return NextResponse.json({ error: "Draw not found" }, { status: 404 });
    }

    if (draw.status !== "simulated") {
      return NextResponse.json({ error: "Only simulated draws can be published" }, { status: 400 });
    }

    // 5. Update draw status
    const { error: updateError } = await supabaseServiceRole
      .from("draws")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", draw_id);

    if (updateError) throw updateError;

    // 6. Handle Jackpot Rollover
    // Check if there are any tier 1 (5-match) winners
    const { count: jackpotWinnerCount, error: winnerError } = await supabaseServiceRole
      .from("draw_entries")
      .select("*", { count: 'exact', head: true })
      .eq("draw_id", draw_id)
      .eq("match_count", 5);

    if (winnerError) throw winnerError;

    if (!jackpotWinnerCount || jackpotWinnerCount === 0) {
      // If no winners, jackpot is carried over
      await supabaseServiceRole
        .from("draws")
        .update({ jackpot_carried_over: true })
        .eq("id", draw_id);

      // Create new rollover record for future draws
      // We set from_draw_id to this draw, and to_draw_id = null (will be picked by next simulate)
      await supabaseServiceRole
        .from("jackpot_rollovers")
        .insert({
          from_draw_id: draw_id,
          to_draw_id: null,
          amount_pence: draw.jackpot_pool_pence
        });
    } else {
      // Jackpot was won! 
      // Update any OPEN rollovers to point to this draw_id
      await supabaseServiceRole
        .from("jackpot_rollovers")
        .update({ to_draw_id: draw_id })
        .is("to_draw_id", null);
    }

    // 7. Update winners' payment status
    await supabaseServiceRole
      .from("draw_entries")
      .update({ payment_status: "pending" })
      .eq("draw_id", draw_id)
      .gte("match_count", 3)
      .gt("prize_amount_pence", 0);

    return NextResponse.json({
      success: true,
      message: "Draw published successfully"
    });

  } catch (error: any) {
    console.error("Publishing error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
