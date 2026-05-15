import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("[sign-out] Supabase signOut failed:", error.message);
  }
  return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
}
