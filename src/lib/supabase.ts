import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL ?? "https://zxrboenwwbrmkwksswji.supabase.co";
const supabasePublishableKey =
  import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_hNZjQUcZvVs8LhW3zNH79A_8NvfqKXw";

let browserClient:
  | ReturnType<typeof createClient>
  | undefined;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

export { supabasePublishableKey, supabaseUrl };
