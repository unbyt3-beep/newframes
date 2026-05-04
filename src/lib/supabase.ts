import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://upzictdpfybsbbezcdhf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwemljdGRwZnlic2JiZXpjZGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTA0OTYsImV4cCI6MjA5MzAyNjQ5Nn0.kqKVqWVxbX27pc3HfCBaQEyj-F3Mla80a6prhJYjfOA"
);