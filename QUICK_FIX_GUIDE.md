# Quick Fix Guide - Foreign Key Constraint Error

## 🚨 The Problem
```
Error: insert or update on table "presentations" violates foreign key constraint "presentations_created_by_fkey"
```

## ✅ The Solution (3 Steps)

### Step 1: Run the Migration in Supabase

1. Open your Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase/migrations/004_auto_create_user_profile.sql`
3. Click **Run**

**What this does:**
- Creates a database trigger that auto-creates user profiles
- Backfills any existing users who are missing profiles
- Prevents this error from ever happening again

### Step 2: Verify the Fix

Run this in Supabase SQL Editor:

```sql
-- Check that trigger was created
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
-- Should return 1 row

-- Check that all auth users have profiles
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count;
-- Both numbers should match

-- Find any orphaned users (should be empty)
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;
-- Should return 0 rows
```

### Step 3: Test the Application

1. ✅ Try creating a presentation (should work now!)
2. ✅ Create a new test user account
3. ✅ Verify the new user can immediately create presentations
4. ✅ Share a presentation and test the public view link

## 📋 What Changed

### Files Created
- ✅ `supabase/migrations/004_auto_create_user_profile.sql` - The fix
- ✅ `docs/FOREIGN_KEY_FIX.md` - Detailed explanation
- ✅ `docs/SYSTEM_FLOW_AND_FIX.md` - Complete system flow
- ✅ `QUICK_FIX_GUIDE.md` - This file

### Files Updated
- ✅ `src/app/auth/signup/page.tsx` - Better error handling
- ✅ `src/components/presentations/CustomizationForm.tsx` - User-friendly error messages

## 🔍 How It Works

### Before (❌ Broken)
```
User signs up → auth.users created ✅
                       ↓
              Try create users profile
                       ↓
              Error occurs → IGNORED ❌
                       ↓
              User logs in successfully
                       ↓
              Tries to create presentation
                       ↓
              Foreign key check fails ❌
                       ↓
              ERROR! 💥
```

### After (✅ Fixed)
```
User signs up → auth.users created ✅
                       ↓
              Database trigger fires 🔥
                       ↓
              users profile auto-created ✅
                       ↓
              User logs in successfully
                       ↓
              Creates presentation
                       ↓
              Foreign key check passes ✅
                       ↓
              SUCCESS! 🎉
```

## 🛠️ If You Still Get the Error

### For Existing Users

If a user still gets the error after running the migration:

```sql
-- Manually create their profile (replace USER_ID with actual ID from error)
INSERT INTO public.users (id, email, created_at, updated_at)
SELECT id, email, created_at, updated_at 
FROM auth.users 
WHERE id = 'USER_ID_HERE'
ON CONFLICT (id) DO NOTHING;
```

### For New Users

If new users still get this error:
1. Check that the trigger exists (Step 2 above)
2. Check Supabase logs for trigger errors
3. User can try: Log out → Log back in → Try again

## 📚 More Information

- **Detailed explanation:** See `docs/FOREIGN_KEY_FIX.md`
- **Full system flow:** See `docs/SYSTEM_FLOW_AND_FIX.md`
- **Database schema:** See `docs/DATABASE_SCHEMA.md`

## 🎯 Summary

The error occurred because user profiles weren't being created in the `users` table during signup, even though authentication was successful. The database trigger now automatically ensures every authenticated user has a profile, fixing the foreign key constraint violation permanently.

**Just run the migration and you're done!** 🚀
