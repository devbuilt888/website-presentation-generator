'use client';

import { usePathname } from 'next/navigation';

export default function NavGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide navigation on presentation player pages like /presentations/[id]
  if (pathname && pathname.startsWith('/presentations/') && pathname.split('/').length >= 3) {
    return null;
  }
  return <>{children}</>;
}


