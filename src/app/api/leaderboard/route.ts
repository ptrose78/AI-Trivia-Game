import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSupabaseAuthClient } from "@/app/lib/supabaseAuthClient";

export async function POST(req: Request) {
    console.log("Received request to submit score");
    const { name, score } = await req.json();

    const { userId } = await auth(); // Get Clerk's user ID
    console.log(userId);
    
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    
    const { data: user, error } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("clerk_user_id", userId)
        .single();


    if (error || !user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const supabase = await getSupabaseAuthClient();
    
    if (!supabase) {
        return new Response(JSON.stringify({ error: "Failed to initialize Supabase client" }), { status: 500 });
    }
    // Insert the user's score into the leaderboard table
    console.log('user.id:', user.id);  // Should be a valid UUID
    const { data, error: insertError } = await supabase
        .from("leaderboard")
        .insert([{ id: uuidv4(), user_id: user.id, name: name, score: score }]);
       
    console.log('insertError', insertError);
    console.log('data', data);

    if (insertError) {
        return new Response(JSON.stringify({ error: "Failed to insert score" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Score submitted successfully" }), { status: 200 });
}
