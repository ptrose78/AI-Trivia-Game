import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; 

export async function POST(req: Request) {
    console.log("Received webhook request");

    try {
        const body = await req.json();
        const { type, data } = body;

        if (!data) {
            console.error("No data in webhook payload");
            return NextResponse.json({ error: "No data received" }, { status: 400 });
        }

        if (type !== "user.created") {
            return NextResponse.json({ error: "Invalid event" }, { status: 400 });
        }

        const email = data.email_addresses?.[0]?.email_address;
        const clerkUserId = data?.id;
        console.log(email, clerkUserId)

        if (!email || !clerkUserId) {
            return NextResponse.json({ error: "Missing required data" }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from("users")
            .insert([{ id: uuidv4(), clerk_user_id: clerkUserId, email }]);

        if (error) {
            return NextResponse.json({ error: "Failed to upsert user" }, { status: 500 });
        }

        return NextResponse.json({ message: "User upserted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }
}
