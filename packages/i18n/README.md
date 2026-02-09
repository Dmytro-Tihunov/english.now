# @english.now/i18n

Internationalization package for English.now using i18next.

## Installation

This package is already included in the monorepo. To use it in an app:

```json
{
  "dependencies": {
    "@english.now/i18n": "workspace:*"
  }
}
```

## Usage

### Initialize i18n (once at app root)

```typescript
import { initI18n, getPreferredLanguage } from "@english.now/i18n";

// Initialize with browser's preferred language
initI18n(getPreferredLanguage());
```

### Use translations in components

```tsx
import { useTranslation } from "@english.now/i18n";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("welcome.title")}</h1>
      <button>{t("actions.continue")}</button>
    </div>
  );
}
```

### Use a specific namespace

```tsx
import { useTranslation } from "@english.now/i18n";

function OnboardingStep() {
  const { t } = useTranslation("onboarding");

  return (
    <div>
      <h1>{t("level.title")}</h1>
      <p>{t("level.subtitle")}</p>
    </div>
  );
}
```

### Change language

```typescript
import { changeLanguage } from "@english.now/i18n";

// Change to Ukrainian
await changeLanguage("uk");
```

### Interpolation

```tsx
// In translation file:
// "greeting": "Hello, {{name}}!"

const { t } = useTranslation();
t("greeting", { name: "John" }); // "Hello, John!"
```

## Supported Languages

- `en` - English (source language)
- `uk` - Ukrainian

## Adding Translations

1. Add your translations to `src/locales/en/*.json`
2. Run the auto-translation script:

```bash
OPENAI_API_KEY=sk-... pnpm -F @english.now/i18n translate
```

This will automatically translate missing keys to all target languages using GPT-4o.

## File Structure

```
packages/i18n/
├── src/
│   ├── index.ts          # Main exports and i18n config
│   ├── i18n.d.ts         # TypeScript type declarations
│   └── locales/
│       ├── en/
│       │   ├── common.json      # Common UI strings
│       │   └── onboarding.json  # Onboarding-specific strings
│       └── uk/
│           ├── common.json
│           └── onboarding.json
├── scripts/
│   └── translate.ts      # Auto-translation script
└── package.json
```

## Type Safety

All translation keys are fully typed. Your IDE will autocomplete available keys:

```tsx
const { t } = useTranslation();
t("actions."); // IDE suggests: continue, back, skip, save, etc.
```

## Adding a New Language

1. Create a new directory in `src/locales/` (e.g., `src/locales/es/`)
2. Add the language to `supportedLanguages` in `src/index.ts`
3. Add the language name to `languageNames` in `src/index.ts`
4. Import the translation files in `src/index.ts` and add to `resources`
5. Run the translation script to auto-translate existing strings
