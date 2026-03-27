import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';

/**
 * GET - Single charity profile by slug.
 * PUBLIC ROUTE - no auth required.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: charity, error } = await supabase
    .from('charities')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  if (!charity) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Charity not found' },
      { status: 404 }
    );
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    data: charity,
  });
}
