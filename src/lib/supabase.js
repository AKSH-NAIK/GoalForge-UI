import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rtggjfzpcvwndbiflyfv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Z2dqZnpwY3Z3bmRiaWZseWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMjk3MDgsImV4cCI6MjA5MTgwNTcwOH0.zhdAdkw9vlEF5r4OLz58M-9NJ7pEVZl7TBma85IjRJw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);