// ---------------------------------------------------------------
// Fill these in from your Supabase project:
// Project Settings → API → Project URL, and → anon public key
// ---------------------------------------------------------------
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
