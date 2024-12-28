import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Get user IDs from request
    const { userIds } = await req.json()

    if (!Array.isArray(userIds)) {
      throw new Error('userIds must be an array')
    }

    // Fetch users with service role
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) throw error

    // Filter and map to only requested users
    const userEmails = users.users
      .filter(user => userIds.includes(user.id))
      .reduce((acc, user) => {
        acc[user.id] = user.email
        return acc
      }, {} as Record<string, string>)

    return new Response(
      JSON.stringify(userEmails),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})