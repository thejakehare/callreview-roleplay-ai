import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wivbfxjqydkozyvlabil.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdmJmeGpxeWRrb3p5dmxhYmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNTgyNTEsImV4cCI6MjA1MDYzNDI1MX0.x4Urg5GXrHid96CK8z1qy6GsMENQCpfJynP0_x4WQ3A";

export const supabase = createClient(supabaseUrl, supabaseKey);