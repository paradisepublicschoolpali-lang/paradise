import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from localStorage first, then fallback to environment variables
export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('pps_supabase_url');
  const localKey = localStorage.getItem('pps_supabase_anon_key');

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const url = localUrl || envUrl;
  const anonKey = localKey || envKey;

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
