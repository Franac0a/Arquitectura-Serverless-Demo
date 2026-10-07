import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xpafciusvztibvscgsnn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwYWZjaXVzdnp0aWJ2c2Nnc25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTU0MzQsImV4cCI6MjEwNjg5MTQzNH0.ww2J-GwgRvmqEGIWecrQ3FyWPvc4CzPKqhhII9c6_1E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
