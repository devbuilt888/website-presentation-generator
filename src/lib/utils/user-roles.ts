/**
 * User Role Utilities
 * 
 * Functions to check and manage user roles in the application
 */

import { supabase } from '@/lib/supabase/client';

export type UserRole = 'user' | 'admin';

export interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  created_at?: string;
}

/**
 * Get current user's role
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return 'user'; // Default to user role
  }

  return (data.role as UserRole) || 'user';
}

/**
 * Check if current user is admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}

/**
 * Get user with role information
 */
export async function getUserWithRole(userId: string): Promise<UserWithRole | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, full_name, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: (data.role as UserRole) || 'user',
    full_name: data.full_name || undefined,
    created_at: data.created_at,
  };
}

