import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { env } from "@english.now/env/server";
import ffmpegPath from "ffmpeg-static";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PhonemeResult = {
	phoneme: string;
	accuracyScore: number;
};

export type WordResult = {
	word: string;
	accuracyScore: number;
	errorType:
		| "None"
		| "Omission"
		| "Insertion"
		| "Mispronunciation"
		| "UnexpectedBreak"
		| "MissingBreak"
		| "Monotone";
	phonemes: PhonemeResult[];
};

export type PronunciationAssessmentResult = {
	accuracyScore: number;
	fluencyScore: number;
	completenessScore: number;
	prosodyScore: number;
	pronunciationScore: number;
	transcript: string;
	words: WordResult[];
};

// ─── Audio Conversion ─────────────────────────────────────────────────────────

function getFFmpegPath(): string {
	const p =
		typeof ffmpegPath === "string"
			? ffmpegPath
			: (ffmpegPath as unknown as { default: string }).default;
	if (!p || typeof p !== "string") {
		throw new Error("ffmpeg-static path not resolved");
	}
	return p;
}

function convertWebmToWav(webmBuffer: Buffer): Buffer {
	const tmpDir = os.tmpdir();
	const id = crypto.randomUUID();
	const inputPath = path.join(tmpDir, `${id}.webm`);
	const outputPath = path.join(tmpDir, `${id}.wav`);

	try {
		fs.writeFileSync(inputPath, webmBuffer);

		const ffmpeg = getFFmpegPath();
		execSync(
			`"${ffmpeg}" -i "${inputPath}" -ar 16000 -ac 1 -sample_fmt s16 "${outputPath}" -y`,
			{ stdio: "pipe" },
		);

		const wavBuffer = fs.readFileSync(outputPath);
		return wavBuffer;
	} finally {
		try {
			fs.unlinkSync(inputPath);
		} catch (_) {}
		try {
			fs.unlinkSync(outputPath);
		} catch (_) {}
	}
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export async function assessPronunciation(
	audioBuffer: Buffer,
	referenceText: string,
): Promise<PronunciationAssessmentResult> {
	const wavBuffer = convertWebmToWav(audioBuffer);

	const speechConfig = sdk.SpeechConfig.fromSubscription(
		env.AZURE_SPEECH_KEY,
		env.AZURE_SPEECH_REGION,
	);
	speechConfig.speechRecognitionLanguage = "en-US";

	const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
		referenceText,
		sdk.PronunciationAssessmentGradingSystem.HundredMark,
		sdk.PronunciationAssessmentGranularity.Phoneme,
		true,
	);
	pronunciationConfig.enableProsodyAssessment = true;

	const audioConfig = sdk.AudioConfig.fromWavFileInput(wavBuffer);
	const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
	pronunciationConfig.applyTo(recognizer);

	return new Promise<PronunciationAssessmentResult>((resolve, reject) => {
		recognizer.recognizeOnceAsync(
			(result) => {
				try {
					if (
						result.reason === sdk.ResultReason.RecognizedSpeech ||
						result.reason === sdk.ResultReason.NoMatch
					) {
						const paResult =
							sdk.PronunciationAssessmentResult.fromResult(result);

						const jsonStr = result.properties.getProperty(
							sdk.PropertyId.SpeechServiceResponse_JsonResult,
						);

						let words: WordResult[] = [];

						if (jsonStr) {
							const json = JSON.parse(jsonStr);
							const nBest = json?.NBest?.[0];
							if (nBest?.Words) {
								words = nBest.Words.map(
									(w: {
										Word: string;
										PronunciationAssessment: {
											AccuracyScore: number;
											ErrorType: string;
										};
										Phonemes?: {
											Phoneme: string;
											PronunciationAssessment: {
												AccuracyScore: number;
											};
										}[];
									}) => ({
										word: w.Word,
										accuracyScore:
											w.PronunciationAssessment?.AccuracyScore ?? 0,
										errorType: w.PronunciationAssessment?.ErrorType ?? "None",
										phonemes: (w.Phonemes ?? []).map(
											(p: {
												Phoneme: string;
												PronunciationAssessment: {
													AccuracyScore: number;
												};
											}) => ({
												phoneme: p.Phoneme,
												accuracyScore:
													p.PronunciationAssessment?.AccuracyScore ?? 0,
											}),
										),
									}),
								);
							}
						}

						resolve({
							accuracyScore: paResult.accuracyScore ?? 0,
							fluencyScore: paResult.fluencyScore ?? 0,
							completenessScore: paResult.completenessScore ?? 0,
							prosodyScore: paResult.prosodyScore ?? 0,
							pronunciationScore: paResult.pronunciationScore ?? 0,
							transcript: result.text || "",
							words,
						});
					} else {
						reject(
							new Error(
								`Speech recognition failed: ${sdk.ResultReason[result.reason]} - ${result.errorDetails}`,
							),
						);
					}
				} catch (err) {
					reject(err);
				} finally {
					recognizer.close();
				}
			},
			(error) => {
				recognizer.close();
				reject(new Error(`Speech recognition error: ${error}`));
			},
		);
	});
}
