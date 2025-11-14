# Fix Supabase Password Reset Redirect URL

## Problem

Password reset emails are redirecting to `localhost:3000` instead of your production URL: `https://ultra-mango-generator.vercel.app/`

## Solution: Update Supabase Site URL

You need to change the **Site URL** in your Supabase project settings.

---

## 📝 Step-by-Step Instructions

### 1. Go to Supabase Dashboard

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Settings** (gear icon in sidebar)
4. Click on **Authentication**

### 2. Update Site URL

Scroll down to find **Site URL** section:

1. Find the field labeled **Site URL**
2. Change from: `http://localhost:3000`
3. Change to: `https://ultra-mango-generator.vercel.app`
4. Click **Save**

### 3. Update Redirect URLs (Optional but Recommended)

Scroll to **Redirect URLs** section:

1. Add your production URL: `https://ultra-mango-generator.vercel.app/**`
2. You can keep localhost for development: `http://localhost:3000/**`
3. Click **Save**

---

## 🔒 What This Fixes

After updating the Site URL:

✅ Password reset emails will redirect to `https://ultra-mango-generator.vercel.app/`  
✅ Email confirmation links will go to production URL  
✅ OAuth redirects (if you add them later) will work correctly  
✅ Magic link emails will use production URL  

---

## 🧪 Testing the Fix

### Test Password Reset Flow

1. **Go to your login page:**
   - Visit: `https://ultra-mango-generator.vercel.app/auth/login`

2. **Click "Forgot Password?"** (if you have this link)
   - Or you can add one following the instructions below

3. **Enter your email and request reset**

4. **Check your email:**
   - You should receive a password reset email
   - The link should now point to `https://ultra-mango-generator.vercel.app/...`
   - Previously it was pointing to `http://localhost:3000/...`

---

## 📧 Add "Forgot Password" Link (Optional)

Currently, your login page doesn't have a "Forgot Password" link. Here's how to add one:

### Option 1: Add to Login Page

Add this link under your login form:

```tsx
<p className="mt-4 text-center text-sm text-gray-600">
  <Link href="/auth/reset-password" className="text-blue-600 hover:text-blue-700 font-semibold">
    Forgot password?
  </Link>
</p>
```

### Option 2: Create Password Reset Page

Create `src/app/auth/reset-password/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://ultra-mango-generator.vercel.app/auth/update-password',
      });

      if (error) throw error;
      
      setMessage('Check your email for the password reset link!');
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Reset Password</h1>
        <p className="text-center text-gray-600 mb-8">Enter your email to receive a reset link</p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

---

## 🔐 Create Update Password Page

Create `src/app/auth/update-password/page.tsx` for users to set their new password:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setMessage('Password updated successfully! Redirecting to login...');
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Update Password</h1>
        <p className="text-center text-gray-600 mb-8">Enter your new password</p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
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
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 📋 Summary

### What You Need to Do:

1. ✅ **Update Site URL in Supabase Dashboard**
   - Go to Authentication settings
   - Change Site URL to: `https://ultra-mango-generator.vercel.app`

2. ✅ **Updated middleware.ts** (already done)
   - Added `/presentations` to public routes

3. ⚠️ **Optional: Add password reset pages** (recommended)
   - Reset password request page
   - Update password page

### Current Presentation Visibility:

| Access Type | Who Can See | Login Required |
|-------------|-------------|----------------|
| **Dashboard** | Only the creator | ✅ Yes |
| **Share Links** (`/view/[token]`) | Anyone with the link | ❌ No |
| **Template Previews** (`/presentations/[id]`) | Anyone | ❌ No (after middleware update) |

---

## 🎯 Next Steps

1. **Immediately:** Update Site URL in Supabase Dashboard
2. **Soon:** Test password reset flow
3. **Optional:** Add "Forgot Password" link and pages

After updating the Site URL, all password reset emails will redirect to your production URL instead of localhost! 🎉

