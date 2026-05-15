import { ImageResponse } from 'next/og';
import { getInstanceByTokenServer } from '@/lib/services/instances-server';
import { buildPresentationSharePreview } from '@/lib/presentations/share-metadata';

export const runtime = 'nodejs';
export const alt = 'Vista previa de la presentación';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = {
  params: Promise<{ token: string }>;
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function themeForTemplate(templateId?: string) {
  if (templateId?.startsWith('omega-balance')) {
    return {
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e1b4b 100%)',
      accent: '#818cf8',
      glow: 'rgba(129, 140, 248, 0.35)',
    };
  }
  if (templateId === 'forest-night-journey') {
    return {
      background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #022c22 100%)',
      accent: '#4ade80',
      glow: 'rgba(74, 222, 128, 0.35)',
    };
  }
  return {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    accent: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.35)',
  };
}

export default async function OpenGraphImage({ params }: Props) {
  const { token } = await params;

  try {
    const instance = await getInstanceByTokenServer(token);
    const preview = buildPresentationSharePreview(instance);
    const theme = themeForTemplate(preview.templateId);
    const title = truncate(preview.title, 72);
    const description = truncate(preview.description, 160);

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 64,
            background: theme.background,
            color: '#f8fafc',
            position: 'relative',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 15% 20%, ${theme.glow} 0%, transparent 45%), radial-gradient(circle at 85% 80%, ${theme.glow} 0%, transparent 40%)`,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${theme.accent} 0%, #6366f1 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              P
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#e2e8f0' }}>PresenT</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              zIndex: 1,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-1px',
                maxWidth: 1000,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.4,
                color: '#cbd5e1',
                maxWidth: 980,
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 1,
              fontSize: 24,
              color: '#94a3b8',
            }}
          >
            <span>Presentación interactiva</span>
            <span style={{ color: theme.accent, fontWeight: 600 }}>Abrir presentación →</span>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: '#f8fafc',
            fontSize: 48,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Presentación no encontrada
        </div>
      ),
      { ...size }
    );
  }
}
