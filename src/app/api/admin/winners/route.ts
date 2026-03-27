import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse, VerificationStatus } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as VerificationStatus | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabaseServiceRole
      .from("winner_verifications")
      .select(`
        *,
        user:users!winner_verifications_user_id_fkey (
          name,
          email
        ),
        draw_entry:draw_entries!winner_verifications_draw_entry_id_fkey (
          match_count,
          prize_amount_pence,
          matched_numbers,
          draw:draws!draw_entries_draw_id_fkey (
            draw_date,
            drawn_numbers
          )
        )
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: verifications, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        verifications,
        total: count,
        page,
        limit
      }
    });

  } catch (error: any) {
    console.error("Admin winners fetch error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
