// Edge Function: moderate-content
// Content safety checks for posts, bios, and messages.
// Uses a simple keyword blocklist — ready to swap with an
// external moderation API (e.g. Perspective, OpenAI Moderation).

const BLOCKED_PATTERNS = [
  // Hate speech, harassment, explicit content patterns
  /hate\s*speech/i,
  /violence/i,
  // Add more patterns as needed — keep lightweight
];

interface ModerationInput {
  text: string;
  context: "post" | "bio" | "message" | "username";
  user_id: string;
}

Deno.serve(async (req: Request) => {
  try {
    const input: ModerationInput = await req.json();

    if (!input.text) {
      return new Response(
        JSON.stringify({ flagged: false, reason: null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check against blocked patterns
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(input.text)) {
        // Log flagged content
        console.warn(
          `Content flagged: [${input.context}] by user ${input.user_id}`
        );

        return new Response(
          JSON.stringify({
            flagged: true,
            reason: "Content violates community guidelines",
            pattern: pattern.source,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Length checks
    if (input.context === "bio" && input.text.length > 500) {
      return new Response(
        JSON.stringify({
          flagged: true,
          reason: "Bio exceeds 500 character limit",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (input.context === "post" && input.text.length > 100) {
      return new Response(
        JSON.stringify({
          flagged: true,
          reason: "Caption exceeds 100 character limit",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ flagged: false, reason: null }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("moderate-content error:", err);
    // Fail open: if moderation is down, don't block content
    return new Response(
      JSON.stringify({ flagged: false, reason: "moderation_unavailable" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
});
