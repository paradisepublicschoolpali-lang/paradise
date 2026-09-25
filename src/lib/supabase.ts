import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Pre-configured manual Supabase credentials
export const DEFAULT_SUPABASE_URL = 'https://fxkyhyedecrtxwawcbaz.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4a3loeWVkZWNydHh3YXdjYmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MzU1NjMsImV4cCI6MjEwMzQxMTU2M30.3vc5tlK-qXRgN_IwPUgROjGIh5DKm4AFzuMMez4lwF8';

// Retrieve credentials: environment variables first, then localStorage, then default manual credentials
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('pps_supabase_url');
  const localKey = localStorage.getItem('pps_supabase_anon_key');

  const url = envUrl || localUrl || DEFAULT_SUPABASE_URL;
  const anonKey = envKey || localKey || DEFAULT_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    anonKey.length > 20
  );

  return { url, anonKey, isConfigured };
};

export const setSupabaseCredentials = (url: string, anonKey: string) => {
  localStorage.setItem('pps_supabase_url', url.trim());
  localStorage.setItem('pps_supabase_anon_key', anonKey.trim());
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('pps_supabase_url');
  localStorage.removeItem('pps_supabase_anon_key');
};

const initialConfig = getSupabaseConfig();

export let isSupabaseConfigured = initialConfig.isConfigured;

export let supabase: SupabaseClient = createClient(
  initialConfig.url || 'https://placeholder.supabase.co',
  initialConfig.anonKey || 'placeholder-key'
);

export const reinitializeSupabase = () => {
  const config = getSupabaseConfig();
  isSupabaseConfigured = config.isConfigured;
  supabase = createClient(
    config.url || 'https://placeholder.supabase.co',
    config.anonKey || 'placeholder-key'
  );
  return { isConfigured: isSupabaseConfigured, client: supabase };
};

// Test live Supabase connection
export const testSupabaseConnection = async (testUrl?: string, testKey?: string): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    const url = testUrl || getSupabaseConfig().url;
    const key = testKey || getSupabaseConfig().anonKey;

    if (!url || !key || !url.startsWith('https://')) {
      return {
        success: false,
        message: 'Invalid Supabase URL or Anon Key provided. URL must start with https://'
      };
    }

    const testClient = createClient(url, key);
    
    // Quick probe query to check API accessibility
    const { data, error } = await testClient.from('notices').select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist yet, it still proves credentials and network connection to Supabase are valid!
      if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('not found')) {
        return {
          success: true,
          message: 'Connected to Supabase project! (Tables not yet initialized - run supabase_schema.sql)',
          details: error.message
        };
      }
      return {
        success: false,
        message: `Supabase Error (${error.code || 'API'}): ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Successfully connected and verified live Supabase database!',
      details: data
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err?.message || 'Network error'}`
    };
  }
};
