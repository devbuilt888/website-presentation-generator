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
 * Includes presentation data via join to avoid RLS issues
 */
export async function getInstanceByToken(shareToken: string) {
  const { data, error } = await supabase
    .from('presentation_instances')
    .select(`
      *,
      presentation:presentations(*)
    `)
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
 * Get all instances (admin only) or user's instances
 * RLS policies will enforce admin-only access at database level
 */
export async function getAllInstances(userId: string, isAdmin: boolean = false) {
  if (isAdmin) {
    // Admins can see all instances via RLS policy
    const { data, error } = await supabase
      .from('presentation_instances')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  // Regular users see only their instances
  return getUserInstances(userId);
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

/**
 * Save user response for a specific slide
 * Stores responses in metadata.user_responses JSONB field
 */
export async function saveUserResponse(
  instanceId: string,
  slideId: string,
  question: string,
  answer: string | { [key: string]: any }
) {
  // Get current instance to merge with existing metadata
  const instance = await getInstance(instanceId);
  const currentMetadata = (instance.metadata as any) || {};
  const currentResponses = currentMetadata.user_responses || {};
  
  // Update responses with new answer
  const updatedResponses = {
    ...currentResponses,
    [slideId]: {
      question,
      answer,
      answered_at: new Date().toISOString(),
    },
  };
  
  // Update metadata
  return updateInstance(instanceId, {
    metadata: {
      ...currentMetadata,
      user_responses: updatedResponses,
    } as any,
  });
}

/**
 * Get user responses from instance metadata
 */
export async function getUserResponses(instanceId: string) {
  const instance = await getInstance(instanceId);
  const metadata = (instance.metadata as any) || {};
  return metadata.user_responses || {};
}

/**
 * Log store link click
 * Stores store link clicks in metadata.store_link_clicks JSONB field
 */
export async function logStoreLinkClick(
  instanceId: string,
  storeLink: string,
  slideId?: string
) {
  // Get current instance to merge with existing metadata
  const instance = await getInstance(instanceId);
  const currentMetadata = (instance.metadata as any) || {};
  const currentClicks = currentMetadata.store_link_clicks || [];
  
  // Add new click with timestamp
  const newClick = {
    store_link: storeLink,
    slide_id: slideId || null,
    clicked_at: new Date().toISOString(),
  };
  
  // Update metadata
  return updateInstance(instanceId, {
    metadata: {
      ...currentMetadata,
      store_link_clicks: [...currentClicks, newClick],
    } as any,
  });
}

/**
 * Get store link clicks from instance metadata
 */
export async function getStoreLinkClicks(instanceId: string) {
  const instance = await getInstance(instanceId);
  const metadata = (instance.metadata as any) || {};
  return metadata.store_link_clicks || [];
}

