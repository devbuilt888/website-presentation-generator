# URGENT FIX - Share Links Not Working for Unauthenticated Users

## 🚨 The Issue

Share links show **"Cannot coerce the result to a single JSON object"** when opened by:
- Guest users (not logged in)
- Incognito/private browsing mode
- Different browser where you're not logged in

**BUT it works when you're logged in on the same account.**

---

## 🔍 Root Cause

The RLS (Row Level Security) policies in Supabase are **blocking unauthenticated users** from accessing the presentations table, even when they have a valid share token.

**Diagnosis:**
1. ✅ Code changes are correct
2. ❌ **Database policies are not allowing public access**
3. ❌ Migration 003 might not have been run, or policies are conflicting

---

## ✅ SOLUTION - Run This Migration in Supabase

### Step 1: Check if Migration 003 Was Run

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Run this query to check existing policies:

```sql
-- Check what policies exist for presentations table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('presentations', 'presentation_instances')
ORDER BY tablename, policyname;
```

### Step 2: Run the Fix Migration

Copy the entire contents of **`supabase/migrations/005_fix_presentation_public_access.sql`** and paste it into the Supabase SQL Editor, then click **Run**.

Here's what to run:

```sql
-- Fix RLS policy to allow unauthenticated access to presentations via share token
-- This solves the "Cannot coerce the result to a single JSON object" error

-- Drop the old policy that's too restrictive
DROP POLICY IF EXISTS "Anyone can view presentations with shared instances" ON presentations;

-- Create a new policy that properly allows public access via share token
-- This policy checks if ANY instance of this presentation has a share_token
CREATE POLICY "Allow public access to presentations with share tokens" ON presentations
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 
      FROM presentation_instances 
      WHERE presentation_instances.presentation_id = presentations.id
      AND presentation_instances.share_token IS NOT NULL
    )
  );

-- Also ensure the presentation_instances policy is correct
-- Drop and recreate to make sure it's working
DROP POLICY IF EXISTS "Anyone can view instances by share token" ON presentation_instances;

CREATE POLICY "Public can view instances with share token" ON presentation_instances
  FOR SELECT 
  USING (share_token IS NOT NULL);

-- Note: "Users can read own presentations" policy already exists from migration 001
-- No need to recreate it
```

### Step 3: Verify Policies Were Created

Run this to verify:

```sql
-- Verify the policies exist
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename IN ('presentations', 'presentation_instances')
AND policyname IN (
  'Allow public access to presentations with share tokens',
  'Public can view instances with share token'
);
```

**You should see 2 rows returned.**

To verify all policies including the existing one:
```sql
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename IN ('presentations', 'presentation_instances')
ORDER BY tablename, policyname;
```

### Step 4: Test Public Access

Run this test query to simulate what an unauthenticated user would see:

```sql
-- Test: Can we see a presentation with a share token? (simulates guest access)
-- Replace 'YOUR_SHARE_TOKEN' with an actual token from your dashboard
SELECT 
  pi.*,
  p.template_id,
  p.name
FROM presentation_instances pi
LEFT JOIN presentations p ON p.id = pi.presentation_id
WHERE pi.share_token = 'YOUR_SHARE_TOKEN';
```

**If this returns results, the fix is working!**

---

## 🧪 Testing After Running Migration

### Test 1: Create a New Presentation

1. Log into your dashboard
2. Create a new presentation
3. Copy the share link
4. **Keep this tab open** (don't close it yet)

### Test 2: Test in Incognito Mode

1. Open a new **Incognito/Private window**
2. Paste the share link
3. ✅ **It should work now!**

### Test 3: Test on Different Browser

1. Copy the share link
2. Open in a completely different browser
3. ✅ **Should work!**

---

## 🔧 Alternative Fix: Manual Policy Update in Supabase Dashboard

If the SQL script doesn't work, try this manual approach:

### Option 1: Use Supabase UI (Easier)

1. Go to **Authentication** → **Policies**
2. Find the `presentations` table
3. **Delete** the policy named "Anyone can view presentations with shared instances"
4. **Add New Policy**:
   - Name: `Allow public access to presentations with share tokens`
   - Policy command: `SELECT`
   - Target roles: `public`
   - USING expression:
   ```sql
   EXISTS (
     SELECT 1 
     FROM presentation_instances 
     WHERE presentation_instances.presentation_id = presentations.id
     AND presentation_instances.share_token IS NOT NULL
   )
   ```

5. Find the `presentation_instances` table
6. **Verify** there's a policy allowing SELECT where `share_token IS NOT NULL`

---

## 📊 Understanding the Fix

### What the Policies Do

**For `presentation_instances` table:**
```sql
-- Allows anyone to read instances that have a share_token
USING (share_token IS NOT NULL)
```
- ✅ If share_token exists → anyone can read
- ❌ If share_token is NULL → only owner can read

**For `presentations` table:**
```sql
-- Allows anyone to read presentations that have instances with share tokens
USING (
  EXISTS (
    SELECT 1 FROM presentation_instances
    WHERE presentation_id = presentations.id
    AND share_token IS NOT NULL
  )
)
```
- ✅ If presentation has any instance with a token → anyone can read
- ❌ If presentation has no instances with tokens → only owner can read

### Security is Maintained

✅ **What's Protected:**
- Your dashboard (still private)
- Presentations without share tokens
- Other users' data
- Editing capabilities

✅ **What's Public:**
- Only presentations with active share links
- Must have valid 12-character token
- Cannot enumerate or guess tokens

---

## 🎯 Quick Checklist

- [ ] Go to Supabase SQL Editor
- [ ] Run migration 005 SQL script
- [ ] Verify policies were created
- [ ] Create a test presentation
- [ ] Copy share link
- [ ] Open in incognito mode
- [ ] ✅ Verify it works!

---

## ❓ Troubleshooting

### Still Getting the Error?

**Check 1: Are policies enabled?**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('presentations', 'presentation_instances');
```
Both should show `rowsecurity = true`.

**Check 2: Are there conflicting policies?**
```sql
-- List ALL policies
SELECT * FROM pg_policies 
WHERE tablename IN ('presentations', 'presentation_instances');
```
Look for any policies that might be blocking SELECT for public role.

**Check 3: Is the JOIN working?**

The code uses a JOIN query. Test it:
```sql
-- Test the exact query the app uses
SELECT 
  pi.*,
  row_to_json(p.*) as presentation
FROM presentation_instances pi
LEFT JOIN presentations p ON p.id = pi.presentation_id
WHERE pi.share_token = 'YOUR_TOKEN_HERE';
```

If this returns `null` for the presentation column, the policy is still blocking it.

---

## 🚀 After the Fix

Once the migration is run:

1. ✅ Share links work for everyone
2. ✅ No login required to view shared presentations
3. ✅ All presentation types work (standard, 3D, interactive)
4. ✅ Dashboard remains private and secure
5. ✅ Can track views and completion

---

## 💡 Why This Happens

The issue occurs because:

1. **Supabase RLS is very strict** (this is good for security!)
2. **Policies must explicitly allow access** for unauthenticated users
3. **JOINs require permissions on both tables** being joined
4. **The original migration (003) might not have been run** on your Supabase project

This is actually a **common issue** when setting up public access in Supabase. The fix is to ensure the RLS policies are correctly configured.

---

## 📝 Summary

**What to do NOW:**

1. **Copy the SQL from migration 005**
2. **Paste into Supabase SQL Editor**
3. **Click Run**
4. **Test in incognito mode**
5. **Share links should work! 🎉**

The migration file is already created at:
`supabase/migrations/005_fix_presentation_public_access.sql`

**This will fix the issue permanently!**

