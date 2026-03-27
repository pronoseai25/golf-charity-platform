import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const { data: subscriptions, count, error } = await supabaseServiceRole
      .from("subscriptions")
      .select(`
        *,
        users (
          name,
          email
        ),
        subscription_plans (
          name,
          price_pence,
          interval
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        total: count,
        page,
        limit
      }
    });

  } catch (error: any) {
    console.error("Admin subscriptions fetch error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

// In production, cancellation would also call Stripe.
// For now, updating the status in DB as per existing platform rules.
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription_id, status } = body;

    const { data, error } = await supabaseServiceRole
      .from("subscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", subscription_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      data
    });

  } catch (error: any) {
    console.error("Subscription update error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed update" 
    }, { status: 500 });
  }
}
