import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wivbfxjqydkozyvlabil.supabase.co';
const supabaseAnonKey = 'your-anon-key'; // This should be your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This ensures authentication works on both localhost and your custom domain
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});