# Database Migrations Guide

## Overview
This guide will help you run the necessary database migrations to fix the presentation sharing functionality.

## Issue Summary
The application was failing to create presentations because:
1. **Missing Presentation Record**: The code was trying to create instances directly without creating a presentation record first
2. **RLS Policies**: Row Level Security policies were blocking public access to presentations via share tokens

## Fixed Issues

### 1. Code Fixes (Already Applied)
✅ `CustomizationForm.tsx` - Now creates a presentation record before creating an instance  
✅ `ViewPresentationPage.tsx` - Now properly retrieves template ID from presentation record  
✅ Form text color fixed - Dark grey text instead of white

### 2. Database Migrations Needed

You need to run these migrations in your Supabase dashboard:

#### Migration Files (in order):
1. `001_initial_schema.sql` - Base schema (should already be run)
2. `002_add_share_token.sql` - Adds share_token column (should already be run)
3. `003_public_viewing_policies.sql` - **NEW - MUST RUN THIS**

## How to Run the Migrations

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Go to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Migration 003**
   - Copy the entire contents of `supabase/migrations/003_public_viewing_policies.sql`
   - Paste it into the SQL editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Success**
   - You should see "Success. No rows returned"
   - Check that no errors appear

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're in the project directory
cd website-template-generator

# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

## What the New Migration Does

The `003_public_viewing_policies.sql` migration adds RLS policies that allow:

- ✅ **Public viewing** of presentation instances via share token
- ✅ **Reading presentation data** for instances with share tokens
- ✅ **Reading custom questions** for shared presentations
- ✅ **Reading and submitting answers** for shared presentations
- ✅ **Updating viewed status** when someone views a shared presentation

## Testing After Migration

### 1. Create a Test Presentation
1. Log into your dashboard at `/dashboard`
2. Select a template (e.g., "Customer Presentation MEX - Zinzino")
3. Fill out the form:
   - Recipient Name: Test User
   - Recipient Email: test@example.com
   - Store Link: https://example.com
4. Optionally add a custom question
5. Click "Create & Send Presentation"

### 2. Verify Success
You should see:
- ✅ Success message with a share link
- ✅ No error messages
- ✅ The presentation appears in "Sent Presentations" section

### 3. Test Public Viewing
1. Copy the share link
2. Open it in an incognito/private browser window (to simulate a non-logged-in user)
3. The presentation should load and play

## Troubleshooting

### Error: "presentation_id violates foreign key constraint"
- **Cause**: Migration 003 not run yet
- **Fix**: Run the migration as described above

### Error: "row-level security policy violation"
- **Cause**: RLS policies blocking access
- **Fix**: Run migration 003 to add public viewing policies

### Error: "Template not found"
- **Cause**: Template registry not initialized
- **Fix**: This is usually temporary; refresh the page

### Presentations Not Showing in Dashboard
- **Cause**: User not authenticated or database connection issue
- **Fix**: Check Supabase environment variables in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

## Database Schema Overview

```
users (extends Supabase auth)
  ↓
presentations (stores presentation records)
  ├─ template_id (string: 'zinzino-mex', etc.)
  ├─ name
  └─ created_by → users.id
     ↓
presentation_instances (customized copies for recipients)
  ├─ presentation_id → presentations.id
  ├─ share_token (unique, for public access)
  ├─ recipient_name
  ├─ recipient_email
  ├─ status (draft, sent, viewed, completed)
  └─ created_by → users.id
     ↓
custom_questions (optional advanced questions)
  ├─ instance_id → presentation_instances.id
  ├─ question_text
  └─ question_type
     ↓
question_answers (responses from recipients)
  ├─ question_id → custom_questions.id
  ├─ instance_id → presentation_instances.id
  └─ answer_text
```

## Security Notes

- ✅ Share tokens are unique 12-character alphanumeric strings
- ✅ Presentations are private by default (only creator can see them)
- ✅ Public viewing requires a valid share token
- ✅ RLS policies prevent unauthorized access to user data
- ✅ Answers can only be submitted for presentations with share tokens

## Next Steps

After running the migration:
1. ✅ Test creating a presentation
2. ✅ Test viewing via share link
3. ✅ Test custom questions (if using advanced mode)
4. ✅ Verify recipient can view without logging in

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify all environment variables are set correctly
4. Ensure all migrations have been run successfully

