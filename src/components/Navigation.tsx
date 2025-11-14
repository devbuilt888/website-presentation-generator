'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth/AuthProvider';

export default function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Don't show navigation on auth pages or view pages
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/view')) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Presentation Maker
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  href="/dashboard"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
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
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
