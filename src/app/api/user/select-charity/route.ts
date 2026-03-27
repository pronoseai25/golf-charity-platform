import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SelectCharitySchema } from '@/lib/validators/charity';
import { ApiResponse } from '@/types';

/**
 * POST - Select a charity for the current user.
 * PROTECTED ROUTE - requires session.
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

  const validated = SelectCharitySchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: validated.error.issues[0].message },
      { status: 400 }
    );
  }

  // 3. Verify charity exists and is active
  const { data: charity, error: charityError } = await supabase
    .from('charities')
    .select('id')
    .eq('id', validated.data.charityId)
    .eq('is_active', true)
    .maybeSingle();

  if (charityError || !charity) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Charity not found or inactive' },
      { status: 404 }
    );
  }

  // 4. Update user
  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      selected_charity_id: validated.data.charityId,
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
    message: 'Charity selected successfully',
  });
}
