import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    // 1. Monthly Revenue & Subscribers
    // (In production, this would use a materialized view or Stripe historical logs)
    // Mocking structure but fetching real counts where possible
    const monthly_revenue = [
      { month: "Oct", revenue_pence: 420000, subscriber_count: 120 },
      { month: "Nov", revenue_pence: 480000, subscriber_count: 145 },
      { month: "Dec", revenue_pence: 560000, subscriber_count: 180 },
      { month: "Jan", revenue_pence: 510000, subscriber_count: 210 },
      { month: "Feb", revenue_pence: 620000, subscriber_count: 245 },
      { month: "Mar", revenue_pence: 740000, subscriber_count: 288 },
    ];

    // 2. Charity Contributions
    const { data: charityData } = await supabaseServiceRole
      .from("charities")
      .select(`
        name,
        user_charities (
          count,
          allocation_perc
        )
      `)
      .eq("is_active", true);

    const charity_contributions = (charityData || []).map(c => ({
      charity_name: c.name,
      total_pence: 0, // Would need entry aggregation
      supporter_count: c.user_charities?.length || 0
    }));

    // 3. Draw Statistics
    const { data: drawData } = await supabaseServiceRole
      .from("draws")
      .select(`
        draw_date,
        total_prize_pool_pence,
        jackpot_carried_over,
        draw_entries (
          count
        )
      `)
      .eq("status", "published")
      .order("draw_date", { ascending: false });

    const draw_statistics = (drawData || []).map(d => ({
      draw_date: d.draw_date,
      total_winners: d.draw_entries?.[0]?.count || 0,
      total_distributed_pence: d.total_prize_pool_pence,
      jackpot_carried_over: d.jackpot_carried_over
    }));

    // 4. Score Distribution (Histogram)
    const { data: scoreData } = await supabaseServiceRole
      .from("golf_scores")
      .select("score");
    
    const freq: Record<number, number> = {};
    (scoreData || []).forEach(s => {
       freq[s.score] = (freq[s.score] || 0) + 1;
    });
    
    const score_distribution = Object.entries(freq).map(([score, frequency]) => ({
      score: parseInt(score),
      frequency
    })).sort((a,b) => a.score - b.score);

    // 5. Subscription Breakdown
    const { count: monthlyCount } = await supabaseServiceRole
      .from("subscriptions")
      .select("*", { count: 'exact', head: true })
      .eq("status", "active"); // For now

    return NextResponse.json({
      success: true,
      data: {
        monthly_revenue,
        charity_contributions,
        draw_statistics,
        score_distribution,
        subscription_breakdown: {
          monthly_count: monthlyCount || 0,
          yearly_count: 0, // Need to join with plans
          cancelled_count: 0
        }
      }
    });

  } catch (error: any) {
    console.error("Admin reports error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
