import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: drawId } = await params;

    // 1. Fetch Draw Data
    const { data: draw, error: drawError } = await supabaseServiceRole
      .from("draws")
      .select(`
        *,
        creator:users!created_by (
           name
        )
      `)
      .eq("id", drawId)
      .single();

    if (drawError || !draw) {
      return NextResponse.json({ error: "Draw not found" }, { status: 404 });
    }

    // 2. Fetch Winners for this Draw
    const { data: winners, error: winnersError } = await supabaseServiceRole
      .from("draw_entries")
      .select(`
        *,
        user:users!draw_entries_user_id_fkey (
           name,
           email
        )
      `)
      .eq("draw_id", drawId)
      .filter("prize_amount_pence", "gt", 0);

    return NextResponse.json({
      success: true,
      data: {
        draw,
        winners: winners || []
      }
    });

  } catch (error: any) {
    console.error("Individual draw fetch error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
