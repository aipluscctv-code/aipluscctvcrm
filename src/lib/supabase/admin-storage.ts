import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for server-only background jobs (e.g. the
 * photo-cleanup cron) that run with no user session to piggyback on.
 * Never import this into anything reachable from a client component.
 */
export function createAdminStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
