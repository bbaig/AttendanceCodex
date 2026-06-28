const SUPABASE_URL = "https://nwdzkfssqprsoifnpesh.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";

console.log("window.supabase:", window.supabase);

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("supabase client:", supabase);
console.log("supabase.from:", supabase.from);