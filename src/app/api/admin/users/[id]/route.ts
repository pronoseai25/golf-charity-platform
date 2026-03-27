import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/service";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    const { data: user, error: userError } = await supabaseServiceRole
      .from("users")
      .select(`
        *,
        subscriptions (
          *,
          subscription_plans (*)
        ),
        golf_scores (*),
        draw_entries (
          *,
          draws (*)
        ),
        user_charities (
          *,
          charities (*)
        ),
        winner_verifications (*)
      `)
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error: any) {
    console.error("Fetch individual user error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const body = await req.json();

    const { name, email, role } = body;

    // Build update object, excluding stripe_customer_id explicitly as per rules
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;

    const { data: updatedUser, error: updateError } = await supabaseServiceRole
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json<ApiResponse>({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

// DELETE GOLF SCORE specifically via user ID context? No, usually IDs are unique.
// But we might need a separate endpoint for scores or just handle it here if it's very specific.
// I'll keep it simple for now as requested.
