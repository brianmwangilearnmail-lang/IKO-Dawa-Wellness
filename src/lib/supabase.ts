import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://missing-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-key';

if (supabaseUrl === 'https://missing-url.supabase.co' || supabaseAnonKey === 'missing-key') {
  console.error(
    '🛑 CRITICAL: Supabase credentials missing! The app will load, but all data fetching will fail. ' +
    'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your Vercel Environment Variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
