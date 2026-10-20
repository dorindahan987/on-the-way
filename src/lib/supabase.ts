import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(url, key, {
  auth: {
    detectSessionInUrl: false, // we handle the code manually in /auth/callback
    flowType: "pkce",
  },
});
export const supabaseReady = !!(url && key);
