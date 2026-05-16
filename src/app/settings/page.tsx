'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getOwnProfile, updateOwnProfile } from '@/lib/services/users';
import { normalizePhoneDigits } from '@/lib/utils/contact-phone';

export default function SettingsPage() {
  const { user } = useAuth();
  const t = useTranslations('settings');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const profile = await getOwnProfile(user.id);
        if (cancelled) return;
        if (!profile) {
          setError(t('loadError'));
          return;
        }
        setFullName(profile.full_name || '');
        setPhone(profile.phone || '');
      } catch {
        if (!cancelled) setError(t('loadError'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setError('');
    setSuccess(false);

    const phoneTrimmed = phone.trim();
    if (phoneTrimmed && normalizePhoneDigits(phoneTrimmed).length < 10) {
      setError(t('phoneInvalid'));
      return;
    }

    setSaving(true);
    try {
      await updateOwnProfile(user.id, {
        full_name: fullName.trim() || null,
        phone: phoneTrimmed || null,
      });
      setSuccess(true);
    } catch {
      setError(t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/40">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher variant="light" />
        </div>

        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              ← {tNav('dashboard')}
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">{t('subtitle')}</p>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto" />
              <p className="mt-4 text-gray-600 text-sm">{tCommon('loading')}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 space-y-6"
            >
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
                  {t('saved')}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('emailLabel')}
                </label>
                <input
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500">{t('emailHint')}</p>
              </div>

              <div>
                <label htmlFor="settings-fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('fullNameLabel')}
                </label>
                <input
                  id="settings-fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="settings-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phoneLabel')}
                </label>
                <input
                  id="settings-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="407-555-1234"
                />
                <p className="mt-1 text-xs text-gray-500">{t('phoneHint')}</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? t('saving') : t('save')}
              </button>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
