import { env } from "@english.now/env/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	ChevronLeft,
	ChevronDown,
	ChevronUp,
	Loader2,
	Mic,
	MicOff,
	Pause,
	RefreshCw,
	Trophy,
	Volume2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/utils/trpc";

// ============================================
// ROUTE
// ============================================

export const Route = createFileRoute(
	"/_pronunciation/pronunciation/$sessionId",
)({
	component: PronunciationSessionPage,
});

// ============================================
// TYPES
// ============================================

type PracticeMode = "read-aloud" | "tongue-twisters";

type ReadAloudItem = {
	text: string;
	topic: string;
	phonemeFocus: string;
	tips: string;
};

type TongueTwisterItem = {
	text: string;
	speed: "slow" | "medium" | "fast";
	targetPhonemes: string[];
	tip: string;
};

type PhonemeResult = {
	phoneme: string;
	accuracyScore: number;
};

type WordResult = {
	word: string;
	correct: boolean;
	accuracyScore: number;
	errorType: string;
	phonemes: PhonemeResult[];
};

type AssessmentResult = {
	accuracyScore: number;
	fluencyScore: number;
	completenessScore: number;
	prosodyScore: number;
	pronunciationScore: number;
	transcript: string;
	words: WordResult[];
};

type AttemptResult = {
	attemptId: string;
	score: number;
	accuracyScore: number;
	fluencyScore: number;
	completenessScore: number;
	prosodyScore: number;
	words: WordResult[];
};

type WeakPhoneme = {
	phoneme: string;
	score: number;
	occurrences: number;
	exampleWords: string[];
};

type SessionSummary = {
	averageScore: number;
	averageAccuracy: number;
	averageFluency: number;
	averageProsody: number;
	averageCompleteness: number;
	totalAttempts: number;
	bestScore: number;
	worstScore: number;
	weakWords: string[];
	weakPhonemes: WeakPhoneme[];
	itemScores: { itemIndex: number; bestScore: number; attempts: number }[];
};

const MODE_INFO: Record<string, { name: string; icon: string }> = {
	"read-aloud": { name: "Read Aloud", icon: "📖" },
	"tongue-twisters": { name: "Tongue Twisters", icon: "👅" },
};

// ============================================
// HOOKS
// ============================================

function useVoiceRecorder() {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const streamRef = useRef<MediaStream | null>(null);

	const stopMediaStream = useCallback(() => {
		if (streamRef.current) {
			for (const track of streamRef.current.getTracks()) {
				track.stop();
			}
			streamRef.current = null;
		}
	}, []);

	const startRecording = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			streamRef.current = stream;

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "audio/webm;codecs=opus",
			});
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Error accessing microphone:", err);
		}
	}, []);

	const stopRecording = useCallback(async (): Promise<Blob | null> => {
		if (!mediaRecorderRef.current || !isRecording) return null;

		return new Promise<Blob | null>((resolve) => {
			const recorder = mediaRecorderRef.current;
			if (!recorder) {
				resolve(null);
				return;
			}

			recorder.onstop = () => {
				stopMediaStream();
				const blob = new Blob(audioChunksRef.current, {
					type: "audio/webm",
				});
				setIsRecording(false);
				resolve(blob);
			};

			recorder.stop();
		});
	}, [isRecording, stopMediaStream]);

	useEffect(() => {
		return () => {
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state !== "inactive"
			) {
				try {
					mediaRecorderRef.current.stop();
				} catch (_) {
					// ignore
				}
			}
			if (streamRef.current) {
				for (const track of streamRef.current.getTracks()) {
					track.stop();
				}
			}
		};
	}, []);

	return {
		isRecording,
		startRecording,
		stopRecording,
	};
}

function useTextToSpeech() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const cacheRef = useRef<Map<string, string>>(new Map());

	const stop = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		setIsSpeaking(false);
	}, []);

	const speak = useCallback(
		async (text: string) => {
			stop();

			const cached = cacheRef.current.get(text);
			if (cached) {
				const audio = new Audio(cached);
				audioRef.current = audio;
				audio.onplay = () => setIsSpeaking(true);
				audio.onended = () => setIsSpeaking(false);
				audio.onerror = () => setIsSpeaking(false);
				audio.play();
				return;
			}

			setIsLoading(true);
			try {
				const response = await fetch(
					`${env.VITE_SERVER_URL}/api/pronunciation/tts`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ text }),
					},
				);

				if (!response.ok) {
					throw new Error("TTS request failed");
				}

				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				cacheRef.current.set(text, url);

				const audio = new Audio(url);
				audioRef.current = audio;
				audio.onplay = () => setIsSpeaking(true);
				audio.onended = () => setIsSpeaking(false);
				audio.onerror = () => setIsSpeaking(false);
				audio.play();
			} catch (err) {
				console.error("TTS error:", err);
			} finally {
				setIsLoading(false);
			}
		},
		[stop],
	);

	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
			}
			for (const url of cacheRef.current.values()) {
				URL.revokeObjectURL(url);
			}
			cacheRef.current.clear();
		};
	}, []);

	return { isLoading, isSpeaking, speak, stop };
}

