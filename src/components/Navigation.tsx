'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth/AuthProvider';
import { isUserAdmin } from '@/lib/utils/user-roles';
import Logo from './Logo';

export default function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user) {
      isUserAdmin(user.id).then(setIsAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Don't show navigation on auth pages or view pages
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/view')) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 shadow-2xl">
      {/* White Top Section - Branding Bar */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link 
              href={user ? "/dashboard" : "/"} 
              className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300"
            >
              Presentation Maker
            </Link>
            
            {/* Top Right Actions - Minimal for non-authenticated */}
            {!user && (
              <div className="flex items-center gap-3">
                <Link 
                  href="/auth/login"
                  className="px-4 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="px-4 py-1.5 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dark Bottom Section - Logo & Navigation */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700/50 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between py-4">
            {/* Left: Logo */}
            <Link href={user ? "/dashboard" : "/"} className="flex items-center group">
              <Logo size="md" />
            </Link>
            
            {/* Right: Navigation & User Actions */}
            {user ? (
              <div className="flex items-center gap-4">
                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-2">
                  <Link 
                    href="/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === '/dashboard' 
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pathname === '/admin' 
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </div>
                
                {/* User Info & Sign Out */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
                  <span className="text-sm text-slate-400 hidden sm:block max-w-[200px] truncate">
                    {user?.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
