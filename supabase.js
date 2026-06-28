const SUPABASE_URL = "https://nwdzkfssqprsoifnpesh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53ZHprZnNzcXByc29pZm5wZXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMTc1NzcsImV4cCI6MjA5NzU5MzU3N30.L1y9frTQASvQC0vLcRvaggpZxZl8zMfGvRSzYAzcohE";

console.log("window.supabase:", window.supabase);

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("supabase client:", supabase);
console.log("supabase.from:", supabase.from);