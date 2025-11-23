'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { isUserAdmin } from '@/lib/utils/user-roles';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CuttingEdgeTemplateBuilder from '@/components/CuttingEdgeTemplateBuilder';

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <EditorContent />
    </ProtectedRoute>
  );
}

function EditorContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      router.push('/dashboard');
      return;
    }

    const admin = await isUserAdmin(user.id);
    setIsAdmin(admin);

    if (!admin) {
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return <CuttingEdgeTemplateBuilder />;
}
