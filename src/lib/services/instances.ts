/**
 * Presentation Instance Service Functions
 * 
 * Handles database operations for customized presentation instances
 */

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { PresentationInstance, SimpleCustomization } from '@/types/presentation';
import { generateShareToken } from '@/lib/utils/token';

type InstanceRow = Database['public']['Tables']['presentation_instances']['Row'];
type InstanceInsert = Database['public']['Tables']['presentation_instances']['Insert'];
type InstanceUpdate = Database['public']['Tables']['presentation_instances']['Update'];

/**
 * Create a new presentation instance with a unique share token
 */
export async function createInstance(
  instance: InstanceInsert
): Promise<InstanceRow> {
  // Generate unique token
  let shareToken = generateShareToken();
  let attempts = 0;
  const maxAttempts = 10;

  // Ensure token is unique
  while (attempts < maxAttempts) {
    const { data: existing } = await supabase
      .from('presentation_instances')
      .select('id')
      .eq('share_token', shareToken)
      .single();

    if (!existing) {
      break; // Token is unique
    }

    shareToken = generateShareToken();
    attempts++;
  }

  const { data, error } = await supabase
    .from('presentation_instances')
    .insert({
      ...instance,
      share_token: shareToken,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get instance by share token (for public viewing)
 */
export async function getInstanceByToken(shareToken: string) {
  const { data, error } = await supabase
    .from('presentation_instances')
    .select('*')
    .eq('share_token', shareToken)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all instances for a user
 */
export async function getUserInstances(userId: string) {
  const { data, error } = await supabase
    .from('presentation_instances')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get an instance by ID
 */
export async function getInstance(instanceId: string) {
  const { data, error } = await supabase
    .from('presentation_instances')
    .select('*')
    .eq('id', instanceId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an instance
 */
export async function updateInstance(
  instanceId: string,
  updates: InstanceUpdate
): Promise<InstanceRow> {
  const { data, error } = await supabase
    .from('presentation_instances')
    .update(updates)
    .eq('id', instanceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mark instance as sent
 */
export async function markInstanceAsSent(instanceId: string) {
  return updateInstance(instanceId, {
    status: 'sent',
    sent_at: new Date().toISOString(),
  });
}

/**
 * Mark instance as viewed
 */
export async function markInstanceAsViewed(instanceId: string) {
  return updateInstance(instanceId, {
    status: 'viewed',
    viewed_at: new Date().toISOString(),
  });
}

/**
 * Mark instance as completed
 */
export async function markInstanceAsCompleted(instanceId: string) {
  return updateInstance(instanceId, {
    status: 'completed',
    completed_at: new Date().toISOString(),
  });
}

/**
 * Update custom fields (simple customization)
 */
export async function updateInstanceCustomFields(
  instanceId: string,
  customFields: SimpleCustomization
) {
  return updateInstance(instanceId, {
    custom_fields: customFields as any,
  });
}

