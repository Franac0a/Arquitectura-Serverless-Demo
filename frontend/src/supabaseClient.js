import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cotfixbrpsdmgzpjaqll.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvdGZpeGJycHNkbWd6cGphcWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjkzMzQsImV4cCI6MjEwNjkwNTMzNH0.hOt0WlaS_UYGTbdRqBk3ABL1JKP9D8cVAw57aJEBJ6o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
