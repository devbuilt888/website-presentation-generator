# Setup Guide

This guide will help you set up the presentation system with Supabase.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (sign up at https://supabase.com)
- A Supabase project created

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Note your project URL and anon key (Settings → API)

### 1.2 Run Database Migrations

1. Open Supabase SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run in the SQL Editor
4. Verify tables were created (Table Editor should show all 6 tables)

### 1.3 Configure Storage (Optional)

If you're storing presentation assets in Supabase Storage:

1. Go to Storage in Supabase dashboard
2. Create a bucket named `assets` (or your preferred name)
3. Set it to public if assets should be publicly accessible
4. Update `NEXT_PUBLIC_ASSET_BASE` in `.env.local` to point to your bucket

## Step 2: Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_ASSET_BASE=https://your-project.supabase.co/storage/v1/object/public/assets
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Verify Setup

1. Start the development server:

```bash
npm run dev
```

2. Check the browser console for any Supabase connection errors
3. Verify you can access the application

## Step 5: Authentication Setup (Future)

When you're ready to add authentication:

1. Enable Email Auth in Supabase (Authentication → Providers)
2. Configure email templates if needed
3. Use Supabase Auth in your components:

```typescript
import { supabase } from '@/lib/supabase/client';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Sign out
await supabase.auth.signOut();
```

## Troubleshooting

### Database Connection Issues

- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon/public key (not service role key)
- Ensure RLS policies are set up correctly

### Migration Errors

- Check that you're running migrations in order
- Verify UUID extension is enabled: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
- Check Supabase logs for detailed error messages

### Type Errors

- Run `npm run build` to check for TypeScript errors
- Ensure `src/lib/supabase/types.ts` matches your database schema
- Regenerate types if needed (see Expansion Guide)

## Next Steps

1. Review `docs/DATABASE_SCHEMA.md` to understand the data structure
2. Read `docs/EXPANSION_GUIDE.md` to learn how to extend the system
3. Start building your presentation templates
4. Implement authentication UI
5. Create customization forms

## Support

For issues or questions:
- Check the documentation in `docs/`
- Review Supabase documentation: https://supabase.com/docs
- Check the codebase for examples

