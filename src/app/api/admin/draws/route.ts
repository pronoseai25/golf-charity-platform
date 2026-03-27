import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const { data: draws, count, error } = await supabaseServiceRole
      .from("draws")
      .select(`
        *,
        creator:users!created_by (
          name
        ),
        winner_count:draw_entries (
          count
        )
      `, { count: 'exact' })
      .order('draw_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        draws,
        total: count,
        page,
        limit
      }
    });

  } catch (error: any) {
    console.error("Admin fetch draws error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
