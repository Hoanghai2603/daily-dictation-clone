import { createBrowserClient } from '@supabase/ssr';

// Define environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase environment variables');
}

export function createClient() {
    return createBrowserClient(
        supabaseUrl || '',
        supabaseKey || ''
    );
}
