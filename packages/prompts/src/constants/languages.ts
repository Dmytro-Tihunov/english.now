export const SUPPORTED_LANGUAGES = ['en', 'ua'] as const;
export const SUPPORTED_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
export type SupportedLevel = typeof SUPPORTED_LEVELS[number];