// ============================================
// ASSESSMENT API CALL
// ============================================

async function blobToBase64(blob: Blob): Promise<string> {
	const arrayBuffer = await blob.arrayBuffer();
	const bytes = new Uint8Array(arrayBuffer);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i] ?? 0);
	}
	return btoa(binary);
}

async function assessPronunciationApi(
	audioBlob: Blob,
	referenceText: string,
): Promise<AssessmentResult> {
	const audio = await blobToBase64(audioBlob);

	const response = await fetch(
		`${env.VITE_SERVER_URL}/api/pronunciation/assess`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ audio, referenceText }),
		},
	);

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		throw new Error(
			(err as { details?: string }).details ||
				"Pronunciation assessment failed",
		);
	}

	return response.json();
}

// ============================================
// SCORE COMPONENTS
// ============================================

function ScoreGauge({
	score,
	label,
	size = "lg",
}: {
	score: number;
	label: string;
	size?: "sm" | "lg";
}) {
	const getColor = () => {
		if (score >= 80) return "text-green-500";
		if (score >= 60) return "text-yellow-500";
		return "text-red-500";
	};

	const getTrackColor = () => {
		if (score >= 80) return "stroke-green-500";
		if (score >= 60) return "stroke-yellow-500";
		return "stroke-red-500";
	};

	const radius = size === "lg" ? 40 : 28;
	const strokeWidth = size === "lg" ? 6 : 4;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = circumference - (score / 100) * circumference;
	const viewBox = size === "lg" ? 100 : 70;

	return (
		<div className="flex flex-col items-center gap-1">
			<div className="relative">
				<svg
					width={viewBox}
					height={viewBox}
					viewBox={`0 0 ${viewBox} ${viewBox}`}
					className="-rotate-90"
					aria-hidden="true"
				>
					<title>{label} score</title>
					<circle
						cx={viewBox / 2}
						cy={viewBox / 2}
						r={radius}
						fill="none"
						strokeWidth={strokeWidth}
						className="stroke-muted"
					/>
					<circle
						cx={viewBox / 2}
						cy={viewBox / 2}
						r={radius}
						fill="none"
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={dashOffset}
						strokeLinecap="round"
						className={cn("transition-all duration-700", getTrackColor())}
					/>
				</svg>
				<div className="absolute inset-0 flex items-center justify-center">
					<span
						className={cn(
							"font-bold",
							getColor(),
							size === "lg" ? "text-xl" : "text-sm",
						)}
					>
						{Math.round(score)}
					</span>
				</div>
			</div>
			<span
				className={cn(
					"text-muted-foreground",
					size === "lg" ? "text-sm" : "text-xs",
				)}
			>
				{label}
			</span>
		</div>
	);
}

function ScoreBreakdown({
	accuracy,
	fluency,
	completeness,
	prosody,
}: {
	accuracy: number;
	fluency: number;
	completeness: number;
	prosody: number;
}) {
	return (
		<div className="flex items-center justify-center gap-6">
			<ScoreGauge score={accuracy} label="Accuracy" />
			<ScoreGauge score={fluency} label="Fluency" />
			<ScoreGauge score={completeness} label="Completeness" />
			<ScoreGauge score={prosody} label="Prosody" />
		</div>
	);
}

function OverallScore({ score }: { score: number }) {
	const getMessage = () => {
		if (score >= 90) return "Excellent!";
		if (score >= 80) return "Great job!";
		if (score >= 60) return "Good effort!";
		return "Keep practicing!";
	};

	const getColor = () => {
		if (score >= 80) return "text-green-500";
		if (score >= 60) return "text-yellow-500";
		return "text-red-500";
	};

	return (
		<div className="text-center">
			<div className={cn("font-bold text-5xl", getColor())}>
				{Math.round(score)}
			</div>
			<p className="mt-1 text-muted-foreground">{getMessage()}</p>
		</div>
	);
}

