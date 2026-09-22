const createClient = require("@supabase/supabase-js");

export default supabaseConfig = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

