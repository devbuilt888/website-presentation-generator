import type { Metadata } from 'next';
import ViewPresentationClient from './ViewPresentationClient';
import { getInstanceByTokenServer } from '@/lib/services/instances-server';
import {
  buildPresentationSharePreview,
  getSiteUrl,
  resolveShareImageUrl,
} from '@/lib/presentations/share-metadata';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;

  try {
    const instance = await getInstanceByTokenServer(token);
    const preview = buildPresentationSharePreview(instance);
    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}/view/${token}`;
    const ogImageUrl = resolveShareImageUrl(token, preview);

    return {
      title: preview.title,
      description: preview.description,
      openGraph: {
        title: preview.title,
        description: preview.description,
        url: pageUrl,
        type: 'website',
        siteName: 'PresenT',
        locale: 'es_ES',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: preview.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: preview.title,
        description: preview.description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {
      title: 'Presentación no encontrada | PresenT',
      description: 'Este enlace de presentación no es válido o ha expirado.',
      robots: { index: false, follow: false },
    };
  }
}

export default function ViewPresentationPage() {
  return <ViewPresentationClient />;
}
