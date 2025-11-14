'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Presentation Maker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning presentations with our cutting-edge template builder. 
            Design, customize, and share your presentations with ease.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Link 
            href="/editor"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Presentation Editor</h3>
            <p className="text-gray-600 leading-relaxed">
              Create and customize your presentations with our advanced editor. 
              Choose from multiple templates, add animations, and personalize your content.
            </p>
          </Link>
          
          <Link 
            href="/presentations"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">My Presentations</h3>
            <p className="text-gray-600 leading-relaxed">
              View and manage your saved presentations. Access your created presentations 
              and continue editing or start new ones.
            </p>
          </Link>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
