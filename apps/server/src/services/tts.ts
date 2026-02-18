import { env } from "@english.now/env/server";

/**
 * Generate TTS audio using Deepgram's Aura voices.
 * Returns raw audio as a Buffer, or null on failure.
 */
export async function generateTTS(
	text: string,
	voice = "aura-asteria-en",
): Promise<Buffer | null> {
	try {
		const response = await fetch(
			`https://api.deepgram.com/v1/speak?model=${voice}`,
			{
				method: "POST",
				headers: {
					Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text }),
			},
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Deepgram TTS error:", errorText);
			return null;
		}

		const arrayBuffer = await response.arrayBuffer();
		return Buffer.from(arrayBuffer);
	} catch (error) {
		console.error("TTS generation error:", error);
		return null;
	}
}

/**
 * Convenience wrapper that returns base64-encoded audio (used by conversation routes).
 */
export async function generateTTSBase64(
	text: string,
	voice = "aura-asteria-en",
): Promise<string | null> {
	const buffer = await generateTTS(text, voice);
	if (!buffer) return null;
	return buffer.toString("base64");
}
