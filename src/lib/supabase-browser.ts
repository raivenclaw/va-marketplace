import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// For client-side, we use a limited client that goes through server actions
// Since we don't have the anon key, all mutations go through server actions
export function createBrowserSupabase(accessToken?: string) {
  // We use the service role key only on the server side
  // Client side will use server actions for all data operations
  return createClient(supabaseUrl, "placeholder", {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}
