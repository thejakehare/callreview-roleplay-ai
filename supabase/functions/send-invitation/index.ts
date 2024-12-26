import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  invitationId: string;
  accountName: string;
  inviteeEmail: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    const { invitationId, accountName, inviteeEmail }: InvitationRequest = await req.json();

    // Verify the invitation exists and is pending
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select("*")
      .eq("id", invitationId)
      .eq("status", "pending")
      .single();

    if (invitationError || !invitation) {
      console.error("Error fetching invitation:", invitationError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired invitation" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate the invitation acceptance URL
    const acceptUrl = `${req.headers.get("origin")}/accept-invitation?id=${invitationId}`;

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Jake <no-reply@updates.roleplaybot.com>",
        to: [inviteeEmail],
        subject: `You've been invited to join ${accountName}`,
        html: `
          <h2>You've been invited!</h2>
          <p>You've been invited to join ${accountName} on Lovable.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${acceptUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Accept Invitation</a>
          <p>This invitation will expire in 7 days.</p>
          <p>If you don't want to accept this invitation, you can ignore this email.</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send invitation email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-invitation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});