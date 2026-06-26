// Edge Function: surprise-pairing
// Called periodically or when a user joins the queue.
// Pairs two waiting users and creates a surprise session.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req: Request) => {
  try {
    const { user_id } = await req.json();

    // Ensure the requesting user is still in the queue
    const { data: queueEntry } = await supabase
      .from("surprise_queue")
      .select("user_id, status")
      .eq("user_id", user_id)
      .single();

    if (!queueEntry) {
      return new Response(
        JSON.stringify({ paired: false, reason: "not_in_queue" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find another waiting user (not self, not blocked, not already in a thread)
    const { data: candidates } = await supabase
      .from("surprise_queue")
      .select("user_id, joined_at")
      .eq("status", "waiting")
      .neq("user_id", user_id)
      .order("joined_at", { ascending: true })
      .limit(5);

    if (!candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({ paired: false, reason: "no_candidates" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Filter out blocked users and existing threads
    for (const candidate of candidates as { user_id: string }[]) {
      const candidateId = candidate.user_id;

      // Check not blocked
      const { data: notBlocked } = await supabase.rpc("not_blocked", {
        user_a: user_id,
        user_b: candidateId,
      });

      if (!notBlocked) continue;

      // Check no existing thread
      const { data: existingThread } = await supabase
        .from("threads")
        .select("id")
        .or(
          `and(user_a.eq.${user_id},user_b.eq.${candidateId}),and(user_a.eq.${candidateId},user_b.eq.${user_id})`
        )
        .maybeSingle();

      if (existingThread) continue;

      // Found a match! Create session
      const signalingChannel = `surprise-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const { data: session, error: sessionErr } = await supabase
        .from("surprise_sessions")
        .insert({
          user_a: user_id,
          user_b: candidateId,
          signaling_channel: signalingChannel,
        })
        .select()
        .single();

      if (sessionErr) {
        console.error("Failed to create session:", sessionErr);
        continue;
      }

      // Remove both users from queue
      await supabase
        .from("surprise_queue")
        .delete()
        .in("user_id", [user_id, candidateId]);

      // Notify both users
      await supabase.from("notifications").insert([
        {
          user_id,
          type: "new_match",
          payload: {
            session_id: (session as any).id,
            channel: signalingChannel,
            matched_with: candidateId,
          },
        },
        {
          user_id: candidateId,
          type: "new_match",
          payload: {
            session_id: (session as any).id,
            channel: signalingChannel,
            matched_with: user_id,
          },
        },
      ]);

      return new Response(
        JSON.stringify({
          paired: true,
          session_id: (session as any).id,
          signaling_channel: signalingChannel,
          partner_id: candidateId,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ paired: false, reason: "all_candidates_filtered" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("surprise-pairing error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