// ============================================
// WORD DETAIL VIEW (with phonemes)
// ============================================

function WordDetailView({ words }: { words: WordResult[] }) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	const getWordColor = (accuracyScore: number) => {
		if (accuracyScore >= 80)
			return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
		if (accuracyScore >= 60)
			return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
		return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
	};

	const getErrorLabel = (errorType: string) => {
		switch (errorType) {
			case "Omission":
				return "Omitted";
			case "Insertion":
				return "Extra word";
			case "Mispronunciation":
				return "Mispronounced";
			default:
				return null;
		}
	};

	return (
		<div className="space-y-2">
			<p className="font-medium text-muted-foreground text-sm">
				Word by word:
			</p>
			<div className="flex flex-wrap gap-2">
				{words.map((item, idx) => {
					const isExpanded = expandedIndex === idx;
					const errorLabel = getErrorLabel(item.errorType);

					return (
						<div key={`${item.word}-${idx}`} className="relative">
							<button
								type="button"
								onClick={() =>
									setExpandedIndex(isExpanded ? null : idx)
								}
								className={cn(
									"flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium text-lg transition-all",
									getWordColor(item.accuracyScore),
									item.phonemes.length > 0 && "cursor-pointer hover:opacity-80",
								)}
							>
								{item.word}
								<span className="ml-0.5 text-xs opacity-70">
									{Math.round(item.accuracyScore)}
								</span>
								{item.phonemes.length > 0 &&
									(isExpanded ? (
										<ChevronUp className="size-3" />
									) : (
										<ChevronDown className="size-3" />
									))}
							</button>

							{errorLabel && (
								<span className="-right-2 -top-2 absolute rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
									{errorLabel}
								</span>
							)}

							{isExpanded && item.phonemes.length > 0 && (
								<div className="absolute top-full left-0 z-10 mt-1 min-w-[140px] rounded-lg border bg-card p-2 shadow-lg">
									<p className="mb-1 font-medium text-muted-foreground text-xs">
										Phonemes:
									</p>
									<div className="space-y-1">
										{item.phonemes.map((p, pIdx) => (
											<div
												key={`${p.phoneme}-${pIdx}`}
												className="flex items-center justify-between gap-2"
											>
												<span className="font-mono text-sm">
													{p.phoneme}
												</span>
												<div className="flex items-center gap-1">
													<div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
														<div
															className={cn(
																"h-full rounded-full transition-all",
																p.accuracyScore >= 80
																	? "bg-green-500"
																	: p.accuracyScore >= 60
																		? "bg-yellow-500"
																		: "bg-red-500",
															)}
															style={{
																width: `${p.accuracyScore}%`,
															}}
														/>
													</div>
													<span className="w-6 text-right text-xs tabular-nums">
														{Math.round(p.accuracyScore)}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

// ============================================
// READ ALOUD MODE
// ============================================

function ReadAloudMode({
	sessionId,
	items,
	initialIndex,
	onComplete,
}: {
	sessionId: string;
	items: ReadAloudItem[];
	initialIndex: number;
	onComplete: (summary: SessionSummary) => void;
}) {
	const trpc = useTRPC();
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [isAssessing, setIsAssessing] = useState(false);
	const [result, setResult] = useState<AttemptResult | null>(null);
	const [assessmentResult, setAssessmentResult] =
		useState<AssessmentResult | null>(null);

	const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
	const { isLoading: isTTSLoading, isSpeaking, speak, stop } = useTextToSpeech();

	const currentItem = items[currentIndex];
	const isLastItem = currentIndex === items.length - 1;

	const submitAttempt = useMutation(
		trpc.pronunciation.submitAttempt.mutationOptions({}),
	);

	const completeSession = useMutation(
		trpc.pronunciation.completeSession.mutationOptions({
			onSuccess: (summary) => {
				onComplete(summary as SessionSummary);
			},
		}),
	);

	const handleRecord = async () => {
		if (isRecording) {
			const blob = await stopRecording();
			if (!blob || !currentItem) return;

			setIsAssessing(true);
			try {
				const assessment = await assessPronunciationApi(
					blob,
					currentItem.text,
				);
				setAssessmentResult(assessment);

				submitAttempt.mutate(
					{
						sessionId,
						itemIndex: currentIndex,
						transcript: assessment.transcript,
						accuracyScore: assessment.accuracyScore,
						fluencyScore: assessment.fluencyScore,
						completenessScore: assessment.completenessScore,
						prosodyScore: assessment.prosodyScore,
						pronunciationScore: assessment.pronunciationScore,
						words: assessment.words.map((w) => ({
							word: w.word,
							accuracyScore: w.accuracyScore,
							errorType: w.errorType,
							phonemes: w.phonemes,
						})),
					},
					{
						onSuccess: (data) => {
							setResult(data as AttemptResult);
						},
					},
				);
			} catch (err) {
				console.error("Assessment error:", err);
			} finally {
				setIsAssessing(false);
			}
		} else {
			setResult(null);
			setAssessmentResult(null);
			await startRecording();
		}
	};

	const handleNext = () => {
		if (isLastItem) {
			completeSession.mutate({ sessionId });
		} else {
			setCurrentIndex((prev) => prev + 1);
			setResult(null);
			setAssessmentResult(null);
		}
	};

	const handleListen = () => {
		if (!currentItem) return;
		if (isSpeaking) {
			stop();
		} else {
			speak(currentItem.text);
		}
	};

	if (!currentItem) return null;

	return (
		<div className="space-y-6">
			{/* Progress */}
			<div className="flex items-center justify-end">
				<div className="flex items-center gap-3">
					<div className="flex gap-1">
						{items.map((item, idx) => (
							<div
								key={item.text}
								className={cn(
									"h-2 w-8 rounded-full transition-colors",
									idx < currentIndex
										? "bg-green-500"
										: idx === currentIndex
											? "bg-primary"
											: "bg-muted",
								)}
							/>
						))}
					</div>
					<span className="text-muted-foreground text-sm">
						{currentIndex + 1} / {items.length}
					</span>
				</div>
			</div>

			{/* Text to read */}
			<div className="rounded-2xl border bg-linear-to-br from-blue-50 to-cyan-50 p-8 dark:from-blue-950/30 dark:to-cyan-950/30">
				<div className="mb-2 text-center">
					<span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-300">
						{currentItem.topic} - {currentItem.phonemeFocus}
					</span>
				</div>
				<p className="text-center font-medium text-2xl leading-relaxed">
					{currentItem.text}
				</p>
				<p className="mt-4 text-center text-muted-foreground text-sm italic">
					{currentItem.tips}
				</p>
			</div>

			{/* Listen button */}
			<div className="flex justify-center">
				<Button
					variant="outline"
					size="lg"
					onClick={handleListen}
					disabled={isTTSLoading}
					className="gap-2"
				>
					{isTTSLoading ? (
						<Loader2 className="size-5 animate-spin" />
					) : isSpeaking ? (
						<Pause className="size-5" />
					) : (
						<Volume2 className="size-5" />
					)}
					{isTTSLoading
						? "Loading audio..."
						: isSpeaking
							? "Stop"
							: "Listen to pronunciation"}
				</Button>
			</div>

			{/* Recording area */}
			<div className="space-y-4">
				<div className="flex justify-center">
					<Button
						size="lg"
						variant={isRecording ? "destructive" : "default"}
						onClick={handleRecord}
						disabled={isAssessing || submitAttempt.isPending}
						className={cn(
							"gap-2 transition-all",
							isRecording && "animate-pulse",
						)}
					>
						{isAssessing || submitAttempt.isPending ? (
							<Loader2 className="size-5 animate-spin" />
						) : isRecording ? (
							<MicOff className="size-5" />
						) : (
							<Mic className="size-5" />
						)}
						{isAssessing
							? "Analyzing pronunciation..."
							: submitAttempt.isPending
								? "Saving..."
								: isRecording
									? "Stop Recording"
									: "Start Recording"}
					</Button>
				</div>

				{/* Results */}
				{(assessmentResult || result) && (
					<div className="space-y-6 rounded-2xl border bg-card p-6">
						<OverallScore
							score={
								assessmentResult?.pronunciationScore ?? result?.score ?? 0
							}
						/>

						<ScoreBreakdown
							accuracy={
								assessmentResult?.accuracyScore ??
								result?.accuracyScore ??
								0
							}
							fluency={
								assessmentResult?.fluencyScore ??
								result?.fluencyScore ??
								0
							}
							completeness={
								assessmentResult?.completenessScore ??
								result?.completenessScore ??
								0
							}
							prosody={
								assessmentResult?.prosodyScore ??
								result?.prosodyScore ??
								0
							}
						/>

						{assessmentResult?.transcript && (
							<div className="rounded-xl bg-muted/50 p-3">
								<p className="text-center text-muted-foreground text-xs">
									What we heard:
								</p>
								<p className="mt-1 text-center">
									{assessmentResult.transcript}
								</p>
							</div>
						)}

						<WordDetailView
							words={assessmentResult?.words ?? result?.words ?? []}
						/>

						<div className="flex justify-center gap-4">
							<Button
								variant="outline"
								onClick={() => {
									setResult(null);
									setAssessmentResult(null);
								}}
								className="gap-2"
							>
								<RefreshCw className="size-4" />
								Try Again
							</Button>
							<Button
								onClick={handleNext}
								disabled={completeSession.isPending}
								className="gap-2"
							>
								{completeSession.isPending ? (
									<Loader2 className="size-4 animate-spin" />
								) : isLastItem ? (
									<Trophy className="size-4" />
								) : (
									<ArrowRight className="size-4" />
								)}
								{isLastItem ? "Finish" : "Next"}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

// ============================================
// TONGUE TWISTERS MODE
// ============================================

function TongueTwistersMode({
	sessionId,
	items,
	initialIndex,
	onComplete,
}: {
	sessionId: string;
	items: TongueTwisterItem[];
	initialIndex: number;
	onComplete: (summary: SessionSummary) => void;
}) {
	const trpc = useTRPC();
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [attempts, setAttempts] = useState(0);
	const [bestScore, setBestScore] = useState(0);
	const [isAssessing, setIsAssessing] = useState(false);
	const [result, setResult] = useState<AttemptResult | null>(null);
	const [assessmentResult, setAssessmentResult] =
		useState<AssessmentResult | null>(null);

	const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
	const { isLoading: isTTSLoading, isSpeaking, speak, stop } = useTextToSpeech();

	const current = items[currentIndex];
	const isLastItem = currentIndex === items.length - 1;

	const submitAttempt = useMutation(
		trpc.pronunciation.submitAttempt.mutationOptions({}),
	);

	const completeSession = useMutation(
		trpc.pronunciation.completeSession.mutationOptions({
			onSuccess: (summary) => {
				onComplete(summary as SessionSummary);
			},
		}),
	);


	const handleRecord = async () => {
		if (isRecording) {
			const blob = await stopRecording();
			if (!blob || !current) return;

			setIsAssessing(true);
			try {
				const assessment = await assessPronunciationApi(
					blob,
					current.text,
				);
				setAssessmentResult(assessment);

				submitAttempt.mutate(
					{
						sessionId,
						itemIndex: currentIndex,
						transcript: assessment.transcript,
						accuracyScore: assessment.accuracyScore,
						fluencyScore: assessment.fluencyScore,
						completenessScore: assessment.completenessScore,
						prosodyScore: assessment.prosodyScore,
						pronunciationScore: assessment.pronunciationScore,
						words: assessment.words.map((w) => ({
							word: w.word,
							accuracyScore: w.accuracyScore,
							errorType: w.errorType,
							phonemes: w.phonemes,
						})),
					},
					{
						onSuccess: (data) => {
							const typedData = data as AttemptResult;
							setResult(typedData);
							setAttempts((prev) => prev + 1);
							if (typedData.score > bestScore) {
								setBestScore(typedData.score);
							}
						},
					},
				);
			} catch (err) {
				console.error("Assessment error:", err);
			} finally {
				setIsAssessing(false);
			}
		} else {
			setResult(null);
			setAssessmentResult(null);
			await startRecording();
		}
	};

	const handleNext = () => {
		if (isLastItem) {
			completeSession.mutate({ sessionId });
		} else {
			setCurrentIndex((prev) => prev + 1);
			setResult(null);
			setAssessmentResult(null);
			setAttempts(0);
			setBestScore(0);
		}
	};

	const handleListen = () => {
		if (!current) return;
		if (isSpeaking) {
			stop();
		} else {
			speak(current.text);
		}
	};

	if (!current) return null;

	return (
		<div className="space-y-6">
			{/* Progress */}
			<div className="flex items-center justify-end">
				<div className="flex items-center gap-4 text-sm">
					<div className="flex gap-1">
						{items.map((item, idx) => (
							<div
								key={item.text}
								className={cn(
									"h-2 w-8 rounded-full transition-colors",
									idx < currentIndex
										? "bg-green-500"
										: idx === currentIndex
											? "bg-primary"
											: "bg-muted",
								)}
							/>
						))}
					</div>
					<span className="text-muted-foreground">Attempts: {attempts}</span>
					<span className="font-medium text-green-600">
						Best: {bestScore}%
					</span>
				</div>
			</div>

			{/* Tongue twister card */}
			<div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-purple-50 to-pink-50 p-8 dark:from-purple-950/30 dark:to-pink-950/30">
				<div className="absolute top-4 right-4 flex items-center gap-2">
					<span
						className={cn(
							"rounded-full px-3 py-1 font-medium text-xs",
							current.speed === "slow" && "bg-green-100 text-green-700",
							current.speed === "medium" &&
								"bg-yellow-100 text-yellow-700",
							current.speed === "fast" && "bg-red-100 text-red-700",
						)}
					>
						{current.speed} pace
					</span>
				</div>
				<div className="mb-3 flex flex-wrap justify-center gap-1">
					{current.targetPhonemes.map((phoneme) => (
						<span
							key={phoneme}
							className="rounded-full bg-purple-100 px-2 py-0.5 font-mono text-purple-700 text-xs dark:bg-purple-900/30 dark:text-purple-300"
						>
							{phoneme}
						</span>
					))}
				</div>
				<div className="flex items-center justify-center pt-2">
					<span className="text-5xl">👅</span>
				</div>
				<p className="mt-4 text-center font-medium text-2xl leading-relaxed">
					{current.text}
				</p>
				<p className="mt-4 text-center text-muted-foreground text-sm italic">
					{current.tip}
				</p>
			</div>

			{/* Controls */}
			<div className="flex flex-col items-center gap-4">
				<Button
					variant="outline"
					size="lg"
					onClick={handleListen}
					disabled={isTTSLoading}
					className="gap-2"
				>
					{isTTSLoading ? (
						<Loader2 className="size-5 animate-spin" />
					) : isSpeaking ? (
						<Pause className="size-5" />
					) : (
						<Volume2 className="size-5" />
					)}
					{isTTSLoading
						? "Loading audio..."
						: isSpeaking
							? "Stop"
							: "Listen first"}
				</Button>

				<Button
					size="lg"
					variant={isRecording ? "destructive" : "default"}
					onClick={handleRecord}
					disabled={isAssessing || submitAttempt.isPending}
					className={cn("gap-2", isRecording && "animate-pulse")}
				>
					{isAssessing || submitAttempt.isPending ? (
						<Loader2 className="size-5 animate-spin" />
					) : isRecording ? (
						<MicOff className="size-5" />
					) : (
						<Mic className="size-5" />
					)}
					{isAssessing
						? "Analyzing..."
						: submitAttempt.isPending
							? "Saving..."
							: isRecording
								? "Stop"
								: "Record"}
				</Button>
			</div>

			{/* Results */}
			{(assessmentResult || result) && (
				<div className="space-y-6 rounded-2xl border bg-card p-6">
					<OverallScore
						score={
							assessmentResult?.pronunciationScore ?? result?.score ?? 0
						}
					/>

					<ScoreBreakdown
						accuracy={
							assessmentResult?.accuracyScore ??
							result?.accuracyScore ??
							0
						}
						fluency={
							assessmentResult?.fluencyScore ??
							result?.fluencyScore ??
							0
						}
						completeness={
							assessmentResult?.completenessScore ??
							result?.completenessScore ??
							0
						}
						prosody={
							assessmentResult?.prosodyScore ??
							result?.prosodyScore ??
							0
						}
					/>

					{assessmentResult?.transcript && (
						<div className="rounded-xl bg-muted/50 p-3">
							<p className="text-center text-muted-foreground text-xs">
								What we heard:
							</p>
							<p className="mt-1 text-center">
								{assessmentResult.transcript}
							</p>
						</div>
					)}

					<WordDetailView
						words={assessmentResult?.words ?? result?.words ?? []}
					/>

					<div className="flex justify-center gap-4">
						<Button
							variant="outline"
							onClick={() => {
								setResult(null);
								setAssessmentResult(null);
							}}
							className="gap-2"
						>
							<RefreshCw className="size-4" />
							Try Again
						</Button>
						<Button
							onClick={handleNext}
							disabled={completeSession.isPending}
							className="gap-2"
						>
							{completeSession.isPending ? (
								<Loader2 className="size-4 animate-spin" />
							) : isLastItem ? (
								<Trophy className="size-4" />
							) : (
								<ArrowRight className="size-4" />
							)}
							{isLastItem ? "Finish" : "Next Twister"}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

// ============================================
// WEAK PHONEMES SECTION
// ============================================

function WeakPhonemesSection({ phonemes }: { phonemes: WeakPhoneme[] }) {
	if (phonemes.length === 0) return null;

	return (
		<div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20">
			<h3 className="mb-3 font-semibold text-lg text-orange-700 dark:text-orange-300">
				Phonemes to Practice
			</h3>
			<div className="space-y-3">
				{phonemes.map((p) => (
					<div
						key={p.phoneme}
						className="flex items-center gap-3 rounded-xl bg-orange-100/50 p-3 dark:bg-orange-900/20"
					>
						<span className="flex size-10 items-center justify-center rounded-lg bg-orange-200 font-bold font-mono text-lg text-orange-800 dark:bg-orange-800 dark:text-orange-200">
							{p.phoneme}
						</span>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-orange-200 dark:bg-orange-800">
									<div
										className={cn(
											"h-full rounded-full",
											p.score >= 60
												? "bg-yellow-500"
												: "bg-red-500",
										)}
										style={{ width: `${p.score}%` }}
									/>
								</div>
								<span className="font-bold text-sm tabular-nums">
									{p.score}
								</span>
							</div>
							{p.exampleWords.length > 0 && (
								<p className="mt-1 text-muted-foreground text-xs">
									in:{" "}
									{p.exampleWords.map((w, i) => (
										<span key={w}>
											<span className="font-medium">{w}</span>
											{i < p.exampleWords.length - 1 ? ", " : ""}
										</span>
									))}
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ============================================
// SESSION REVIEW
// ============================================

function SessionReview({
	summary,
	mode,
	difficulty,
	items,
}: {
	summary: SessionSummary;
	mode: string;
	difficulty: string;
	items: ReadAloudItem[] | TongueTwisterItem[];
}) {
	const navigate = useNavigate();
	const modeInfo = MODE_INFO[mode];

	return (
		<div className="space-y-6">
			<div className="text-center">
				<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
					<Trophy className="size-8 text-primary" />
				</div>
				<h2 className="font-bold font-lyon text-3xl tracking-tight">
					Session Complete
				</h2>
				<p className="mt-1 text-muted-foreground">
					{modeInfo?.name ?? mode} - {difficulty}
				</p>
			</div>

			{/* Overall Score */}
			<div className="rounded-2xl border bg-card p-8">
				<OverallScore score={summary.averageScore} />

				{/* Score Breakdown */}
				{(summary.averageAccuracy > 0 ||
					summary.averageFluency > 0 ||
					summary.averageProsody > 0 ||
					summary.averageCompleteness > 0) && (
					<div className="mt-6 border-t pt-6">
						<ScoreBreakdown
							accuracy={summary.averageAccuracy}
							fluency={summary.averageFluency}
							completeness={summary.averageCompleteness}
							prosody={summary.averageProsody}
						/>
					</div>
				)}

				<div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
					<div className="text-center">
						<p className="font-bold text-2xl text-green-600">
							{summary.bestScore}%
						</p>
						<p className="text-muted-foreground text-sm">Best Score</p>
					</div>
					<div className="text-center">
						<p className="font-bold text-2xl">{summary.totalAttempts}</p>
						<p className="text-muted-foreground text-sm">Total Attempts</p>
					</div>
					<div className="text-center">
						<p className="font-bold text-2xl text-red-500">
							{summary.worstScore}%
						</p>
						<p className="text-muted-foreground text-sm">Lowest Score</p>
					</div>
				</div>
			</div>

			{/* Weak Phonemes */}
			{summary.weakPhonemes && (
				<WeakPhonemesSection phonemes={summary.weakPhonemes} />
			)}

			{/* Per-item breakdown */}
			<div className="rounded-2xl border bg-card p-6">
				<h3 className="mb-4 font-semibold text-lg">Item Breakdown</h3>
				<div className="space-y-3">
					{summary.itemScores.map((itemScore) => {
						const item = items[itemScore.itemIndex];
						const text =
							item ? item.text : `Item ${itemScore.itemIndex + 1}`;
						const truncated =
							text.length > 60
								? `${text.substring(0, 60)}...`
								: text;

						return (
							<div
								key={itemScore.itemIndex}
								className="flex items-center justify-between rounded-xl bg-muted/50 p-3"
							>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm">{truncated}</p>
									<p className="text-muted-foreground text-xs">
										{itemScore.attempts} attempt
										{itemScore.attempts !== 1 ? "s" : ""}
									</p>
								</div>
								<div
									className={cn(
										"ml-4 shrink-0 font-bold text-lg",
										itemScore.bestScore >= 80
											? "text-green-500"
											: itemScore.bestScore >= 60
												? "text-yellow-500"
												: "text-red-500",
									)}
								>
									{itemScore.bestScore}%
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Weak words */}
			{summary.weakWords.length > 0 && (
				<div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
					<h3 className="mb-3 font-semibold text-lg text-red-700 dark:text-red-300">
						Words to Practice
					</h3>
					<div className="flex flex-wrap gap-2">
						{summary.weakWords.map((word) => (
							<span
								key={word}
								className="rounded-lg bg-red-100 px-3 py-1.5 font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300"
							>
								{word}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Actions */}
			<div className="flex justify-center gap-4">
				<Button
					variant="outline"
					onClick={() => navigate({ to: "/pronunciation" })}
					className="gap-2"
				>
					<ChevronLeft className="size-4" />
					Back to Modes
				</Button>
				<Button
					onClick={() =>
						navigate({
							to: "/pronunciation",
							search: { mode },
						})
					}
					className="gap-2"
				>
					<RefreshCw className="size-4" />
					Practice Again
				</Button>
			</div>
		</div>
	);
}

// ============================================
// MAIN SESSION PAGE
// ============================================

function PronunciationSessionPage() {
	const { sessionId } = Route.useParams();
	const navigate = useNavigate();
	const trpc = useTRPC();

	const [view, setView] = useState<"practice" | "review">("practice");
	const [summary, setSummary] = useState<SessionSummary | null>(null);

	const {
		data: sessionData,
		isLoading,
		error,
	} = useQuery(trpc.pronunciation.getSession.queryOptions({ sessionId }));

	// Redirect to pronunciation page if session not found
	useEffect(() => {
		if (error) {
			navigate({ to: "/pronunciation" });
		}
	}, [error, navigate]);

	// If session is already completed, show review
	useEffect(() => {
		if (sessionData?.status === "completed" && sessionData.summary) {
			setSummary(sessionData.summary as SessionSummary);
			setView("review");
		}
	}, [sessionData]);

	const handleComplete = (sessionSummary: SessionSummary) => {
		setSummary(sessionSummary);
		setView("review");
	};

	if (isLoading) {
		return (
			<div className="container mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-8">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="size-8 animate-spin text-primary" />
					<p className="text-muted-foreground">Loading session...</p>
				</div>
			</div>
		);
	}

	if (!sessionData) {
		return null;
	}

	const mode = sessionData.mode as PracticeMode;
	const items = sessionData.items as ReadAloudItem[] | TongueTwisterItem[];
	const modeInfo = MODE_INFO[mode];

	// Figure out initial index from existing attempts
	const completedIndices = new Set(
		sessionData.attempts.map((a) => a.itemIndex),
	);
	let initialIndex = 0;
	for (let i = 0; i < items.length; i++) {
		if (!completedIndices.has(i)) {
			initialIndex = i;
			break;
		}
		if (i === items.length - 1) {
			initialIndex = i;
		}
	}

	return (
		<div className="min-h-screen pb-12">
			<div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
				{view === "practice" && (
					<>
						<div className="mb-8">
							<h1 className="font-bold font-lyon text-4xl tracking-tight">
								{modeInfo?.icon} {modeInfo?.name ?? mode}
							</h1>
							<p className="mt-2 text-muted-foreground capitalize">
								{sessionData.difficulty} level
							</p>
						</div>

						<div className="fade-in slide-in-from-bottom-4 animate-in duration-300">
							{mode === "read-aloud" && (
								<ReadAloudMode
									sessionId={sessionId}
									items={items as ReadAloudItem[]}
									initialIndex={initialIndex}
									onComplete={handleComplete}
								/>
							)}
							{mode === "tongue-twisters" && (
								<TongueTwistersMode
									sessionId={sessionId}
									items={items as TongueTwisterItem[]}
									initialIndex={initialIndex}
									onComplete={handleComplete}
								/>
							)}
						</div>
					</>
				)}

				{view === "review" && summary && (
					<div className="fade-in slide-in-from-bottom-4 animate-in duration-300">
						<SessionReview
							summary={summary}
							mode={mode}
							difficulty={sessionData.difficulty}
							items={items}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
