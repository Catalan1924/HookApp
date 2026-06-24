-- Enable pg_cron in Supabase Dashboard → Database → Extensions first
-- Then run:
select cron.schedule(
'delete-expired-stories',
'0 * * * *', -- every hour
$$ delete from stories where expires_at < now() $$
);
select cron.schedule(
'delete-stale-queue',
'*/15 * * * *', -- every 15 minutes
$$ delete from surprise_queue where joined_at < now() - interval '10 minutes' $$
);