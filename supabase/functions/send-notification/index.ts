// Edge Function: send-notification
// Triggered by database webhooks to create notification records
// when messages, likes, or matches occur.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface WebhookPayload {
  type: "INSERT" | "UPDATE";
  table: string;
  record: Record<string, unknown>;
  old_record?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  try {
    const payload: WebhookPayload = await req.json();

    switch (payload.table) {
      case "messages": {
        if (payload.type === "INSERT") {
          await handleNewMessage(payload.record);
        }
        break;
      }
      case "profile_likes": {
        if (payload.type === "INSERT") {
          await handleNewProfileLike(payload.record);
        }
        break;
      }
      case "posts_like": {
        if (payload.type === "INSERT") {
          await handleNewPostLike(payload.record);
        }
        break;
      }
      case "threads": {
        if (payload.type === "UPDATE" && payload.record.status === "matched") {
          await handleNewMatch(payload.record);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-notification error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

async function handleNewMessage(record: Record<string, unknown>) {
  const { thread_id, sender_id, content } = record as {
    thread_id: string;
    sender_id: string;
    content: string;
  };

  // Find the other participant in the thread
  const { data: thread } = await supabase
    .from("threads")
    .select("user_a, user_b")
    .eq("id", thread_id)
    .single();

  if (!thread) return;

  const recipientId =
    thread.user_a === sender_id ? thread.user_b : thread.user_a;

  // Don't notify if they blocked each other
  const { data: blocked } = await supabase.rpc("not_blocked", {
    user_a: sender_id,
    user_b: recipientId,
  });

  if (!blocked) return;

  await supabase.from("notifications").insert({
    user_id: recipientId,
    type: "new_message",
    payload: {
      thread_id,
      sender_id,
      preview:
        (content as string).substring(0, 80) +
        ((content as string).length > 80 ? "…" : ""),
    },
  });
}

async function handleNewProfileLike(record: Record<string, unknown>) {
  const { liker_id, liked_id } = record as {
    liker_id: string;
    liked_id: string;
  };

  // Check if this creates a mutual like (both liked each other)
  const { data: mutual } = await supabase
    .from("profile_likes")
    .select("liker_id")
    .eq("liker_id", liked_id)
    .eq("liked_id", liker_id)
    .maybeSingle();

  if (mutual) {
    // Mutual like! Create a matched thread if one doesn't exist
    const { data: existing } = await supabase
      .from("threads")
      .select("id, status")
      .or(
        `and(user_a.eq.${liker_id},user_b.eq.${liked_id}),and(user_a.eq.${liked_id},user_b.eq.${liker_id})`
      )
      .maybeSingle();

    if (!existing) {
      const { data: thread } = await supabase
        .from("threads")
        .insert({
          user_a: liker_id,
          user_b: liked_id,
          status: "matched",
          message_count: 0,
        })
        .select()
        .single();

      if (thread) {
        // Notify both users
        await supabase.from("notifications").insert([
          {
            user_id: liked_id,
            type: "new_match",
            payload: { thread_id: (thread as any).id, matched_with: liker_id },
          },
          {
            user_id: liker_id,
            type: "new_match",
            payload: { thread_id: (thread as any).id, matched_with: liked_id },
          },
        ]);
      }
    } else if (existing.status !== "matched") {
      // Upgrade existing pending thread to matched
      await supabase
        .from("threads")
        .update({ status: "matched" })
        .eq("id", existing.id);
    }
  } else {
    // Just a regular like notification
    await supabase.from("notifications").insert({
      user_id: liked_id,
      type: "profile_like",
      payload: { liker_id },
    });
  }
}

async function handleNewPostLike(record: Record<string, unknown>) {
  const { post_id, user_id: liker_id } = record as {
    post_id: string;
    user_id: string;
  };

  // Get post owner
  const { data: post } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", post_id)
    .single();

  if (!post || post.user_id === liker_id) return;

  await supabase.from("notifications").insert({
    user_id: post.user_id,
    type: "like",
    payload: { post_id, liker_id },
  });
}

async function handleNewMatch(record: Record<string, unknown>) {
  const { id: thread_id, user_a, user_b } = record as {
    id: string;
    user_a: string;
    user_b: string;
  };

  await supabase.from("notifications").insert([
    {
      user_id: user_a,
      type: "new_match",
      payload: { thread_id, matched_with: user_b },
    },
    {
      user_id: user_b,
      type: "new_match",
      payload: { thread_id, matched_with: user_a },
    },
  ]);
}
