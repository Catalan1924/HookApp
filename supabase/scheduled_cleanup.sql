-- ── Scheduled Cleanup ───────────────────────────────────────────
-- Two options:
--   1. pg_cron (PostgreSQL extension) — runs SQL directly in the DB
--   2. Supabase Cron (Edge Function trigger) — calls the cleanup-expired edge function
--
-- Choose ONE. Both do the same cleanup but Option 2 is recommended
-- for Supabase-hosted projects since it also logs to the events table.
-- ─────────────────────────────────────────────────────────────────

-- ── Option 1: pg_cron (enable pg_cron in Dashboard → Database → Extensions first) ──

-- select cron.schedule(
--   'delete-expired-stories',
--   '0 * * * *',  -- every hour
--   $$ delete from stories where expires_at < now() $$
-- );

-- select cron.schedule(
--   'delete-stale-queue',
--   '*/15 * * * *',  -- every 15 minutes
--   $$ delete from surprise_queue where joined_at < now() - interval '10 minutes' $$
-- );

-- select cron.schedule(
--   'delete-old-notifications',
--   '0 4 * * *',  -- daily at 4am
--   $$ delete from notifications where read_at is not null and created_at < now() - interval '30 days' $$
-- );


-- ── Option 2: Supabase Cron (call edge function on schedule) ──
-- In Supabase Dashboard → Edge Functions → cleanup-expired → Cron:
--   Schedule: */15 * * * *  (every 15 minutes)
--   Method:   POST
--   Body:     {}

-- Or deploy via CLI:
--   supabase functions deploy cleanup-expired
--   supabase functions cron schedule cleanup-expired --schedule "*/15 * * * *"


-- ── Manual cleanup (run anytime) ──
-- Just calls the edge function manually
-- select net.http_post(
--   url := 'https://<project-ref>.supabase.co/functions/v1/cleanup-expired',
--   headers := '{"Authorization": "Bearer <service-role-key>"}'::jsonb
-- );
