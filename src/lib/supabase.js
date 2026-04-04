import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create an authenticated Supabase client with Clerk JWT token
 * @param {string} token - Clerk JWT token
 * @returns {Object} Supabase client with auth token
 */
export function createAuthenticatedClient(token) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

/**
 * Helper to get Clerk token and create authenticated Supabase client
 * @param {Function} getToken - Clerk's getToken function
 * @returns {Promise<Object>} Authenticated Supabase client
 */
export async function getAuthenticatedClient(getToken) {
  try {
    // Get Clerk JWT token with 'supabase' template
    const token = await getToken({ template: 'supabase' });

    if (!token) {
      console.warn('No Clerk token available');
      return supabase; // Fallback to unauthenticated client
    }

    return createAuthenticatedClient(token);
  } catch (error) {
    console.error('Error getting authenticated client:', error);
    return supabase; // Fallback to unauthenticated client
  }
}

/**
 * Test Supabase connection
 * Returns true if connection is successful
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }

    console.log('✓ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return false;
  }
}
