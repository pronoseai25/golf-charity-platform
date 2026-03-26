import { createClient } from '@/lib/supabase/server';
import { SignupSchema } from '@/lib/validators/auth';
import { ApiResponse } from '@/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = SignupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name, role } = result.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: 'Account created' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
