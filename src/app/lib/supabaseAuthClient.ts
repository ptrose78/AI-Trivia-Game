import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

// Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables");
}

// Function to get Supabase client with Clerk's token for authenticated requests
export async function getSupabaseAuthClient() {
  const authInstance = await auth(); 
  const token = await authInstance.getToken({ template: "supabase" }); // Get the Clerk JWT token
  console.log('token', token);

  if (token) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Clerk token to Supabase headers
        },
      },
    });
  }

  console.log("No token available.");
  return null; // Return null if token is not available
}
