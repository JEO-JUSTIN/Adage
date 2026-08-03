import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qeisoeidzlwgwhbyntjj.supabase.co";
const supabaseAnonKey = "sb_publishable__4_ul83m_Qv9tJJBCqT-rw_33uOLB6u";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
