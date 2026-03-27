import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseServiceRole } from "@/lib/supabase/service";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin check
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // FETCH OVERVIEW METRICS
    
    // 1. Users & Subscribers
    const { count: totalUsers } = await supabaseServiceRole
      .from("users")
      .select("*", { count: 'exact', head: true });
      
    const { count: activeSubscribers } = await supabaseServiceRole
      .from("subscriptions")
      .select("*", { count: 'exact', head: true })
      .eq("status", "active");

    // New this month (Signups)
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const { count: newThisMonth } = await supabaseServiceRole
      .from("users")
      .select("*", { count: 'exact', head: true })
      .gte("created_at", firstDayOfMonth.toISOString());

    // Churn (cancelled this month)
    const { count: churnThisMonth } = await supabaseServiceRole
      .from("subscriptions")
      .select("*", { count: 'exact', head: true })
      .eq("status", "cancelled"); // Simplified for now

    // 2. Revenue
    // Using a simple aggregation. Real production would use a Stripe link or transactions table.
    // Here we sum active subscriptions x plan price
    const { data: revenueData } = await supabaseServiceRole
      .from("subscriptions")
      .select(`
        plan_id,
        subscription_plans (
          price
        )
      `)
      .eq("status", "active");
    
    const total_this_month_pence = (revenueData || []).reduce((sum, s: any) => sum + (s.subscription_plans?.price || 0), 0);

    // Distributed (all time)
    const { data: distributedData } = await supabaseServiceRole
      .from("draws")
      .select("total_prize_pool_pence")
      .eq("status", "published");
    
    const prize_pool_distributed_pence = (distributedData || []).reduce((sum, d) => sum + d.total_prize_pool_pence, 0);

    // 3. Draws
    const { data: lastDraw } = await supabaseServiceRole
      .from("draws")
      .select("draw_date, status")
      .eq("status", "published")
      .order("draw_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: rolloverData } = await supabaseServiceRole
      .from("jackpot_rollovers")
      .select("amount_pence")
      .is("to_draw_id", null)
      .maybeSingle();

    // 4. Winners
    const { count: pendingVerification } = await supabaseServiceRole
      .from("winner_verifications")
      .select("*", { count: 'exact', head: true })
      .eq("status", "proof_submitted");

    const { count: pendingPayment } = await supabaseServiceRole
      .from("winner_verifications")
      .select("*", { count: 'exact', head: true })
      .eq("status", "approved");

    const { count: paidThisMonth } = await supabaseServiceRole
      .from("winner_verifications")
      .select("*", { count: 'exact', head: true })
      .eq("status", "paid")
      .gte("paid_at", firstDayOfMonth.toISOString());

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers || 0,
          active_subscribers: activeSubscribers || 0,
          new_this_month: newThisMonth || 0,
          churn_this_month: churnThisMonth || 0
        },
        revenue: {
          total_this_month_pence: total_this_month_pence,
          total_all_time_pence: 0, // Would need historical transaction logs
          prize_pool_distributed_pence: prize_pool_distributed_pence,
          charity_distributed_pence: 0 // Would need detailed payment splitting records
        },
        draws: {
          total_published: distributedData?.length || 0,
          last_draw_date: lastDraw?.draw_date || null,
          next_draw_status: 'Scheduled',
          current_jackpot_pence: rolloverData?.amount_pence || 0
        },
        winners: {
          pending_verification: pendingVerification || 0,
          pending_payment: pendingPayment || 0,
          paid_this_month: paidThisMonth || 0
        }
      }
    });

  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
