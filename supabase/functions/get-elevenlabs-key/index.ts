import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Retrieving ELEVENLABS_API_KEY from environment...");
    const api_key = Deno.env.get('ELEVENLABS_API_KEY')
    
    if (!api_key) {
      console.error("ELEVENLABS_API_KEY not found in environment variables");
      throw new Error('ELEVENLABS_API_KEY not found in environment variables')
    }

    console.log("Successfully retrieved ELEVENLABS_API_KEY");
    
    return new Response(
      JSON.stringify({ api_key }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error in get-elevenlabs-key function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})