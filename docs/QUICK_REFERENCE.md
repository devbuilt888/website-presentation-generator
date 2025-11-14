# Quick Reference Guide

Common operations and code snippets for the presentation system.

## Database Operations

### Get User's Presentations

```typescript
import { getUserPresentations } from '@/lib/services/presentations';

const presentations = await getUserPresentations(userId);
```

### Create a Presentation Instance

```typescript
import { createInstance } from '@/lib/services/instances';
import { getTemplate } from '@/lib/presentations/template-registry';
import { createCustomizedPresentation } from '@/lib/presentations/customization';

// Get template
const template = getTemplate('zinzino-mex');

// Create customized version
const customized = createCustomizedPresentation(template, {
  level: 'simple',
  simple: {
    recipientName: 'John Doe',
    storeLink: 'https://store.example.com',
  },
});

// Save to database
const instance = await createInstance({
  presentation_id: template.id,
  created_by: userId,
  recipient_name: 'John Doe',
  recipient_email: 'john@example.com',
  store_link: 'https://store.example.com',
  customization_level: 'simple',
  custom_fields: customized.customization.simple,
});
```

### Add Custom Questions (Advanced)

```typescript
import { createQuestions } from '@/lib/services/questions';

const questions = await createQuestions([
  {
    instance_id: instanceId,
    question_text: 'What is your main concern?',
    question_type: 'multiple_choice',
    position: 5, // After slide 5
    is_required: true,
    options: [
      { id: '1', text: 'Health', value: 'health' },
      { id: '2', text: 'Price', value: 'price' },
    ],
  },
]);
```

### Submit Answers

```typescript
import { submitAnswer } from '@/lib/services/questions';

await submitAnswer({
  question_id: questionId,
  instance_id: instanceId,
  answer_text: 'Health', // For text questions
  // OR
  answer_value: { selected: 'health' }, // For structured answers
});
```

## Customization

### Simple Customization

```typescript
import { applySimpleCustomization } from '@/lib/presentations/customization';

const customized = applySimpleCustomization(template, {
  recipientName: 'Jane Smith',
  storeLink: 'https://mystore.com',
  customMessage: 'Special offer for you!',
});
```

### Advanced Customization with Questions

```typescript
import { createCustomizedPresentation } from '@/lib/presentations/customization';

const customized = createCustomizedPresentation(template, {
  level: 'advanced',
  simple: {
    recipientName: 'John Doe',
  },
  questions: [
    {
      questionText: 'How interested are you?',
      questionType: 'rating',
      position: 10,
      isRequired: true,
    },
  ],
});
```

## Template Management

### Get Template

```typescript
import { getTemplate } from '@/lib/presentations/template-registry';

const template = getTemplate('zinzino-mex');
if (!template) {
  console.error('Template not found');
}
```

### List All Templates

```typescript
import { getAllTemplates } from '@/lib/presentations/template-registry';

const templates = getAllTemplates();
```

## Instance Status Management

```typescript
import {
  markInstanceAsSent,
  markInstanceAsViewed,
  markInstanceAsCompleted,
} from '@/lib/services/instances';

// When sending
await markInstanceAsSent(instanceId);

// When recipient views
await markInstanceAsViewed(instanceId);

// When recipient completes
await markInstanceAsCompleted(instanceId);
```

## Authentication (Supabase Auth)

```typescript
import { supabase } from '@/lib/supabase/client';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

## Placeholder Replacement

In your presentation templates, use placeholders:

```typescript
{
  title: 'Welcome {{recipientName}}!',
  content: 'Check out our store: {{storeLink}}',
}
```

These will be replaced when applying simple customization.

## Common Patterns

### Full Workflow: Create and Send Instance

```typescript
// 1. Get template
const template = getTemplate('zinzino-mex');

// 2. Customize
const customized = createCustomizedPresentation(template, {
  level: 'simple',
  simple: {
    recipientName: 'John Doe',
    storeLink: 'https://store.com',
  },
});

// 3. Create instance
const instance = await createInstance({
  presentation_id: template.id,
  created_by: userId,
  recipient_name: 'John Doe',
  recipient_email: 'john@example.com',
  store_link: 'https://store.com',
  customization_level: 'simple',
  custom_fields: customized.customization.simple,
});

// 4. Send (update status)
await markInstanceAsSent(instance.id);

// 5. Get shareable link (implement based on your routing)
const shareLink = `/presentation/instance/${instance.id}`;
```

### Validate Required Questions

```typescript
import { validateRequiredQuestions } from '@/lib/presentations/customization';

const validation = validateRequiredQuestions(customizedPresentation);
if (!validation.valid) {
  console.error('Missing answers:', validation.missing);
}
```

## Error Handling

```typescript
try {
  const instance = await createInstance(data);
} catch (error) {
  if (error.code === '23505') {
    // Unique constraint violation
    console.error('Instance already exists');
  } else {
    console.error('Error creating instance:', error);
  }
}
```

## Type Safety

All database operations are type-safe:

```typescript
import { PresentationInstance } from '@/types/presentation';

const instance: PresentationInstance = await getInstance(instanceId);
// TypeScript knows all available fields
console.log(instance.recipientName);
```

