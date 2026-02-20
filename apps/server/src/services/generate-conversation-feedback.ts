import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
	conversationFeedback,
	conversationMessage,
	conversationSession,
	db,
	eq,
} from "@english.now/db";
import { generateText, Output } from "ai";
import { z } from "zod";
import { openai } from "../utils/ai";
import s3Client from "../utils/r2";
import {
	assessPronunciation,
	type PronunciationAssessmentResult,
} from "./pronunciation-assessment";

const MIN_USER_MESSAGES = 3;

const feedbackAnalysisSchema = z.object({
	grammarScore: z
		.number()
		.min(0)
		.max(100)
		.describe("Grammar correctness score 0-100"),
	vocabularyScore: z
		.number()
		.min(0)
		.max(100)
		.describe("Vocabulary range and appropriateness score 0-100"),
	fluencyScore: z
		.number()
		.min(0)
		.max(100)
		.describe("Fluency and naturalness score 0-100"),
	summary: z
		.string()
		.describe(
			"2-3 sentence summary of the learner's performance in this conversation",
		),
	strengths: z
		.array(z.string())
		.describe("List of 2-4 specific strengths observed"),
	improvements: z
		.array(z.string())
		.describe("List of 2-4 specific areas for improvement"),
	corrections: z
		.array(
			z.object({
				original: z.string().describe("What the learner said"),
				corrected: z.string().describe("The corrected version"),
				explanation: z.string().describe("Brief explanation of the correction"),
				type: z.enum(["grammar", "vocabulary", "pronunciation", "fluency"]),
			}),
		)
		.describe("Specific corrections from the conversation"),
	vocabularySuggestions: z
		.array(z.string())
		.describe(
			"5-8 useful vocabulary words or phrases the learner could use to improve",
		),
});

async function downloadAudioFromR2(audioUrl: string): Promise<Buffer | null> {
	try {
		const url = new URL(audioUrl);
		const key = url.pathname.replace(/^\/_audio\//, "");

		const response = await s3Client.send(
			new GetObjectCommand({
				Bucket: "_audio",
				Key: key,
			}),
		);

		if (!response.Body) return null;
		const bytes = await response.Body.transformToByteArray();
		return Buffer.from(bytes);
	} catch (err) {
		console.error("[feedback] Failed to download audio:", audioUrl, err);
		return null;
	}
}

async function assessVoiceMessages(
	voiceMessages: { content: string; audioUrl: string }[],
): Promise<{
	pronunciationScore: number;
	results: PronunciationAssessmentResult[];
}> {
	const results: PronunciationAssessmentResult[] = [];

	for (const msg of voiceMessages) {
		try {
			const audioBuffer = await downloadAudioFromR2(msg.audioUrl);
			if (!audioBuffer) continue;

			const result = await assessPronunciation(audioBuffer, msg.content);
			results.push(result);
		} catch (err) {
			console.error(
				"[feedback] Pronunciation assessment failed for message",
				err,
			);
		}
	}

	if (results.length === 0) return { pronunciationScore: 0, results: [] };

	const avgScore =
		results.reduce((sum, r) => sum + r.pronunciationScore, 0) / results.length;

	return { pronunciationScore: Math.round(avgScore), results };
}

async function analyzeWithAI(
	userMessages: string[],
	assistantMessages: string[],
	level: string,
): Promise<z.infer<typeof feedbackAnalysisSchema>> {
	const conversationPairs = userMessages
		.map(
			(msg, i) =>
				`Learner: ${msg}${assistantMessages[i] ? `\nAssistant: ${assistantMessages[i]}` : ""}`,
		)
		.join("\n\n");

	const { experimental_output } = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: feedbackAnalysisSchema }),
		system: `You are an expert English language teacher analyzing a conversation practice session.
The learner is at a "${level}" level. Evaluate their performance strictly but fairly.

Scoring guidelines (0-100):
- Grammar: Assess sentence structure, tense usage, subject-verb agreement, articles, prepositions
- Vocabulary: Assess word choice variety, appropriateness, range for their level
- Fluency: Assess naturalness, coherence, response appropriateness, conversation flow

Be specific in corrections — quote exact phrases. Provide actionable improvement suggestions.
Strengths should highlight what the learner did well. Keep feedback encouraging but honest.`,
		prompt: `Analyze this conversation practice session:\n\n${conversationPairs}`,
		temperature: 0.3,
	});

	if (!experimental_output) {
		throw new Error("AI analysis returned no output");
	}

	return experimental_output;
}

