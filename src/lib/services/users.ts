/**
 * User Service Functions
 * 
 * Handles database operations for user management (admin only)
 */

import { supabase } from '@/lib/supabase/client';
import { UserWithRole } from '@/lib/utils/user-roles';

/**
 * Get all users (admin only)
 * RLS policies will enforce admin-only access at database level
 */
export async function getAllUsers(): Promise<UserWithRole[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, full_name, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(user => ({
    id: user.id,
    email: user.email,
    role: (user.role as 'user' | 'admin') || 'user',
    full_name: user.full_name || undefined,
    created_at: user.created_at,
  }));
}

/**
 * Update user role (admin only)
 * RLS policies will enforce admin-only access at database level
 */
export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user by ID (admin only)
 */
export async function getUserById(userId: string): Promise<UserWithRole | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, full_name, created_at')
    .eq('id', userId)
    .single();

  if (error) return null;
  
  return {
    id: data.id,
    email: data.email,
    role: (data.role as 'user' | 'admin') || 'user',
    full_name: data.full_name || undefined,
    created_at: data.created_at,
  };
}

