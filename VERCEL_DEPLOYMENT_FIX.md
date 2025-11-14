# Vercel Deployment Fix - Missing Supabase Environment Variables

## Error You're Seeing

```
Error: Missing Supabase environment variables
```

This happens because Vercel doesn't have access to your Supabase credentials during the build process.

---

## ✅ Solution: Add Environment Variables to Vercel

### Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Settings** (gear icon in sidebar)
4. Click on **API**
5. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 2: Add to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add these two variables:

#### Variable 1:
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Your Supabase Project URL (e.g., `https://xxxxx.supabase.co`)
- **Environments:** Select all (Production, Preview, Development)
- Click **Save**

#### Variable 2:
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon/public key
- **Environments:** Select all (Production, Preview, Development)
- Click **Save**

### Step 3: Redeploy

After adding the environment variables:

**Option A - Redeploy from Vercel Dashboard:**
1. Go to **Deployments** tab
2. Click on the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (optional)
5. Click **Redeploy**

**Option B - Push a new commit:**
```bash
git add .
git commit -m "Add Supabase client fix"
git push
```

Vercel will automatically trigger a new deployment.

---

## ✅ Code Changes Made

I've also updated `src/lib/supabase/client.ts` to be more build-friendly:

**What Changed:**
- The client now uses placeholder values during build time if environment variables are missing
- It only shows an error in the browser (not during build)
- This prevents the build from failing, but you **still need** to add the real environment variables to Vercel

**Why This Helps:**
- Allows the build to complete successfully
- Prevents build-time errors when environment variables aren't set
- The app will still work correctly in production once you add the real variables

---

## 🧪 Testing After Deployment

Once deployed with the correct environment variables:

1. ✅ Visit your Vercel URL
2. ✅ Try to sign up for an account
3. ✅ Try to log in
4. ✅ Create a presentation
5. ✅ Verify the share link works

If everything works, your environment variables are set correctly!

---

## 🚨 Troubleshooting

### Build Still Failing?

**Make sure:**
- Environment variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- No extra spaces in the values
- You selected all environments when adding them
- You redeployed after adding the variables

### Variables Set But App Not Working?

**Check:**
1. In Vercel Settings → Environment Variables, verify both variables are there
2. Make sure you used the **anon/public** key, not the service role key
3. Check that your Supabase project URL is correct
4. Look at Vercel Function logs for any errors

### How to View Vercel Logs

1. Go to your project in Vercel
2. Click **Deployments**
3. Click on the latest deployment
4. Click **Function Logs** or **Build Logs**

---

## 📋 Quick Checklist

- [ ] Get Supabase URL from Supabase Dashboard
- [ ] Get Supabase anon key from Supabase Dashboard
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
- [ ] Select all environments for both variables
- [ ] Redeploy your project
- [ ] Test login/signup on production
- [ ] Test creating a presentation
- [ ] Verify share links work

---

## 🎯 Summary

**The Issue:** Vercel doesn't have your Supabase credentials

**The Fix:** 
1. Add environment variables to Vercel (required)
2. Code changes to prevent build errors (already done)
3. Redeploy

**Result:** Your app will build successfully and work in production! 🚀

---

## Need Help?

If you're still having issues:

1. Double-check the environment variable names (case-sensitive!)
2. Make sure you're using the anon/public key (not service role)
3. Verify the Supabase URL is correct
4. Check Vercel build logs for specific errors
5. Try deleting and re-adding the environment variables in Vercel

The most common issue is typos in the variable names or using the wrong Supabase key.

