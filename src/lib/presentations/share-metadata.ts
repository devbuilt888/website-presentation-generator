import { getTemplate } from '@/lib/presentations/template-registry';

export type PresentationSharePreview = {
  title: string;
  description: string;
  templateId?: string;
  /** Absolute URL when set in presentation/instance metadata */
  imageUrl?: string;
};

type JsonRecord = Record<string, unknown>;

type InstanceWithPresentation = {
  recipient_name: string | null;
  metadata?: unknown;
  presentation?: {
    name: string;
    description: string | null;
    template_id: string;
    metadata?: unknown;
  } | null;
};

function readMetaString(meta: unknown, key: string): string | undefined {
  if (!meta || typeof meta !== 'object') return undefined;
  const value = (meta as JsonRecord)[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

/**
 * Build Open Graph / social preview fields from a shared presentation instance.
 * Prefers DB presentation name (e.g. "es omega 3 importante?") over template defaults.
 */
export function buildPresentationSharePreview(
  instance: InstanceWithPresentation
): PresentationSharePreview {
  const presentation = instance.presentation;
  const templateId = presentation?.template_id;
  const template = templateId ? getTemplate(templateId) : null;

  const title =
    readMetaString(presentation?.metadata, 'ogTitle') ||
    readMetaString(instance.metadata, 'ogTitle') ||
    presentation?.name?.trim() ||
    template?.name ||
    'PresenT';

  let description =
    readMetaString(presentation?.metadata, 'ogDescription') ||
    readMetaString(instance.metadata, 'ogDescription') ||
    presentation?.description?.trim() ||
    template?.description ||
    'Abre esta presentación interactiva personalizada en PresenT.';

  const recipient = instance.recipient_name?.trim();
  if (recipient && !description.toLowerCase().includes(recipient.toLowerCase())) {
    description = `Presentación para ${recipient}. ${description}`;
  }

  const imageUrl =
    readMetaString(presentation?.metadata, 'ogImage') ||
    readMetaString(instance.metadata, 'ogImage');

  return {
    title,
    description,
    templateId: templateId ?? undefined,
    imageUrl,
  };
}

export function resolveShareImageUrl(token: string, preview: PresentationSharePreview): string {
  const siteUrl = getSiteUrl();
  if (preview.imageUrl && /^https?:\/\//i.test(preview.imageUrl)) {
    return preview.imageUrl;
  }
  return `${siteUrl}/view/${token}/opengraph-image`;
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}
