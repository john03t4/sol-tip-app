import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// Note: Using anon key is safe for public reads/writes when RLS policies are configured correctly
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
