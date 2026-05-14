export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

/** Idioma por defecto de la aplicación (primera visita y sin preferencia guardada). */
export const defaultLocale: Locale = 'es';
