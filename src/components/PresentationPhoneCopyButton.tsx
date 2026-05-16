'use client';

import { useCallback, useState } from 'react';

type Props = {
  textToCopy: string;
  className?: string;
};

export default function PresentationPhoneCopyButton({ textToCopy, className = '' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [textToCopy]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={copied ? 'Número copiado' : 'Copiar número de teléfono'}
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}
