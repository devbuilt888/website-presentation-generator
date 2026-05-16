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
    .select('id, email, role, full_name, phone, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((user) => ({
    id: user.id,
    email: user.email,
    role: (user.role as 'user' | 'admin') || 'user',
    full_name: user.full_name || undefined,
    phone: user.phone || undefined,
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
    .select('id, email, role, full_name, phone, created_at')
    .eq('id', userId)
    .single();

  if (error) return null;

  return {
    id: data.id,
    email: data.email,
    role: (data.role as 'user' | 'admin') || 'user',
    full_name: data.full_name || undefined,
    phone: data.phone || undefined,
    created_at: data.created_at,
  };
}

/**
 * Get the signed-in user's phone (for presentation contact mapping).
 */
export async function getUserPhone(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('phone')
    .eq('id', userId)
    .single();

  if (error || !data?.phone) return null;
  return data.phone.trim() || null;
}

export type OwnProfile = {
  email: string;
  full_name: string | null;
  phone: string | null;
};

/**
 * Load the signed-in user's row (RLS: own profile only).
 */
export async function getOwnProfile(userId: string): Promise<OwnProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('email, full_name, phone')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return {
    email: data.email,
    full_name: data.full_name,
    phone: data.phone,
  };
}

/**
 * Update name and phone for the current user (RLS enforces auth.uid() = id).
 */
export async function updateOwnProfile(
  userId: string,
  fields: { full_name?: string | null; phone?: string | null }
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
}
