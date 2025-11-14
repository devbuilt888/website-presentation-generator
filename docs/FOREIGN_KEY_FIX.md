# Foreign Key Constraint Error Fix

## Problem Description

### Error Message
```
insert or update on table "presentations" violates foreign key constraint "presentations_created_by_fkey"
```

### Root Cause

The error occurs when a user tries to create a presentation, but their profile doesn't exist in the `users` table, even though they're authenticated.

**Why this happens:**

1. **Authentication Flow:**
   - User signs up → Supabase Auth creates record in `auth.users` ✅
   - Signup page tries to manually create profile in `users` table
   - If profile creation fails, error was silently caught and ignored ❌

2. **Presentation Creation:**
   - `presentations.created_by` has foreign key constraint → `users.id`
   - When user tries to create presentation with their `user.id`
   - If `user.id` doesn't exist in `users` table → Foreign Key Violation ❌

### Database Schema Relationships

```
auth.users (Supabase Auth)
  ↓ (user signs up)
users (public schema)
  ↓ (foreign key: created_by)
presentations
  ↓ (foreign key: presentation_id)
presentation_instances
```

## Solution

### 1. Database Trigger (Primary Fix) ⭐

**File:** `supabase/migrations/004_auto_create_user_profile.sql`

This migration creates a database trigger that **automatically** creates a user profile in the `users` table whenever a new user signs up in Supabase Auth.

**Benefits:**
- ✅ Automatic - no application code needed
- ✅ Reliable - runs at database level
- ✅ Backfills existing users who are missing profiles
- ✅ Prevents race conditions

**How it works:**
```sql
-- Trigger fires AFTER INSERT on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 2. Application Code Updates (Backup)

**File:** `src/app/auth/signup/page.tsx`

- Updated to treat manual profile creation as a backup
- Ignores duplicate key errors (profile already created by trigger)
- Throws error for other profile creation issues

**File:** `src/components/presentations/CustomizationForm.tsx`

- Added specific error handling for foreign key constraint violations
- Provides user-friendly error message with clear instructions

### 3. Error Handling (User Experience)

If the foreign key error still occurs, users now see:
```
User profile not found. Please try logging out and logging back in. 
If the problem persists, contact support.
```

## How to Apply the Fix

### Step 1: Run the Migration

In your Supabase SQL Editor:

```sql
-- Run this file:
supabase/migrations/004_auto_create_user_profile.sql
```

Or via CLI:
```bash
supabase db push
```

### Step 2: Verify the Fix

1. **Check existing users:**
   ```sql
   -- All auth users should have profiles
   SELECT COUNT(*) FROM auth.users;
   SELECT COUNT(*) FROM public.users;
   -- These counts should match
   ```

2. **Test new signup:**
   - Create a new user account
   - Verify profile is created automatically
   - Try creating a presentation immediately

3. **Check for orphaned auth users:**
   ```sql
   -- Find auth users without profiles (should be empty after migration)
   SELECT au.id, au.email, au.created_at
   FROM auth.users au
   LEFT JOIN public.users u ON au.id = u.id
   WHERE u.id IS NULL;
   ```

### Step 3: Fix Existing Users (if needed)

If you find existing users without profiles, they'll be automatically fixed by the backfill script in the migration. But you can manually run it:

```sql
-- Backfill missing user profiles
INSERT INTO public.users (id, email, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as full_name,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

## Testing Checklist

- [ ] Run migration 004 in Supabase
- [ ] Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- [ ] Create new user account
- [ ] Confirm profile appears in `users` table immediately
- [ ] Create a presentation without errors
- [ ] Check that all existing auth users have profiles

## Prevention

This fix prevents the issue permanently by:

1. **Database-level enforcement** - Trigger automatically creates profiles
2. **Backfill script** - Fixes any existing orphaned users
3. **Better error messages** - Helps diagnose if issue reoccurs
4. **Redundant safety** - Application code still tries to create profile as backup

## Related Files

- ✅ `supabase/migrations/004_auto_create_user_profile.sql` (NEW)
- ✅ `src/app/auth/signup/page.tsx` (UPDATED)
- ✅ `src/components/presentations/CustomizationForm.tsx` (UPDATED)
- ✅ `docs/FOREIGN_KEY_FIX.md` (THIS FILE)

## Additional Notes

### Why Not Use RLS Policy?

Row Level Security (RLS) policies control who can read/write data, but they don't solve this problem because:
- The user IS authenticated (exists in `auth.users`)
- They DO have permission to create presentations
- The issue is that their `id` doesn't exist in the `users` table (data integrity issue, not permission issue)

### Why Database Trigger is Better Than Application Code?

1. **Atomic** - Happens in same transaction as auth user creation
2. **Reliable** - Can't be skipped by application bugs
3. **Automatic** - Works for all signup methods (email, OAuth, etc.)
4. **Single source of truth** - Database enforces the relationship

## Troubleshooting

### If error still occurs after migration:

1. **Check if trigger exists:**
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. **Check if function exists:**
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. **Manually create profile:**
   ```sql
   -- Replace USER_ID_HERE with the actual user ID from error message
   INSERT INTO public.users (id, email, created_at, updated_at)
   SELECT id, email, created_at, updated_at 
   FROM auth.users 
   WHERE id = 'USER_ID_HERE'
   ON CONFLICT (id) DO NOTHING;
   ```

4. **Check Supabase logs** for trigger execution errors

## Summary

✅ **Migration 004** ensures all auth users automatically get profiles  
✅ **Application code** provides backup and better error messages  
✅ **Existing users** are backfilled automatically  
✅ **Future users** will never have this issue  

The foreign key constraint error should now be completely resolved! 🎉

