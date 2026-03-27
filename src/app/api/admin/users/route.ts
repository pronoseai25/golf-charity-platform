import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    let query = supabaseServiceRole
      .from('users')
      .select(`
        *,
        subscriptions (
          status,
          subscription_plans (
            name
          )
        ),
        golf_scores (
          count
        ),
        user_charities (
          count
        )
      `, { count: 'exact' });

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    // Role filtering or status filtering if needed
    // However, status is tied to subscriptions. Supabase RLS or complex joins might be needed for direct filtering.
    // Let's filter in query if possible or fetch and filter (pagination is tricky with that)

    const { data: users, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        users,
        total: count,
        page,
        limit
      }
    });

  } catch (error: any) {
    console.error("Admin user list error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
