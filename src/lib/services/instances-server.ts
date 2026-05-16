/**
 * Server-side instance queries (for metadata & OG image generation).
 */

import { createClient } from '@/lib/supabase/server';
import { isHttpUrl, usesOwnerPhoneOnFinalSlide } from '@/lib/utils/contact-phone';

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

  const templateId = (data.presentation as { template_id?: string } | null)?.template_id;
  const needsOwnerPhone =
    templateId &&
    usesOwnerPhoneOnFinalSlide(templateId) &&
    (!data.store_link || isHttpUrl(data.store_link));

  if (needsOwnerPhone) {
    const { data: ownerPhone } = await supabase.rpc('get_shared_instance_owner_phone', {
      p_token: shareToken,
    });
    if (ownerPhone) {
      return { ...data, store_link: ownerPhone };
    }
  }

  return data;
}
