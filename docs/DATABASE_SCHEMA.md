# Database Schema Documentation

## Overview
This document describes the Supabase database schema for the presentation system. The schema is designed to be extensible - new fields can be added without breaking existing functionality.

## Tables

### 1. `users`
Stores user account information (Supabase Auth handles authentication, this extends the profile).

**Columns:**
- `id` (uuid, primary key) - References `auth.users.id`
- `email` (text, unique) - User email
- `full_name` (text, nullable) - User's full name
- `created_at` (timestamp) - Account creation time
- `updated_at` (timestamp) - Last update time
- `metadata` (jsonb, nullable) - Flexible JSON for future fields

**Indexes:**
- Primary key on `id`
- Unique index on `email`

**Row Level Security (RLS):**
- Users can read/update their own row
- Admins can read all rows

---

### 2. `presentations`
Stores presentation templates (frontend-loaded, database only stores metadata and access).

**Columns:**
- `id` (uuid, primary key, default: gen_random_uuid())
- `template_id` (text, not null) - Frontend template identifier (e.g., 'zinzino-mex')
- `name` (text, not null) - Presentation name
- `description` (text, nullable) - Presentation description
- `created_by` (uuid, foreign key → users.id) - Creator user ID
- `is_public` (boolean, default: false) - Whether presentation is publicly accessible
- `created_at` (timestamp, default: now())
- `updated_at` (timestamp, default: now())
- `metadata` (jsonb, nullable) - Flexible JSON for template-specific data

**Indexes:**
- Primary key on `id`
- Index on `created_by`
- Index on `template_id`
- Index on `is_public`

**RLS:**
- Users can read their own presentations
- Users can read public presentations
- Users can create/update/delete their own presentations

---

### 3. `user_presentation_access`
Junction table linking users to presentations they can access.

**Columns:**
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, foreign key → users.id, not null)
- `presentation_id` (uuid, foreign key → presentations.id, not null)
- `granted_by` (uuid, foreign key → users.id, nullable) - Who granted access
- `granted_at` (timestamp, default: now())
- `can_edit` (boolean, default: false) - Whether user can edit
- `metadata` (jsonb, nullable) - Flexible JSON for future fields

**Indexes:**
- Primary key on `id`
- Unique index on (`user_id`, `presentation_id`)
- Index on `user_id`
- Index on `presentation_id`

**RLS:**
- Users can read their own access records
- Presentation owners can grant/revoke access

---

### 4. `presentation_instances`
Stores customized instances of presentations sent to recipients.

**Columns:**
- `id` (uuid, primary key, default: gen_random_uuid())
- `presentation_id` (uuid, foreign key → presentations.id, not null)
- `created_by` (uuid, foreign key → users.id, not null) - Who created this instance
- `recipient_name` (text, nullable) - Name of person receiving presentation
- `recipient_email` (text, nullable) - Email of recipient
- `store_link` (text, nullable) - Custom store/product link
- `customization_level` (text, default: 'simple') - 'simple' or 'advanced'
- `status` (text, default: 'draft') - 'draft', 'sent', 'viewed', 'completed'
- `sent_at` (timestamp, nullable) - When presentation was sent
- `viewed_at` (timestamp, nullable) - When recipient first viewed
- `completed_at` (timestamp, nullable) - When recipient completed
- `created_at` (timestamp, default: now())
- `updated_at` (timestamp, default: now())
- `custom_fields` (jsonb, nullable) - Flexible JSON for simple-level customizations
- `metadata` (jsonb, nullable) - Flexible JSON for future fields

**Indexes:**
- Primary key on `id`
- Index on `presentation_id`
- Index on `created_by`
- Index on `recipient_email`
- Index on `status`

**RLS:**
- Users can read/create/update their own instances
- Recipients can read instances sent to them (via token)

---

### 5. `custom_questions`
Stores custom questions added to presentation instances (advanced customization).

**Columns:**
- `id` (uuid, primary key, default: gen_random_uuid())
- `instance_id` (uuid, foreign key → presentation_instances.id, not null)
- `question_text` (text, not null) - The question to ask
- `question_type` (text, default: 'text') - 'text', 'multiple_choice', 'yes_no', 'rating'
- `position` (integer, not null) - Slide position where question appears
- `is_required` (boolean, default: false) - Whether answer is required
- `options` (jsonb, nullable) - For multiple_choice: array of option objects
- `created_at` (timestamp, default: now())
- `metadata` (jsonb, nullable) - Flexible JSON for future question types

**Indexes:**
- Primary key on `id`
- Index on `instance_id`
- Index on (`instance_id`, `position`)

**RLS:**
- Users can read questions for their instances
- Recipients can read questions for instances sent to them

---

### 6. `question_answers`
Stores answers to custom questions.

**Columns:**
- `id` (uuid, primary key, default: gen_random_uuid())
- `question_id` (uuid, foreign key → custom_questions.id, not null)
- `instance_id` (uuid, foreign key → presentation_instances.id, not null)
- `answer_text` (text, nullable) - Text answer (for text questions)
- `answer_value` (jsonb, nullable) - Structured answer (for multiple_choice, rating, etc.)
- `answered_at` (timestamp, default: now())
- `metadata` (jsonb, nullable) - Flexible JSON for future fields

**Indexes:**
- Primary key on `id`
- Unique index on `question_id` (one answer per question)
- Index on `instance_id`

**RLS:**
- Recipients can create/update their own answers
- Instance creators can read answers for their instances

---

## Extensibility Strategy

### Adding New Fields

1. **Simple Fields**: Add directly to the table
   ```sql
   ALTER TABLE presentations ADD COLUMN new_field TEXT;
   ```

2. **Optional/Complex Fields**: Use the `metadata` JSONB column
   ```typescript
   // In TypeScript
   const presentation = {
     ...baseFields,
     metadata: {
       ...existingMetadata,
       newFeature: { ... }
     }
   }
   ```

3. **New Tables**: Create new tables and link via foreign keys
   ```sql
   CREATE TABLE new_feature (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     presentation_id UUID REFERENCES presentations(id),
     ...
   );
   ```

### Migration Best Practices

1. Always add nullable columns first
2. Use `metadata` JSONB for experimental features
3. Create migrations in versioned files
4. Test migrations on staging first
5. Update TypeScript types alongside schema changes

---

## SQL Setup Scripts

See `supabase/migrations/` directory for versioned migration files.

---

## Relationships Diagram

```
users
  ├── presentations (created_by)
  ├── user_presentation_access (user_id)
  └── presentation_instances (created_by)

presentations
  ├── user_presentation_access (presentation_id)
  └── presentation_instances (presentation_id)

presentation_instances
  ├── custom_questions (instance_id)
  └── question_answers (instance_id)

custom_questions
  └── question_answers (question_id)
```

