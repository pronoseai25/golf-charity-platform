import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CharityPercSchema } from '@/lib/validators/charity';
import { ApiResponse } from '@/types';

/**
 * PATCH - Update charity contribution percentage.
 * PROTECTED ROUTE - requires session.
 * Minimum % is enforced from current plan (defaulting to 10).
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 2. Validate body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const validated = CharityPercSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: validated.error.issues[0].message },
      { status: 400 }
    );
  }

  // 3. Fetch current plan to determine minimal_charity_fee
  // We join users -> subscriptions -> subscription_plans
  const { data: sub, error: subError } = await supabase
    .from('subscriptions')
    .select('*, subscription_plans(minimal_charity_fee)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (subError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to verify active plan' },
      { status: 500 }
    );
  }

  const minimal_fee = (sub as any)?.subscription_plans?.minimal_charity_fee ?? 10;

  // Enforce minimal fee (must be at least plan minimum)
  if (validated.data.charity_perc < minimal_fee) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Minimum contribution for your current plan is ${minimal_fee}%` },
      { status: 400 }
    );
  }

  // 4. Update user percentage
  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      charity_perc: validated.data.charity_perc,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    data: { charity_perc: validated.data.charity_perc },
  });
}
