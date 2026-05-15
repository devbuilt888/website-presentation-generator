/**
 * Server-side instance queries (for metadata & OG image generation).
 */

import { createClient } from '@/lib/supabase/server';

export async function getInstanceByTokenServer(shareToken: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('presentation_instances')
    .select(
      `
      *,
      presentation:presentations(*)
    `
    )
    .eq('share_token', shareToken)
    .single();

  if (error) throw error;
  return data;
}
