
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

export async function POST(req: Request) {
    
    try {
        const body = await req.json();
        const { event, data} = body;

        if (event !== "user.created" && event !== "user.updated") {
            return NextResponse.json({ error: "Invalid event" }, { status: 400 });
        }

        const email = data.email_addresses?.[0]?.email_address;
        const clerkUserId = data?.id;

        if (!email || !clerkUserId) {
            return NextResponse.json({error: "Missing required data"}, {status: 400});
        }

        const { error } = await supabase
        .from("users")
        .insert([{ id: uuidv4(), clerk_user_id: clerkUserId, email }]);

        if (error) {
            return NextResponse.json({error: "Failed to upsert user"}, {status: 500});
        }

        return NextResponse.json({message: "User upserted successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Invalid JSON data"}, {status: 400});
    }

}
