import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.json<ApiResponse>(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
