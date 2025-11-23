/**
 * Presentation Service Functions
 * 
 * Handles all database operations for presentations
 */

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { PresentationInstance } from '@/types/presentation';

type PresentationRow = Database['public']['Tables']['presentations']['Row'];
type PresentationInsert = Database['public']['Tables']['presentations']['Insert'];
type PresentationUpdate = Database['public']['Tables']['presentations']['Update'];

/**
 * Get all presentations accessible by the current user
 */
export async function getUserPresentations(userId: string) {
  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .or(`created_by.eq.${userId},is_public.eq.true`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get all presentations (admin only) or user's presentations
 * RLS policies will enforce admin-only access at database level
 */
export async function getAllPresentations(userId: string, isAdmin: boolean = false) {
  if (isAdmin) {
    // Admins can see all presentations via RLS policy
    const { data, error } = await supabase
      .from('presentations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  // Regular users see only their presentations
  return getUserPresentations(userId);
}

/**
 * Get a presentation by ID
 */
export async function getPresentation(presentationId: string) {
  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', presentationId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new presentation
 */
export async function createPresentation(
  presentation: PresentationInsert
): Promise<PresentationRow> {
  const { data, error } = await supabase
    .from('presentations')
    .insert(presentation)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a presentation
 */
export async function updatePresentation(
  presentationId: string,
  updates: PresentationUpdate
): Promise<PresentationRow> {
  const { data, error } = await supabase
    .from('presentations')
    .update(updates)
    .eq('id', presentationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a presentation
 */
export async function deletePresentation(presentationId: string) {
  const { error } = await supabase
    .from('presentations')
    .delete()
    .eq('id', presentationId);

  if (error) throw error;
}

/**
 * Grant access to a presentation
 */
export async function grantPresentationAccess(
  presentationId: string,
  userId: string,
  canEdit: boolean = false
) {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_presentation_access')
    .insert({
      user_id: userId,
      presentation_id: presentationId,
      granted_by: currentUser.user.id,
      can_edit: canEdit,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

