/**
 * Auto-translation script using OpenAI GPT-4o.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx tsx scripts/translate.ts
 *
 * This script:
 * 1. Reads all English translation files
 * 2. For each target language, finds missing or outdated keys
 * 3. Translates them using GPT-4o
 * 4. Writes the updated translation files
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../src/locales");

// Target languages to translate to (excluding source language 'en')
const TARGET_LANGUAGES = ["uk", "fr"];

// Source language
const SOURCE_LANGUAGE = "en";

type TranslationObject = Record<string, unknown>;

/**
 * Recursively find all missing or different keys between source and target
 */
function findMissingKeys(
	source: TranslationObject,
	target: TranslationObject,
	prefix = "",
): TranslationObject {
	const missing: TranslationObject = {};

	for (const [key, value] of Object.entries(source)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;

		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			const targetValue = target[key];
			const nestedTarget =
				typeof targetValue === "object" && targetValue !== null
					? (targetValue as TranslationObject)
					: {};
			const nestedMissing = findMissingKeys(
				value as TranslationObject,
				nestedTarget,
				fullKey,
			);
			if (Object.keys(nestedMissing).length > 0) {
				missing[key] = nestedMissing;
			}
		} else if (!(key in target)) {
			missing[key] = value;
		}
	}

	return missing;
}

/**
 * Deep merge two objects
 */
function deepMerge(
	target: TranslationObject,
	source: TranslationObject,
): TranslationObject {
	const result = { ...target };

	for (const [key, value] of Object.entries(source)) {
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			const targetValue = result[key];
			result[key] = deepMerge(
				typeof targetValue === "object" && targetValue !== null
					? (targetValue as TranslationObject)
					: {},
				value as TranslationObject,
			);
		} else {
			result[key] = value;
		}
	}

	return result;
}

/**
 * Translate using OpenAI API
 */
async function translateWithOpenAI(
	text: TranslationObject,
	sourceLang: string,
	targetLang: string,
): Promise<TranslationObject> {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("OPENAI_API_KEY environment variable is required");
	}

	const languageNames: Record<string, string> = {
		en: "English",
		uk: "Ukrainian",
		es: "Spanish",
		fr: "French",
		de: "German",
		it: "Italian",
		pl: "Polish",
		pt: "Portuguese",
		ru: "Russian",
		zh: "Chinese",
		ja: "Japanese",
	};

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content: `You are a professional translator. Translate the following JSON values from ${languageNames[sourceLang] || sourceLang} to ${languageNames[targetLang] || targetLang}. 
Keep the JSON structure and keys intact. Only translate the string values.
Preserve any interpolation placeholders like {{variable}}.
Maintain the same tone and style as the source text.
Return ONLY valid JSON, no markdown code blocks or explanations.`,
				},
				{
					role: "user",
					content: JSON.stringify(text, null, 2),
				},
			],
			temperature: 0.3,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${error}`);
	}

	const data = (await response.json()) as {
		choices: Array<{ message: { content: string } }>;
	};
	const content = data.choices[0]?.message?.content;

	if (!content) {
		throw new Error("No translation received from OpenAI");
	}

	// Parse the response, handling potential markdown code blocks
	let cleanContent = content.trim();
	if (cleanContent.startsWith("```")) {
		cleanContent = cleanContent
			.replace(/^```(?:json)?\n?/, "")
			.replace(/\n?```$/, "");
	}

	return JSON.parse(cleanContent) as TranslationObject;
}

/**
 * Main translation function
 */
async function translateAll() {
	console.log("🌍 Starting auto-translation...\n");

	const sourceDir = path.join(LOCALES_DIR, SOURCE_LANGUAGE);
	const namespaces = fs
		.readdirSync(sourceDir)
		.filter((f) => f.endsWith(".json"))
		.map((f) => f.replace(".json", ""));

	for (const targetLang of TARGET_LANGUAGES) {
		console.log(`\n📝 Processing ${targetLang}...`);
		const targetDir = path.join(LOCALES_DIR, targetLang);

		// Create target directory if it doesn't exist
		if (!fs.existsSync(targetDir)) {
			fs.mkdirSync(targetDir, { recursive: true });
		}

		for (const namespace of namespaces) {
			const sourcePath = path.join(sourceDir, `${namespace}.json`);
			const targetPath = path.join(targetDir, `${namespace}.json`);

			const source = JSON.parse(
				fs.readFileSync(sourcePath, "utf-8"),
			) as TranslationObject;
			const target = fs.existsSync(targetPath)
				? (JSON.parse(
						fs.readFileSync(targetPath, "utf-8"),
					) as TranslationObject)
				: {};

			const missing = findMissingKeys(source, target);

			if (Object.keys(missing).length === 0) {
				console.log(`  ✓ ${namespace}.json - up to date`);
				continue;
			}

			console.log(
				`  ⏳ ${namespace}.json - translating ${Object.keys(missing).length} keys...`,
			);

			try {
				const translated = await translateWithOpenAI(
					missing,
					SOURCE_LANGUAGE,
					targetLang,
				);
				const merged = deepMerge(target, translated);

				fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2) + "\n");
				console.log(`  ✓ ${namespace}.json - translated and saved`);
			} catch (error) {
				console.error(`  ✗ ${namespace}.json - failed:`, error);
			}
		}
	}

	console.log("\n✨ Translation complete!");
}

// Run the script
translateAll().catch(console.error);
