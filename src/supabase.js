import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qeisoeidzlwgwhbyntjj.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable__4_ul83m_Qv9tJJBCqT-rw_33uOLB6u";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

