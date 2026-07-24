// Edge Function: cleanup-expired
// Runs on a cron schedule (via Supabase Cron) to clean up:
// - Expired stories (past 24h)
// - Stale surprise queue entries (inactive > 10 min)
// - Old surprise sessions (ended > 1h ago)
// - Orphan notifications (older than 30 days)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (_req: Request) => {
  const results: Record<string, number> = {};

  try {
    // 1. Delete expired stories
    const { count: storiesDeleted } = await supabase
      .from("stories")
      .delete({ count: "exact" })
      .lt("expires_at", new Date().toISOString());

    results.stories_deleted = storiesDeleted || 0;

    // 2. Remove stale surprise queue entries (> 10 min old)
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count: queueCleaned } = await supabase
      .from("surprise_queue")
      .delete({ count: "exact" })
      .lt("joined_at", tenMinAgo);

    results.queue_cleaned = queueCleaned || 0;

    // 3. Clean up ended surprise sessions older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: sessionsCleaned } = await supabase
      .from("surprise_sessions")
      .delete({ count: "exact" })
      .not("ended_at", "is", null)
      .lt("ended_at", oneHourAgo);

    results.sessions_cleaned = sessionsCleaned || 0;

    // 4. Archive old read notifications (> 30 days)
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();
    const { count: notificationsCleaned } = await supabase
      .from("notifications")
      .delete({ count: "exact" })
      .not("read_at", "is", null)
      .lt("created_at", thirtyDaysAgo);

    results.notifications_cleaned = notificationsCleaned || 0;

    // Log the cleanup event
    await supabase.from("events").insert({
      event_name: "cleanup_executed",
      metadata: results as unknown as Record<string, unknown>,
    });

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("cleanup-expired error:", err);
    return new Response(
      JSON.stringify({ error: String(err), partial_results: results }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
