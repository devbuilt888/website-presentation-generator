# Expansion Guide: Adding New Fields and Features

This guide explains how to extend the system without breaking existing functionality.

## Table of Contents
1. [Adding Fields to Existing Tables](#adding-fields-to-existing-tables)
2. [Adding New Tables](#adding-new-tables)
3. [Extending Customization System](#extending-customization-system)
4. [Adding New Question Types](#adding-new-question-types)
5. [Frontend Template Updates](#frontend-template-updates)

---

## Adding Fields to Existing Tables

### Step 1: Update Database Schema

Create a new migration file in `supabase/migrations/`:

```sql
-- supabase/migrations/002_add_new_field.sql
ALTER TABLE presentations 
ADD COLUMN new_field TEXT;

-- Or with a default value
ALTER TABLE presentations 
ADD COLUMN new_field TEXT DEFAULT 'default_value';

-- Or nullable
ALTER TABLE presentations 
ADD COLUMN new_field TEXT NULL;
```

**Best Practice**: Always add nullable columns first, then populate data, then make required if needed.

### Step 2: Update TypeScript Types

Edit `src/lib/supabase/types.ts`:

```typescript
presentations: {
  Row: {
    // ... existing fields
    new_field: string | null; // Add here
  };
  Insert: {
    // ... existing fields
    new_field?: string | null; // Add here (optional in Insert)
  };
  Update: {
    // ... existing fields
    new_field?: string | null; // Add here (optional in Update)
  };
};
```

### Step 3: Update Application Types

Edit `src/types/presentation.ts` or relevant type file:

```typescript
export interface PresentationInstance {
  // ... existing fields
  newField?: string; // Add here
}
```

### Step 4: Update Components

Update any components that use the type:

```typescript
// Example: src/components/presentations/PresentationForm.tsx
const presentation = {
  // ... existing fields
  newField: formData.newField,
};
```

### Step 5: Test

1. Run migration on local/staging Supabase
2. Test TypeScript compilation
3. Test component rendering
4. Test database operations

---

## Adding New Tables

### Step 1: Create Migration

```sql
-- supabase/migrations/003_new_feature_table.sql
CREATE TABLE IF NOT EXISTS new_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_new_feature_presentation_id ON new_feature(presentation_id);
CREATE INDEX idx_new_feature_user_id ON new_feature(user_id);

-- Add RLS policies
ALTER TABLE new_feature ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own features" ON new_feature
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own features" ON new_feature
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own features" ON new_feature
  FOR UPDATE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_new_feature_updated_at BEFORE UPDATE ON new_feature
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 2: Add Types

Add to `src/lib/supabase/types.ts`:

```typescript
new_feature: {
  Row: {
    id: string;
    presentation_id: string;
    user_id: string;
    feature_data: Json | null;
    created_at: string;
    updated_at: string;
    metadata: Json | null;
  };
  Insert: {
    id?: string;
    presentation_id: string;
    user_id: string;
    feature_data?: Json | null;
    created_at?: string;
    updated_at?: string;
    metadata?: Json | null;
  };
  Update: {
    id?: string;
    presentation_id?: string;
    user_id?: string;
    feature_data?: Json | null;
    created_at?: string;
    updated_at?: string;
    metadata?: Json | null;
  };
};
```

### Step 3: Create Service Functions

Create `src/lib/services/new-feature.ts`:

```typescript
import { supabase } from '@/lib/supabase/client';

export async function createNewFeature(data: {
  presentation_id: string;
  user_id: string;
  feature_data?: any;
}) {
  const { data: feature, error } = await supabase
    .from('new_feature')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return feature;
}

export async function getNewFeatures(presentationId: string) {
  const { data, error } = await supabase
    .from('new_feature')
    .select('*')
    .eq('presentation_id', presentationId);
  
  if (error) throw error;
  return data;
}
```

---

## Extending Customization System

### Adding Simple Customization Fields

1. **Update Type** (`src/types/presentation.ts`):

```typescript
export interface SimpleCustomization {
  recipientName?: string;
  storeLink?: string;
  customMessage?: string;
  newField?: string; // Add here
}
```

2. **Update Customization Function** (`src/lib/presentations/customization.ts`):

```typescript
export function applySimpleCustomization(
  template: PresentationTemplate,
  customization: SimpleCustomization
): PresentationTemplate {
  // ... existing code
  
  // Add new placeholder replacement
  if (customization.newField) {
    result = result.replace(/\{\{newField\}\}/g, customization.newField);
  }
  
  // ... rest of function
}
```

3. **Update UI Component** (where customization form is):

```typescript
<input
  type="text"
  value={customization.newField || ''}
  onChange={(e) => setCustomization({ ...customization, newField: e.target.value })}
  placeholder="New Field"
/>
```

---

## Adding New Question Types

### Step 1: Update Database Constraint

```sql
-- supabase/migrations/004_add_question_type.sql
ALTER TABLE custom_questions 
DROP CONSTRAINT IF EXISTS custom_questions_question_type_check;

ALTER TABLE custom_questions 
ADD CONSTRAINT custom_questions_question_type_check 
CHECK (question_type IN ('text', 'multiple_choice', 'yes_no', 'rating', 'new_type'));
```

### Step 2: Update TypeScript Types

```typescript
// src/lib/supabase/types.ts
question_type: 'text' | 'multiple_choice' | 'yes_no' | 'rating' | 'new_type';

// src/types/presentation.ts
questionType: 'text' | 'multiple_choice' | 'yes_no' | 'rating' | 'new_type';
```

### Step 3: Create Question Component

Create `src/components/questions/NewTypeQuestion.tsx`:

```typescript
'use client';

import { CustomQuestion, QuestionAnswer } from '@/types/presentation';

interface NewTypeQuestionProps {
  question: CustomQuestion;
  answer?: QuestionAnswer;
  onAnswer: (answer: QuestionAnswer) => void;
}

export default function NewTypeQuestion({ question, answer, onAnswer }: NewTypeQuestionProps) {
  // Implement your question UI here
  return (
    <div>
      {/* Your question rendering logic */}
    </div>
  );
}
```

### Step 4: Update Question Renderer

Update `src/components/presentations/QuestionRenderer.tsx` (if it exists):

```typescript
switch (question.questionType) {
  case 'text':
    return <TextQuestion question={question} onAnswer={onAnswer} />;
  case 'new_type':
    return <NewTypeQuestion question={question} onAnswer={onAnswer} />;
  // ... other cases
}
```

---

## Frontend Template Updates

### Adding a New Presentation Template

1. **Create Template File** (`src/data/presentations/new-template.ts`):

```typescript
import { Presentation } from './types';

export const newTemplate: Presentation = {
  id: 'new-template-id',
  name: 'New Template',
  description: 'Description',
  slides: [
    // ... slide definitions
  ],
};
```

2. **Register Template** (`src/data/presentations/index.ts`):

```typescript
import { newTemplate } from './new-template';

export const presentations = [
  // ... existing templates
  newTemplate,
];
```

3. **Template is automatically available** via `getTemplate('new-template-id')`

---

## Using Metadata JSONB for Experimental Features

For features that might change, use the `metadata` JSONB column:

```typescript
// Store experimental data
const instance = {
  // ... standard fields
  metadata: {
    experimentalFeature: {
      field1: 'value1',
      field2: 'value2',
    },
  },
};

// Later, if feature is stable, migrate to dedicated column
```

---

## Testing Checklist

When adding new fields/features:

- [ ] Database migration runs successfully
- [ ] TypeScript types compile without errors
- [ ] Existing functionality still works
- [ ] New functionality works as expected
- [ ] RLS policies are correct
- [ ] Frontend components render correctly
- [ ] API endpoints handle new fields
- [ ] Documentation is updated

---

## Rollback Strategy

If you need to rollback:

1. **Database**: Create reverse migration
   ```sql
   ALTER TABLE presentations DROP COLUMN IF EXISTS new_field;
   ```

2. **Types**: Remove from TypeScript types

3. **Code**: Remove usage from components

4. **Test**: Verify rollback works

---

## Best Practices

1. **Always add nullable fields first** - easier to rollback
2. **Use migrations** - never modify schema directly
3. **Update types immediately** - keep DB and TS in sync
4. **Test incrementally** - test after each step
5. **Document changes** - update this guide if needed
6. **Use metadata JSONB** - for experimental features
7. **Version your migrations** - use sequential numbering

---

## Questions?

If you're unsure about how to add something:
1. Check existing examples in the codebase
2. Review this guide
3. Consider using `metadata` JSONB for flexibility
4. Test on staging first

