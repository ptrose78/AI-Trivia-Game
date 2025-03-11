import { createClient } from "@supabase/supabase-js";

// Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase URL or Service Role Key in environment variables");
}

// Create an admin Supabase client (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
