This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Presentation System

A scalable, customizable presentation system with:
- **User Management**: Each user has their own presentations and instances
- **Two-Level Customization**: Simple field replacements or advanced custom questions
- **Frontend Templates**: Lightweight template system for hundreds of presentations
- **Supabase Integration**: Full database schema with Row Level Security
- **Extensible Architecture**: Easy to add new fields and features

## Quick Start

### 1. Setup Supabase

1. Create a Supabase project at https://supabase.com
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Get your project URL and anon key from Settings → API

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ASSET_BASE=your_asset_base_url
```

### 3. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Complete setup instructions
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Database structure and relationships
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture overview
- **[Expansion Guide](docs/EXPANSION_GUIDE.md)** - How to extend the system

## Project Structure

```
src/
├── lib/
│   ├── supabase/          # Supabase client and types
│   ├── services/          # Database service functions
│   └── presentations/     # Business logic
├── types/                 # TypeScript types
├── components/           # React components
└── data/presentations/    # Frontend templates

docs/                      # Documentation
supabase/migrations/       # Database migrations
```

## Features

- ✅ User authentication ready (Supabase Auth)
- ✅ Presentation template registry
- ✅ Simple customization (name, links, etc.)
- ✅ Advanced customization (custom questions)
- ✅ Instance tracking and analytics
- ✅ Extensible metadata system
- ✅ Type-safe database operations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
