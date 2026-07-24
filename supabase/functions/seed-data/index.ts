// Edge Function: seed-data
// Seeds the universities table with Kenyan campus universities.
// Run once after initial deployment.
// Call with: POST /functions/v1/seed-data
// Headers: Authorization: Bearer <service-role-key>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const UNIVERSITIES = [
  { name: "University of Nairobi", email_domain: "uonbi.ac.ke", badge_label: "UoN" },
  { name: "Kenyatta University", email_domain: "ku.ac.ke", badge_label: "KU" },
  { name: "Strathmore University", email_domain: "strathmore.edu", badge_label: "Strathmore" },
  { name: "United States International University Africa", email_domain: "usiu.ac.ke", badge_label: "USIU" },
  { name: "Jomo Kenyatta University of Agriculture and Technology", email_domain: "jkuat.ac.ke", badge_label: "JKUAT" },
  { name: "Moi University", email_domain: "mu.ac.ke", badge_label: "Moi" },
  { name: "Daystar University", email_domain: "daystar.ac.ke", badge_label: "Daystar" },
  { name: "Mount Kenya University", email_domain: "mku.ac.ke", badge_label: "MKU" },
];

Deno.serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Use POST method" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  const results: { name: string; action: "created" | "exists" | "error"; id?: string }[] = [];

  try {
    for (const uni of UNIVERSITIES) {
      // Check if university already exists
      const { data: existing } = await supabase
        .from("universities")
        .select("id")
        .eq("email_domain", uni.email_domain)
        .maybeSingle();

      if (existing) {
        results.push({ name: uni.name, action: "exists", id: (existing as any).id });
        continue;
      }

      const { data: created, error } = await supabase
        .from("universities")
        .insert(uni)
        .select("id")
        .single();

      if (error) {
        results.push({ name: uni.name, action: "error" });
      } else {
        results.push({ name: uni.name, action: "created", id: (created as any).id });
      }
    }

    const summary = {
      total: UNIVERSITIES.length,
      created: results.filter((r) => r.action === "created").length,
      existed: results.filter((r) => r.action === "exists").length,
      errors: results.filter((r) => r.action === "error").length,
      results,
    };

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("seed-data error:", err);
    return new Response(
      JSON.stringify({ error: String(err), partial: results }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
