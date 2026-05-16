'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { normalizePhoneDigits } from '@/lib/utils/contact-phone';

export default function SignupPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const phoneTrimmed = phone.trim();
    if (!phoneTrimmed) {
      setError(t('phoneRequired'));
      return;
    }
    if (normalizePhoneDigits(phoneTrimmed).length < 10) {
      setError(t('phoneInvalid'));
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || null,
            phone: phoneTrimmed,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from('users').upsert(
          {
            id: authData.user.id,
            email: authData.user.email!,
            full_name: fullName || null,
            phone: phoneTrimmed,
          },
          { onConflict: 'id' }
        );

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error(t('profileCreateError'));
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session && session.user) {
        window.location.href = '/dashboard';
      } else {
        setError(t('confirmEmailMessage'));
        setLoading(false);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('signupError');
      setError(message || t('signupError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher variant="light" />
      </div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">{t('signupTitle')}</h1>
        <p className="text-center text-gray-600 mb-8">{t('signupSubtitle')}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              {t('fullName')}
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder={t('fullNamePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t('phone')}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder={t('phonePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">{t('passwordMinHint')}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('creatingAccount') : t('signUp')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
