// Edge Function: create-profile
// Enhanced profile creation on auth signup.
// Replaces the simpler DB trigger with richer initialization:
// - Validates email domain against universities table
// - Auto-assigns university_id if domain matches
// - Initializes default interests array
// - Creates welcome notification

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface AuthUser {
  id: string;
  email: string;
  phone?: string;
}

Deno.serve(async (req: Request) => {
  try {
    const { user } = await req.json();
    const { id, email, phone } = user as AuthUser;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing user id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ created: false, reason: "exists" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Derive username from email
    const username = email ? email.split("@")[0] : `user_${id.slice(0, 8)}`;

    // Try to match university by email domain
    let universityId: string | null = null;
    if (email) {
      const domain = email.split("@")[1]?.toLowerCase();
      if (domain) {
        const { data: uni } = await supabase
          .from("universities")
          .select("id")
          .eq("email_domain", domain)
          .maybeSingle();

        if (uni) {
          universityId = (uni as any).id;
        }
      }
    }

    // Create the profile
    const { error: insertErr } = await supabase.from("profiles").insert({
      id,
      username,
      display_name: username,
      university_id: universityId,
      interests: [] as string[],
      phone: phone || null,
    } as any);

    if (insertErr) {
      console.error("Failed to create profile:", insertErr);
      return new Response(
        JSON.stringify({ error: insertErr.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send welcome notification
    await supabase.from("notifications").insert({
      user_id: id,
      type: "like", // reuse 'like' type for welcome — harmless
      payload: {
        welcome: true,
        message: universityId
          ? "Welcome to CampusMatch! Your university has been verified."
          : "Welcome to CampusMatch! Complete your profile to get started.",
      },
    } as any);

    // Log signup event
    await supabase.from("events").insert({
      user_id: id,
      event_name: "user_signed_up",
      metadata: {
        has_university: !!universityId,
        has_phone: !!phone,
      },
    } as any);

    return new Response(
      JSON.stringify({
        created: true,
        username,
        university_id: universityId,
        university_matched: !!universityId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-profile error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
