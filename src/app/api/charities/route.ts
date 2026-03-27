import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';

/**
 * GET - Charity directory with search and featured filters.
 * PUBLIC ROUTE - no auth required.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  const supabase = await createClient();

  let query = supabase
    .from('charities')
    .select('id, name, slug, description, image_url, is_featured')
    .eq('is_active', true);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data: charities, error } = await query;

  if (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    data: charities,
  });
}
