import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ScoreSchema } from '@/lib/validators/scores';
import { ApiResponse } from '@/types';

/**
 * GET - Fetch all scores for the current user (newest first)
 */
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { data: scores, error } = await supabase
    .from('golf_scores')
    .select('id, score, played_at, created_at')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false });

  if (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    data: scores,
  });
}

/**
 * POST - Add a new score
 * Implements rolling-5 deletion: if a 6th score is added, 
 * the oldest one (by played_at) is removed.
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 2. Subscription check
  const { data: sub, error: subError } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (subError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to verify subscription' },
      { status: 500 }
    );
  }

  if (!sub) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Only subscribed users can enter scores' },
      { status: 403 }
    );
  }

  // 3. Validate body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const validated = ScoreSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: validated.error.issues[0].message },
      { status: 400 }
    );
  }

  // 4. Rolling-5 Deletion Logic
  const { count, error: countError } = await supabase
    .from('golf_scores')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (countError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to calculate score slots' },
      { status: 500 }
    );
  }

  if (count !== null && count >= 5) {
    // Find the oldest score (by played_at)
    const { data: oldest, error: findOldestError } = await supabase
      .from('golf_scores')
      .select('id')
      .eq('user_id', user.id)
      .order('played_at', { ascending: true })
      .limit(1)
      .single();

    if (oldest && !findOldestError) {
      await supabase.from('golf_scores').delete().eq('id', oldest.id);
    }
  }

  // 5. Insert new score
  const { error: insertError } = await supabase
    .from('golf_scores')
    .insert({
      user_id: user.id,
      score: validated.data.score,
      played_at: validated.data.played_at,
    });

  if (insertError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: insertError.message },
      { status: 500 }
    );
  }

  // 6. Return updated full scores list
  const { data: updatedScores, error: fetchError } = await supabase
    .from('golf_scores')
    .select('id, score, played_at, created_at')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false });

  if (fetchError) {
     return NextResponse.json<ApiResponse>(
      { success: false, error: 'Score added but failed to fetch updated list' },
      { status: 500 }
    );
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    data: updatedScores,
  });
}
