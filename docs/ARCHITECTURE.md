# System Architecture

## Overview

This presentation system is designed to be:
- **Scalable**: Handles hundreds of presentations efficiently
- **Extensible**: Easy to add new fields and features
- **Customizable**: Two levels of customization (simple + advanced)
- **User-centric**: Each user has their own content and instances

## Architecture Layers

### 1. Database Layer (Supabase)

**Location**: `supabase/migrations/`

- PostgreSQL database with Row Level Security (RLS)
- 6 main tables: users, presentations, user_presentation_access, presentation_instances, custom_questions, question_answers
- All tables include `metadata` JSONB column for flexible expansion

**See**: `docs/DATABASE_SCHEMA.md`

### 2. Type System

**Location**: `src/lib/supabase/types.ts`, `src/types/presentation.ts`

- TypeScript types matching database schema
- Application-level types for business logic
- Type-safe database operations

### 3. Service Layer

**Location**: `src/lib/services/`

- `presentations.ts` - Presentation CRUD operations
- `instances.ts` - Instance management
- `questions.ts` - Question and answer handling

All services use the Supabase client and are type-safe.

### 4. Business Logic Layer

**Location**: `src/lib/presentations/`

- `template-registry.ts` - Frontend template management
- `customization.ts` - Customization system (simple + advanced)

### 5. Component Layer

**Location**: `src/components/`

- `presentations/PresentationRenderer.tsx` - Reusable presentation renderer
- `PresentationViewer.tsx` - Main presentation viewer (existing)
- Other presentation components

### 6. Frontend Templates

**Location**: `src/data/presentations/`

- Presentation templates stored in frontend
- Lightweight structure for hundreds of templates
- Registered via template registry

## Data Flow

### Creating a Customized Presentation

1. **User selects template** → `getTemplate(templateId)`
2. **User customizes** → `createCustomizedPresentation()`
   - Simple: Field replacements
   - Advanced: Add custom questions
3. **Save to database** → `createInstance()`
4. **Send to recipient** → `markInstanceAsSent()`
5. **Recipient views** → `markInstanceAsViewed()`
6. **Recipient answers questions** → `submitAnswer()`
7. **Complete** → `markInstanceAsCompleted()`

### Customization Levels

#### Simple Level
- Basic field replacements: `{{recipientName}}`, `{{storeLink}}`
- Stored in `custom_fields` JSONB
- Applied via `applySimpleCustomization()`

#### Advanced Level
- Custom questions inserted into presentation
- Questions stored in `custom_questions` table
- Answers stored in `question_answers` table
- Applied via `insertCustomQuestions()`

## File Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase client
│   │   └── types.ts           # Database types
│   ├── services/
│   │   ├── presentations.ts   # Presentation operations
│   │   ├── instances.ts       # Instance operations
│   │   └── questions.ts       # Question operations
│   └── presentations/
│       ├── template-registry.ts
│       └── customization.ts
├── types/
│   └── presentation.ts        # Application types
├── components/
│   └── presentations/
│       └── PresentationRenderer.tsx
└── data/
    └── presentations/         # Frontend templates

docs/
├── DATABASE_SCHEMA.md         # Database documentation
├── EXPANSION_GUIDE.md          # How to extend system
├── SETUP_GUIDE.md             # Setup instructions
└── ARCHITECTURE.md            # This file

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Initial schema
```

## Key Design Decisions

### 1. Frontend Templates

**Why**: Lightweight, fast, no database queries for templates
**Trade-off**: Templates must be deployed with frontend
**Solution**: Template registry for efficient management

### 2. Metadata JSONB

**Why**: Flexibility for experimental features
**Trade-off**: Less type safety
**Solution**: Migrate to dedicated columns when stable

### 3. Two-Level Customization

**Why**: Balance between simplicity and power
**Simple**: Quick, common use cases
**Advanced**: Full control with questions

### 4. Instance-Based System

**Why**: Each send is a separate instance with its own data
**Benefit**: Track individual sends, answers, status

## Extensibility

The system is designed for easy extension:

1. **New Fields**: Add to database → Update types → Update components
2. **New Tables**: Create migration → Add types → Create services
3. **New Question Types**: Update constraint → Add component → Update renderer
4. **New Templates**: Add to `src/data/presentations/` → Auto-registered

**See**: `docs/EXPANSION_GUIDE.md` for detailed instructions

## Security

- Row Level Security (RLS) on all tables
- Users can only access their own data
- Public presentations accessible to all
- Token-based access for recipients (future)

## Performance Considerations

- Templates loaded on-demand via registry
- Database queries use indexes
- RLS policies optimized
- Frontend templates cached in memory

## Future Enhancements

- Authentication UI
- Email sending for instances
- Analytics dashboard
- Template builder UI
- Multi-language support
- Real-time collaboration

