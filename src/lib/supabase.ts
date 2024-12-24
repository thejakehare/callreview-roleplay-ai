import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wivbfxjqydkozyvlabil.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdmJmeGpxeWRrb3p5dmxhYmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0NzAsImV4cCI6MjAyNTM5ODQ3MH0.Aw5dHGHZSQvbEBQHtHvqZhPTQQxNn_FPvNnTI5jUELY";

export const supabase = createClient(supabaseUrl, supabaseKey);