import i18n from "i18next";
import { initReactI18next, Trans, useTranslation } from "react-i18next";

// Import English translations
import enCommon from "./locales/en/common.json";
import enOnboarding from "./locales/en/onboarding.json";
// Import French translations
import frCommon from "./locales/fr/common.json";
import frOnboarding from "./locales/fr/onboarding.json";
// Import Ukrainian translations
import ukCommon from "./locales/uk/common.json";
import ukOnboarding from "./locales/uk/onboarding.json";

export const defaultNS = "common";
export const fallbackLng = "en";
export const supportedLanguages = ["en", "uk", "fr"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const resources = {
	en: {
		common: enCommon,
		onboarding: enOnboarding,
	},
	uk: {
		common: ukCommon,
		onboarding: ukOnboarding,
	},
	fr: {
		common: frCommon,
		onboarding: frOnboarding,
	},
} as const;

export const languageNames: Record<SupportedLanguage, string> = {
	en: "English",
	uk: "Українська",
	fr: "Français",
};

/**
 * Initialize i18next with the provided configuration.
 * Call this once at the root of your application.
 *
 * @param lng - Initial language to use (defaults to "en")
 */
export function initI18n(lng: SupportedLanguage = "en") {
	if (i18n.isInitialized) {
		return i18n;
	}

	i18n.use(initReactI18next).init({
		lng,
		fallbackLng,
		defaultNS,
		resources,
		interpolation: {
			escapeValue: false, // React already escapes values
		},
		react: {
			useSuspense: false,
		},
	});

	return i18n;
}

/**
 * Change the current language.
 *
 * @param lng - The language code to switch to
 */
export function changeLanguage(lng: SupportedLanguage) {
	return i18n.changeLanguage(lng);
}

/**
 * Get the current language.
 */
export function getCurrentLanguage(): SupportedLanguage {
	return (i18n.language as SupportedLanguage) || fallbackLng;
}

/**
 * Check if a language is supported.
 */
export function isLanguageSupported(lng: string): lng is SupportedLanguage {
	return supportedLanguages.includes(lng as SupportedLanguage);
}

/**
 * Get browser's preferred language if supported, otherwise return fallback.
 */
export function getPreferredLanguage(): SupportedLanguage {
	if (typeof navigator === "undefined") {
		return fallbackLng;
	}

	const browserLang = navigator.language.split("-")[0] ?? "";
	return isLanguageSupported(browserLang) ? browserLang : fallbackLng;
}

// Re-export hooks and components from react-i18next
export { useTranslation, Trans };

// Export i18n instance for advanced usage
export { i18n };
