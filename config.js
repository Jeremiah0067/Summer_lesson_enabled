// ---------------------------------------------------------------
// Fill these in from your Supabase project:
// Project Settings → API → Project URL, and → anon public key
// ---------------------------------------------------------------
const SUPABASE_URL = "https://qnvzolnwhenpntqfeciu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFudnpvbG53aGVucG50cWZlY2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzODQ4NDQsImV4cCI6MjEwMTk2MDg0NH0.cP6YO5KeJ2l5392IVkq80dR4TWSYzfPJYomKwSugwqA";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
