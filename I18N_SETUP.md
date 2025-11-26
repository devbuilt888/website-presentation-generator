# Internationalization (i18n) Setup

This project uses `next-intl` for internationalization, supporting English and Spanish throughout the entire application and presentations.

## Structure

### Translation Files
- `messages/en.json` - English translations
- `messages/es.json` - Spanish translations

Translations are organized by namespace:
- `common` - Common UI elements (buttons, labels, etc.)
- `nav` - Navigation items
- `auth` - Authentication pages
- `dashboard` - Dashboard components
- `presentations` - Presentation-related text
- `admin` - Admin panel
- `templates` - Template names and descriptions
- `presentationContent` - Presentation slide content

### Key Components

1. **I18nWrapper** (`src/components/I18nWrapper.tsx`)
   - Wraps the entire app and provides i18n context
   - Loads locale from localStorage
   - Dynamically imports translation messages

2. **LanguageSwitcher** (`src/components/LanguageSwitcher.tsx`)
   - Component for switching between English and Spanish
   - Available in presentations and throughout the app

3. **useTranslation Hook** (`src/hooks/useTranslation.ts`)
   - Custom hook for accessing translations
   - Provides `t()` function, `locale`, `changeLocale()`, `isSpanish`, `isEnglish`

## Usage

### In Components

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const t = useTranslations('dashboard');
  const { isSpanish, locale } = useTranslation();

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

### Translating Presentation Content

The system automatically translates presentation content based on the selected locale. The old `translateText` function still works but now uses the i18n system.

For presentation slides, translations are stored in:
```json
{
  "presentationContent": {
    "zinzino-mex": {
      "slide1": {
        "title": "Hello {{recipientName}}",
        "subtitle": "Discover Your Health Journey",
        "content": "..."
      }
    }
  }
}
```

### Adding New Translations

1. Add the key-value pair to both `messages/en.json` and `messages/es.json`
2. Use the translation key in your component:
   ```tsx
   const t = useTranslations('namespace');
   <p>{t('key')}</p>
   ```

### Language Switcher

The language switcher is automatically available in:
- Presentation viewers (all presentations)
- Can be added to any component by importing:
  ```tsx
  import LanguageSwitcher from '@/components/LanguageSwitcher';
  ```

## How It Works

1. User selects a language via LanguageSwitcher
2. Locale is saved to localStorage
3. Page reloads with new locale
4. I18nWrapper loads the appropriate translation file
5. All components using `useTranslations` receive the new translations

## Migration from Old System

The old translation system in `src/utils/translations.ts` is still functional and works alongside the new i18n system. The `translateText` function now respects the locale setting.

For new code, prefer using `useTranslations` from `next-intl` for better organization and type safety.

## Supported Locales

- `en` - English (default)
- `es` - Spanish

To add more locales:
1. Create `messages/{locale}.json`
2. Add locale to `src/i18n/config.ts`
3. Update LanguageSwitcher component

