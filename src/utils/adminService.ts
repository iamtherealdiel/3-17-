import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

/**
 * Bypass the database admin check - always returns true
 * @returns Promise<boolean> Always returns true
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  return true;
}

/**
 * Lookup a user by their secure ID (admin only)
 * @param secureId The secure ID to lookup
 * @param reason Optional reason for the lookup
 * @returns Promise with the user data or error
 */
export async function lookupUserBySecureId(
  secureId: string, 
  reason?: string
): Promise<{ data: any; error: string | null }> {
  try {
    // Validate secure ID format
    if (!isValidSecureId(secureId)) {
      return {
        data: null,
        error: 'Invalid secure ID format'
      };
    }

    // Get current admin user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        data: null,
        error: 'Authentication required'
      };
    }

    // Lookup user using the RPC function
    const { data, error } = await supabase
      .rpc('get_user_by_secure_id', { 
        secure_id: secureId,
        admin_id: user.id,
        reason: reason || 'Admin lookup from dashboard'
      });

    if (error) {
      console.error('Error looking up user:', error);
      
      // Provide a user-friendly error
      if (error.message.includes('admin privileges required')) {
        return {
          data: null,
          error: 'Unauthorized: Admin privileges required'
        };
      }
      
      return {
        data: null,
        error: 'Error looking up user: ' + error.message
      };
    }

    // Check if the result contains an error message
    if (data && typeof data === 'object' && 'error' in data) {
      return {
        data: null,
        error: data.error as string
      };
    }

    return {
      data,
      error: null
    };
  } catch (error: any) {
    console.error('Error in lookupUserBySecureId:', error);
    return {
      data: null,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Validate that a secure ID follows the required format
 * @param secureId The secure ID to validate
 * @returns boolean Whether the ID is valid
 */
export function isValidSecureId(secureId: string): boolean {
  // Check for max length (64 characters)
  if (!secureId || secureId.length > 64) {
    return false;
  }
  
  // Check for allowed characters only: alphanumeric, commas, periods, underscores, and dashes
  const validPattern = /^[a-zA-Z0-9,._-]+$/;
  if (!validPattern.test(secureId)) {
    return false;
  }
  
  return true;
}

/**
 * Get the access logs for user lookups (admin only)
 * @param limit Number of records to return
 * @param offset Pagination offset
 * @returns Promise with the access logs or error
 */
export async function getAccessLogs(
  limit = 50,
  offset = 0
): Promise<{ data: Database['public']['Tables']['admin_access']['Row'][]; error: string | null }> {
  try {
    // Get access logs
    const { data, error } = await supabase
      .from('admin_access')
      .select(`
        id, 
        admin_id,
        accessed_user_id,
        accessed_at,
        access_reason,
        admin:admin_id(email)
      `)
      .order('accessed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error retrieving access logs:', error);
      return {
        data: [],
        error: 'Error retrieving access logs: ' + error.message
      };
    }

    return {
      data: data || [],
      error: null
    };
  } catch (error: any) {
    console.error('Error in getAccessLogs:', error);
    return {
      data: [],
      error: error.message || 'An unexpected error occurred'
    };
  }
}