export async function generateConversationFeedback(
	sessionId: string,
	userId: string,
): Promise<{ feedbackId: string }> {
	console.log(`[feedback] Starting feedback generation for session ${sessionId}`);

	const session = await db
		.select()
		.from(conversationSession)
		.where(eq(conversationSession.id, sessionId))
		.limit(1);

	if (!session[0] || session[0].userId !== userId) {
		throw new Error("Session not found or unauthorized");
	}

	const messages = await db
		.select()
		.from(conversationMessage)
		.where(eq(conversationMessage.sessionId, sessionId))
		.orderBy(conversationMessage.createdAt);

	const userMessages = messages.filter((m) => m.role === "user");
	const assistantMessages = messages.filter((m) => m.role === "assistant");

	if (userMessages.length < MIN_USER_MESSAGES) {
		throw new Error(
			`Not enough user messages (${userMessages.length}/${MIN_USER_MESSAGES})`,
		);
	}

	const voiceMessages = userMessages
		.filter((m): m is typeof m & { audioUrl: string } => !!m.audioUrl)
		.map((m) => ({ content: m.content, audioUrl: m.audioUrl }));

	const level = session[0].level ?? "beginner";

	// Run pronunciation assessment and AI analysis in parallel
	const [pronunciationResult, aiAnalysis] = await Promise.all([
		voiceMessages.length > 0
			? assessVoiceMessages(voiceMessages)
			: Promise.resolve({ pronunciationScore: 0, results: [] }),
		analyzeWithAI(
			userMessages.map((m) => m.content),
			assistantMessages.map((m) => m.content),
			level,
		),
	]);

	const hasPronunciation = pronunciationResult.results.length > 0;
	const pronunciationScore = hasPronunciation
		? pronunciationResult.pronunciationScore
		: null;

	// Weighted overall: if no voice messages, pronunciation is excluded
	const scores = [
		aiAnalysis.grammarScore,
		aiAnalysis.vocabularyScore,
		aiAnalysis.fluencyScore,
	];
	if (hasPronunciation && pronunciationScore != null) {
		scores.push(pronunciationScore);
	}
	const overallScore = Math.round(
		scores.reduce((a, b) => a + b, 0) / scores.length,
	);

	// Find existing feedback row (inserted by the /finish endpoint)
	const existingFeedback = await db
		.select()
		.from(conversationFeedback)
		.where(eq(conversationFeedback.sessionId, sessionId))
		.limit(1);

	if (!existingFeedback[0]) {
		throw new Error("Feedback record not found — was /finish called first?");
	}

	await db
		.update(conversationFeedback)
		.set({
			overallScore,
			grammarScore: aiAnalysis.grammarScore,
			vocabularyScore: aiAnalysis.vocabularyScore,
			fluencyScore: aiAnalysis.fluencyScore,
			pronunciationScore,
			summary: aiAnalysis.summary,
			strengths: aiAnalysis.strengths,
			improvements: aiAnalysis.improvements,
			corrections: aiAnalysis.corrections,
			vocabularySuggestions: aiAnalysis.vocabularySuggestions,
			status: "completed",
			completedAt: new Date(),
		})
		.where(eq(conversationFeedback.id, existingFeedback[0].id));

	console.log(
		`[feedback] Feedback completed for session ${sessionId} — overall=${overallScore}`,
	);

	return { feedbackId: existingFeedback[0].id };
}
