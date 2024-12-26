import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wivbfxjqydkozyvlabil.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdmJmeGpxeWRrb3p5dmxhYmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0NzMzMzAsImV4cCI6MjAxOTA0OTMzMH0.qYnxbLkd5qQvMGzH3J_zrUGEhRKWVz_RrNQcAF-4WXs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});