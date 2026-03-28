import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch draw detail
    const { data: draw, error: drawError } = await supabase
      .from("draws")
      .select("*")
      .eq("id", id)
      .single();

    if (drawError || !draw) {
      return NextResponse.json({ error: "Draw not found" }, { status: 404 });
    }

    // 3. Admin or Published check
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = userData?.role === "ADMIN";
    if (draw.status !== "published" && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Fetch my entry
    const { data: myEntry, error: entryError } = await supabase
      .from("draw_entries")
      .select("*")
      .eq("draw_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (entryError) throw entryError;

    // 5. Fetch other winners (only winners)
    const { data: winners, error: winnersError } = await supabase
      .from("draw_entries")
      .select(`
        match_count,
        prize_amount_pence,
        payment_status,
        users (
          name
        )
      `)
      .eq("draw_id", id)
      .gte("match_count", 3)
      .not("user_id", "eq", user.id) // exclude current user to avoid duplicate
      .limit(100);

    if (winnersError) throw winnersError;

    // Map winners into a simpler format
    const formattedWinners = (winners || []).map((w: any) => ({
      user_name: w.users?.name || "Unknown Player",
      match_count: w.match_count,
      prize_amount_pence: w.prize_amount_pence,
      payment_status: w.payment_status
    }));

    return NextResponse.json({
      success: true,
      data: {
        draw,
        my_entry: myEntry,
        winners: formattedWinners
      }
    });

  } catch (error: any) {
    console.error("Fetch single draw error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
