import { NextResponse } from "next/server";
import { getSupabaseAuthClient } from "@/app/lib/supabaseAuthClient";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await getSupabaseAuthClient();

  if (!supabase) {
    return NextResponse.json({ error: "Failed to initialize Supabase client" }, { status: 500 });
  }

  const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("clerk_user_id", userId)
        .single();
  
  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("leaderboard")
    .select("created_at")
    .eq("user_id", user.id)
    .single();

  console.log('data:', data);
  if (error) return NextResponse.json({ playedToday: false });

  const today = new Date().toISOString().split("T")[0];
  const lastPlayed = data?.created_at?.split("T")[0];
  console.log(lastPlayed, today);

  return NextResponse.json({ playedToday: lastPlayed === today });
}
