import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://missing-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-key';

if (supabaseUrl === 'https://missing-url.supabase.co' || supabaseAnonKey === 'missing-key') {
  const msg = '🛑 IKO DAWA: Supabase credentials missing! \n\nPlease create a .env file in the root directory with: \nVITE_SUPABASE_URL=your_url \nVITE_SUPABASE_ANON_KEY=your_key';
  console.error(msg);
  // Optional: show a message on the UI if in dev mode
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    // We don't alert() to avoid annoying users, but we can log it prominently
    console.log('%c' + msg, 'color: white; background: red; padding: 10px; font-weight: bold; border-radius: 5px;');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
