'use client';

import { useCallback, useEffect, useState } from 'react';
import VideoLoadingOverlay from '@/components/VideoLoadingOverlay';

const DEFAULT_SRC =
  'https://zinzino.vimondtv.com/embedded/assets/610?language=es';

type Props = {
  embedUrl?: string;
  className?: string;
};

export default function VimondHealthProtocolEmbed({ embedUrl, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);
  const src = embedUrl || DEFAULT_SRC;

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div
      className={`relative aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-xl bg-black ${className}`}
    >
      <VideoLoadingOverlay visible={!loaded} />
      <iframe
        src={src}
        title="Health Protocol Concept - ES"
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={onLoad}
      />
    </div>
  );
}
