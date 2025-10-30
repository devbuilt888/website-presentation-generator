'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Presentation Maker
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/editor"
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === '/editor' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Editor
            </Link>
            <Link 
              href="/presentations"
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/presentations') 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Presentations
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
