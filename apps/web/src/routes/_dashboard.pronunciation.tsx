import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Check,
	Mic,
	MicOff,
	Pause,
	Play,
	RefreshCw,
	Volume2,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dashboard/pronunciation")({
	component: PronunciationPage,
});

// ============================================
// DATA
// ============================================

type PracticeMode =
	| "read-aloud"
	| "tongue-twisters"
	| "minimal-pairs"
	| "shadowing";

const MODES = [
	{
		id: "read-aloud" as const,
		name: "Read Aloud",
		icon: "📖",
		description: "Read text and get instant feedback",
		color: "from-blue-500 to-cyan-500",
	},
	{
		id: "tongue-twisters" as const,
		name: "Tongue Twisters",
		icon: "👅",
		description: "Challenge yourself with tricky phrases",
		color: "from-purple-500 to-pink-500",
	},
	{
		id: "minimal-pairs" as const,
		name: "Minimal Pairs",
		icon: "👂",
		description: "Master similar sounding words",
		color: "from-orange-500 to-red-500",
	},
	{
		id: "shadowing" as const,
		name: "Shadowing",
		icon: "🎧",
		description: "Listen and repeat immediately",
		color: "from-green-500 to-emerald-500",
	},
];

const READ_ALOUD_TEXTS = {
	beginner: [
		"Hello, how are you today?",
		"The weather is nice outside.",
		"I like to read books.",
		"Can you help me please?",
		"Thank you very much.",
	],
	intermediate: [
		"I would appreciate it if you could help me with this task.",
		"The conference will be held next Thursday afternoon.",
		"She has been working on this project for three months.",
		"Could you please repeat that more slowly?",
		"I'm looking forward to meeting you soon.",
	],
	advanced: [
		"The technological advancements of the twenty-first century have revolutionized communication.",
		"Despite the challenging circumstances, the team persevered and achieved remarkable results.",
		"The phenomenon of globalization has significantly impacted international trade relationships.",
		"Sustainability initiatives require collaborative efforts from both governments and corporations.",
		"The intricate relationship between economics and environmental policy demands careful consideration.",
	],
};

const TONGUE_TWISTERS = {
	beginner: [
		{ text: "Red lorry, yellow lorry.", speed: "slow" },
		{ text: "She sees cheese.", speed: "slow" },
		{ text: "Fresh French fish.", speed: "slow" },
		{ text: "Six sticky sticks.", speed: "slow" },
		{ text: "Toy boat. Toy boat. Toy boat.", speed: "medium" },
	],
	intermediate: [
		{ text: "She sells seashells by the seashore.", speed: "medium" },
		{ text: "Peter Piper picked a peck of pickled peppers.", speed: "medium" },
		{ text: "How much wood would a woodchuck chuck?", speed: "medium" },
		{
			text: "I scream, you scream, we all scream for ice cream.",
			speed: "medium",
		},
		{ text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.", speed: "fast" },
	],
	advanced: [
		{ text: "The sixth sick sheikh's sixth sheep's sick.", speed: "fast" },
		{ text: "Pad kid poured curd pulled cold.", speed: "fast" },
		{
			text: "Brisk brave brigadiers brandished broad bright blades.",
			speed: "fast",
		},
		{ text: "How can a clam cram in a clean cream can?", speed: "fast" },
		{ text: "Six Czech cricket critics.", speed: "fast" },
	],
};

const MINIMAL_PAIRS = [
	{ word1: "ship", word2: "sheep", phoneme: "/ɪ/ vs /iː/", category: "vowels" },
	{ word1: "bed", word2: "bad", phoneme: "/e/ vs /æ/", category: "vowels" },
	{ word1: "full", word2: "fool", phoneme: "/ʊ/ vs /uː/", category: "vowels" },
	{ word1: "cat", word2: "cut", phoneme: "/æ/ vs /ʌ/", category: "vowels" },
	{
		word1: "think",
		word2: "sink",
		phoneme: "/θ/ vs /s/",
		category: "consonants",
	},
	{
		word1: "three",
		word2: "tree",
		phoneme: "/θ/ vs /t/",
		category: "consonants",
	},
	{ word1: "van", word2: "fan", phoneme: "/v/ vs /f/", category: "consonants" },
	{
		word1: "light",
		word2: "right",
		phoneme: "/l/ vs /r/",
		category: "consonants",
	},
	{
		word1: "very",
		word2: "berry",
		phoneme: "/v/ vs /b/",
		category: "consonants",
	},
	{ word1: "wet", word2: "vet", phoneme: "/w/ vs /v/", category: "consonants" },
];

const SHADOWING_TEXTS = {
	beginner: [
		"Nice to meet you.",
		"Where are you from?",
		"I don't understand.",
		"Can you say that again?",
		"That sounds great!",
	],
	intermediate: [
		"I've been meaning to ask you something.",
		"What do you think about that idea?",
		"Let me know if you need any help.",
		"I completely agree with you on that.",
		"That's an interesting point of view.",
	],
	advanced: [
		"I couldn't have put it better myself.",
		"That's easier said than done, isn't it?",
		"I was under the impression that we had agreed on this.",
		"For what it's worth, I think you made the right decision.",
		"Let's not beat around the bush here.",
	],
};

// ============================================
// HOOKS
// ============================================

function useSpeechRecognition() {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [isSupported, setIsSupported] = useState(true);
	const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

	useEffect(() => {
		const SpeechRecognitionAPI =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognitionAPI) {
			setIsSupported(false);
			return;
		}

		const recognition = new SpeechRecognitionAPI();
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.lang = "en-US";

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const current = event.resultIndex;
			const result = event.results[current];
			if (result) {
				const alternative = result[0];
				setTranscript(alternative?.transcript ?? "");
			}
		};

		recognition.onend = () => {
			setIsListening(false);
		};

		recognition.onerror = () => {
			setIsListening(false);
		};

		recognitionRef.current = recognition;

		return () => {
			recognition.abort();
		};
	}, []);

	const startListening = useCallback(() => {
		if (recognitionRef.current) {
			setTranscript("");
			recognitionRef.current.start();
			setIsListening(true);
		}
	}, []);

	const stopListening = useCallback(() => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
			setIsListening(false);
		}
	}, []);

	const resetTranscript = useCallback(() => {
		setTranscript("");
	}, []);

	return {
		isListening,
		transcript,
		isSupported,
		startListening,
		stopListening,
		resetTranscript,
	};
}

function useSpeechSynthesis() {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [isSupported, setIsSupported] = useState(true);

	useEffect(() => {
		if (!window.speechSynthesis) {
			setIsSupported(false);
		}
	}, []);

	const speak = useCallback((text: string, rate = 1) => {
		if (!window.speechSynthesis) return;

		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "en-US";
		utterance.rate = rate;

		utterance.onstart = () => setIsSpeaking(true);
		utterance.onend = () => setIsSpeaking(false);
		utterance.onerror = () => setIsSpeaking(false);

		window.speechSynthesis.speak(utterance);
	}, []);

	const stop = useCallback(() => {
		window.speechSynthesis?.cancel();
		setIsSpeaking(false);
	}, []);

	return { isSpeaking, isSupported, speak, stop };
}

// ============================================
// UTILITIES
// ============================================

function compareTexts(
	expected: string,
	actual: string,
): { score: number; words: { word: string; correct: boolean }[] } {
	const expectedWords = expected
		.toLowerCase()
		.replace(/[^\w\s]/g, "")
		.split(/\s+/);
	const actualWords = actual
		.toLowerCase()
		.replace(/[^\w\s]/g, "")
		.split(/\s+/);

	const words: { word: string; correct: boolean }[] = [];
	let correct = 0;

	for (let i = 0; i < expectedWords.length; i++) {
		const expected = expectedWords[i] || "";
		const actual = actualWords[i] || "";
		const isCorrect =
			expected === actual || levenshteinDistance(expected, actual) <= 1;
		words.push({ word: expected, correct: isCorrect });
		if (isCorrect) correct++;
	}

	const score =
		expectedWords.length > 0
			? Math.round((correct / expectedWords.length) * 100)
			: 0;
	return { score, words };
}

function levenshteinDistance(a: string, b: string): number {
	const matrix: number[][] = Array.from({ length: b.length + 1 }, () =>
		Array.from({ length: a.length + 1 }, () => 0),
	);

	for (let i = 0; i <= b.length; i++) {
		matrix[i][0] = i;
	}
	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					matrix[i][j - 1] + 1,
					matrix[i - 1][j] + 1,
				);
			}
		}
	}

	return matrix[b.length][a.length];
}

// ============================================
// COMPONENTS
// ============================================

function ModeSelector({
	selectedMode,
	onSelect,
}: {
	selectedMode: PracticeMode | null;
	onSelect: (mode: PracticeMode) => void;
}) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{MODES.map((mode) => (
				<button
					key={mode.id}
					type="button"
					onClick={() => onSelect(mode.id)}
					className={cn(
						"group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all hover:scale-[1.02] hover:shadow-lg",
						selectedMode === mode.id
							? "border-primary bg-primary/5 shadow-md"
							: "border-transparent bg-muted/40 hover:border-primary/30",
					)}
				>
					<div
						className={cn(
							"absolute inset-0 bg-linear-to-br opacity-0 transition-opacity group-hover:opacity-10",
							mode.color,
						)}
					/>
					<div className="relative">
						<span className="text-4xl">{mode.icon}</span>
						<h3 className="mt-3 font-semibold text-lg">{mode.name}</h3>
						<p className="mt-1 text-muted-foreground text-sm">
							{mode.description}
						</p>
					</div>
					{selectedMode === mode.id && (
						<div className="absolute top-4 right-4">
							<div className="flex size-6 items-center justify-center rounded-full bg-primary">
								<Check className="size-4 text-primary-foreground" />
							</div>
						</div>
					)}
				</button>
			))}
		</div>
	);
}

function DifficultySelector({
	selected,
	onSelect,
}: {
	selected: "beginner" | "intermediate" | "advanced";
	onSelect: (level: "beginner" | "intermediate" | "advanced") => void;
}) {
	return (
		<div className="flex gap-2">
			{(["beginner", "intermediate", "advanced"] as const).map((level) => (
				<button
					key={level}
					type="button"
					onClick={() => onSelect(level)}
					className={cn(
						"rounded-full px-4 py-2 font-medium text-sm capitalize transition-all",
						selected === level
							? "bg-primary text-primary-foreground"
							: "bg-muted hover:bg-muted/80",
					)}
				>
					{level}
				</button>
			))}
		</div>
	);
}

function ScoreDisplay({ score }: { score: number }) {
	const getColor = () => {
		if (score >= 80) return "text-green-500";
		if (score >= 60) return "text-yellow-500";
		return "text-red-500";
	};

	const getMessage = () => {
		if (score >= 90) return "Excellent! 🎉";
		if (score >= 80) return "Great job! 👏";
		if (score >= 60) return "Good effort! 💪";
		return "Keep practicing! 🔄";
	};

	return (
		<div className="text-center">
			<div className={cn("font-bold text-6xl", getColor())}>{score}%</div>
			<p className="mt-2 text-lg text-muted-foreground">{getMessage()}</p>
		</div>
	);
}

function WordHighlight({
	words,
}: {
	words: { word: string; correct: boolean }[];
}) {
	return (
		<div className="flex flex-wrap gap-2">
			{words.map((item) => (
				<span
					key={`${item.word}-${item.correct}`}
					className={cn(
						"rounded-lg px-3 py-1.5 font-medium text-lg",
						item.correct
							? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
							: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
					)}
				>
					{item.word}
					{item.correct ? (
						<Check className="ml-1 inline size-4" />
					) : (
						<X className="ml-1 inline size-4" />
					)}
				</span>
			))}
		</div>
	);
}

// ============================================
// MODE COMPONENTS
// ============================================

function ReadAloudMode() {
	const [difficulty, setDifficulty] = useState<
		"beginner" | "intermediate" | "advanced"
	>("beginner");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [result, setResult] = useState<{
		score: number;
		words: { word: string; correct: boolean }[];
	} | null>(null);

	const {
		isListening,
		transcript,
		isSupported,
		startListening,
		stopListening,
		resetTranscript,
	} = useSpeechRecognition();
	const { isSpeaking, speak, stop } = useSpeechSynthesis();

	const texts = READ_ALOUD_TEXTS[difficulty];
	const currentText = texts[currentIndex] ?? texts[0] ?? "";

	const handleRecord = () => {
		if (isListening) {
			stopListening();
		} else {
			resetTranscript();
			setResult(null);
			startListening();
		}
	};

	const handleCheck = () => {
		if (transcript) {
			const comparison = compareTexts(currentText, transcript);
			setResult(comparison);
		}
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % texts.length);
		resetTranscript();
		setResult(null);
	};

	const handleListen = () => {
		if (isSpeaking) {
			stop();
		} else {
			speak(currentText, 0.9);
		}
	};

	//   if (!isSupported) {
	//     return (
	//       <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
	//         <p className="text-red-600 dark:text-red-400">
	//           Speech recognition is not supported in your browser. Please try Chrome
	//           or Edge.
	//         </p>
	//       </div>
	//     );
	//   }

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<DifficultySelector
					selected={difficulty}
					onSelect={(level) => {
						setDifficulty(level);
						setCurrentIndex(0);
						setResult(null);
						resetTranscript();
					}}
				/>
				<span className="text-muted-foreground text-sm">
					{currentIndex + 1} / {texts.length}
				</span>
			</div>

			{/* Text to read */}
			<div className="rounded-2xl border bg-linear-to-br from-blue-50 to-cyan-50 p-8 dark:from-blue-950/30 dark:to-cyan-950/30">
				<p className="text-center font-medium text-2xl leading-relaxed">
					{currentText}
				</p>
			</div>

			{/* Listen button */}
			<div className="flex justify-center">
				<Button
					variant="outline"
					size="lg"
					onClick={handleListen}
					className="gap-2"
				>
					{isSpeaking ? (
						<Pause className="size-5" />
					) : (
						<Volume2 className="size-5" />
					)}
					{isSpeaking ? "Stop" : "Listen to pronunciation"}
				</Button>
			</div>

			{/* Recording area */}
			<div className="space-y-4">
				<div className="flex justify-center gap-4">
					<Button
						size="lg"
						variant={isListening ? "destructive" : "default"}
						onClick={handleRecord}
						className={cn(
							"gap-2 transition-all",
							isListening && "animate-pulse",
						)}
					>
						{isListening ? (
							<MicOff className="size-5" />
						) : (
							<Mic className="size-5" />
						)}
						{isListening ? "Stop Recording" : "Start Recording"}
					</Button>
					{transcript && !result && (
						<Button
							size="lg"
							variant="secondary"
							onClick={handleCheck}
							className="gap-2"
						>
							<Check className="size-5" />
							Check
						</Button>
					)}
				</div>

				{/* Transcript */}
				{transcript && (
					<div className="rounded-xl border bg-muted/50 p-4">
						<p className="text-center text-muted-foreground text-sm">
							You said:
						</p>
						<p className="mt-2 text-center text-lg">{transcript}</p>
					</div>
				)}

				{/* Results */}
				{result && (
					<div className="space-y-6 rounded-2xl border bg-card p-6">
						<ScoreDisplay score={result.score} />
						<div className="space-y-2">
							<p className="font-medium text-muted-foreground text-sm">
								Word by word:
							</p>
							<WordHighlight words={result.words} />
						</div>
						<div className="flex justify-center gap-4">
							<Button
								variant="outline"
								onClick={() => {
									resetTranscript();
									setResult(null);
								}}
								className="gap-2"
							>
								<RefreshCw className="size-4" />
								Try Again
							</Button>
							<Button onClick={handleNext} className="gap-2">
								Next
								<ArrowRight className="size-4" />
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function TongueTwistersMode() {
	const [difficulty, setDifficulty] = useState<
		"beginner" | "intermediate" | "advanced"
	>("beginner");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [attempts, setAttempts] = useState(0);
	const [bestScore, setBestScore] = useState(0);
	const [result, setResult] = useState<{
		score: number;
		words: { word: string; correct: boolean }[];
	} | null>(null);

	const {
		isListening,
		transcript,
		isSupported,
		startListening,
		stopListening,
		resetTranscript,
	} = useSpeechRecognition();
	const { isSpeaking, speak, stop } = useSpeechSynthesis();

	const twisters = TONGUE_TWISTERS[difficulty];
	const current = twisters[currentIndex] ??
		twisters[0] ?? { text: "", speed: "slow" as const };

	const getRate = () => {
		switch (current.speed) {
			case "slow":
				return 0.8;
			case "medium":
				return 1;
			case "fast":
				return 1.2;
			default:
				return 1;
		}
	};

	const handleRecord = () => {
		if (isListening) {
			stopListening();
		} else {
			resetTranscript();
			setResult(null);
			startListening();
		}
	};

	const handleCheck = () => {
		if (transcript) {
			const comparison = compareTexts(current.text, transcript);
			setResult(comparison);
			setAttempts((prev) => prev + 1);
			if (comparison.score > bestScore) {
				setBestScore(comparison.score);
			}
		}
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % twisters.length);
		resetTranscript();
		setResult(null);
		setAttempts(0);
		setBestScore(0);
	};

	const handleListen = () => {
		if (isSpeaking) {
			stop();
		} else {
			speak(current.text, getRate());
		}
	};

	//   if (!isSupported) {
	//     return (
	//       <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
	//         <p className="text-red-600 dark:text-red-400">
	//           Speech recognition is not supported in your browser. Please try Chrome
	//           or Edge.
	//         </p>
	//       </div>
	//     );
	//   }

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<DifficultySelector
					selected={difficulty}
					onSelect={(level) => {
						setDifficulty(level);
						setCurrentIndex(0);
						setResult(null);
						resetTranscript();
						setAttempts(0);
						setBestScore(0);
					}}
				/>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">Attempts: {attempts}</span>
					<span className="font-medium text-green-600">Best: {bestScore}%</span>
				</div>
			</div>

			{/* Tongue twister card */}
			<div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-purple-50 to-pink-50 p-8 dark:from-purple-950/30 dark:to-pink-950/30">
				<div className="absolute top-4 right-4">
					<span
						className={cn(
							"rounded-full px-3 py-1 font-medium text-xs",
							current.speed === "slow" && "bg-green-100 text-green-700",
							current.speed === "medium" && "bg-yellow-100 text-yellow-700",
							current.speed === "fast" && "bg-red-100 text-red-700",
						)}
					>
						{current.speed} pace
					</span>
				</div>
				<div className="flex items-center justify-center pt-4">
					<span className="text-6xl">👅</span>
				</div>
				<p className="mt-6 text-center font-medium text-2xl leading-relaxed">
					{current.text}
				</p>
				<p className="mt-4 text-center text-muted-foreground text-sm">
					{currentIndex + 1} of {twisters.length}
				</p>
			</div>

			{/* Controls */}
			<div className="flex flex-col items-center gap-4">
				<Button
					variant="outline"
					size="lg"
					onClick={handleListen}
					className="gap-2"
				>
					{isSpeaking ? (
						<Pause className="size-5" />
					) : (
						<Volume2 className="size-5" />
					)}
					{isSpeaking ? "Stop" : "Listen first"}
				</Button>

				<div className="flex gap-4">
					<Button
						size="lg"
						variant={isListening ? "destructive" : "default"}
						onClick={handleRecord}
						className={cn("gap-2", isListening && "animate-pulse")}
					>
						{isListening ? (
							<MicOff className="size-5" />
						) : (
							<Mic className="size-5" />
						)}
						{isListening ? "Stop" : "Record"}
					</Button>
					{transcript && !result && (
						<Button
							size="lg"
							variant="secondary"
							onClick={handleCheck}
							className="gap-2"
						>
							<Check className="size-5" />
							Check
						</Button>
					)}
				</div>
			</div>

			{/* Transcript */}
			{transcript && !result && (
				<div className="rounded-xl border bg-muted/50 p-4">
					<p className="text-center text-lg">{transcript}</p>
				</div>
			)}

			{/* Results */}
			{result && (
				<div className="space-y-6 rounded-2xl border bg-card p-6">
					<ScoreDisplay score={result.score} />
					<WordHighlight words={result.words} />
					<div className="flex justify-center gap-4">
						<Button
							variant="outline"
							onClick={() => {
								resetTranscript();
								setResult(null);
							}}
							className="gap-2"
						>
							<RefreshCw className="size-4" />
							Try Again
						</Button>
						<Button onClick={handleNext} className="gap-2">
							Next Twister
							<ArrowRight className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

function MinimalPairsMode() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedWord, setSelectedWord] = useState<1 | 2 | null>(null);
	const [showAnswer, setShowAnswer] = useState(false);
	const [score, setScore] = useState({ correct: 0, total: 0 });
	const [mode, setMode] = useState<"listen" | "speak">("listen");

	const {
		isListening,
		transcript,
		isSupported,
		startListening,
		stopListening,
		resetTranscript,
	} = useSpeechRecognition();
	const { isSpeaking, speak, stop } = useSpeechSynthesis();

	const pair = MINIMAL_PAIRS[currentIndex] ??
		MINIMAL_PAIRS[0] ?? { word1: "", word2: "", phoneme: "", category: "" };
	const [targetWord, setTargetWord] = useState<1 | 2>(1);

	const playWord = (word: string) => {
		if (isSpeaking) {
			stop();
		} else {
			speak(word, 0.8);
		}
	};

	const playRandomWord = () => {
		const random = Math.random() > 0.5 ? 1 : 2;
		setTargetWord(random as 1 | 2);
		setSelectedWord(null);
		setShowAnswer(false);
		const word = random === 1 ? pair.word1 : pair.word2;
		setTimeout(() => speak(word, 0.8), 300);
	};

	const handleSelect = (choice: 1 | 2) => {
		setSelectedWord(choice);
		setShowAnswer(true);
		const isCorrect = choice === targetWord;
		setScore((prev) => ({
			correct: prev.correct + (isCorrect ? 1 : 0),
			total: prev.total + 1,
		}));
	};

	const handleSpeakCheck = () => {
		if (transcript) {
			const lower = transcript.toLowerCase().trim();
			const word1Match = lower.includes(pair.word1.toLowerCase());
			const word2Match = lower.includes(pair.word2.toLowerCase());

			if (word1Match || word2Match) {
				setShowAnswer(true);
				if (
					(targetWord === 1 && word1Match) ||
					(targetWord === 2 && word2Match)
				) {
					setScore((prev) => ({
						correct: prev.correct + 1,
						total: prev.total + 1,
					}));
					setSelectedWord(targetWord);
				} else {
					setScore((prev) => ({ ...prev, total: prev.total + 1 }));
					setSelectedWord(targetWord === 1 ? 2 : 1);
				}
			}
		}
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % MINIMAL_PAIRS.length);
		setSelectedWord(null);
		setShowAnswer(false);
		resetTranscript();
	};

	//   if (!isSupported) {
	//     return (
	//       <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
	//         <p className="text-red-600 dark:text-red-400">
	//           Speech features are not supported in your browser. Please try Chrome
	//           or Edge.
	//         </p>
	//       </div>
	//     );
	//   }

	return (
		<div className="space-y-6">
			{/* Mode toggle */}
			<div className="flex items-center justify-between">
				<div className="flex gap-2 rounded-full bg-muted p-1">
					<button
						type="button"
						onClick={() => {
							setMode("listen");
							setShowAnswer(false);
							setSelectedWord(null);
							resetTranscript();
						}}
						className={cn(
							"rounded-full px-4 py-2 font-medium text-sm transition-all",
							mode === "listen" ? "bg-background shadow" : "",
						)}
					>
						👂 Listen & Choose
					</button>
					<button
						type="button"
						onClick={() => {
							setMode("speak");
							setShowAnswer(false);
							setSelectedWord(null);
							resetTranscript();
						}}
						className={cn(
							"rounded-full px-4 py-2 font-medium text-sm transition-all",
							mode === "speak" ? "bg-background shadow" : "",
						)}
					>
						🎤 Speak the Word
					</button>
				</div>
				<div className="font-medium text-sm">
					Score: <span className="text-green-600">{score.correct}</span>/
					{score.total}
				</div>
			</div>

			{/* Pair display */}
			<div className="rounded-2xl border bg-linear-to-br from-orange-50 to-red-50 p-8 dark:from-orange-950/30 dark:to-red-950/30">
				<div className="mb-4 text-center">
					<span className="rounded-full bg-orange-100 px-3 py-1 font-mono text-orange-700 text-sm dark:bg-orange-900/30 dark:text-orange-300">
						{pair.phoneme}
					</span>
					<span className="ml-2 text-muted-foreground text-sm capitalize">
						{pair.category}
					</span>
				</div>

				<div className="flex items-center justify-center gap-8">
					<button
						type="button"
						onClick={() =>
							mode === "listen" && !showAnswer
								? handleSelect(1)
								: playWord(pair.word1)
						}
						disabled={mode === "listen" && showAnswer}
						className={cn(
							"group relative rounded-2xl border-4 px-8 py-6 text-center transition-all",
							mode === "listen" &&
								!showAnswer &&
								"cursor-pointer hover:scale-105 hover:border-orange-400",
							showAnswer &&
								selectedWord === 1 &&
								targetWord === 1 &&
								"border-green-500 bg-green-50",
							showAnswer &&
								selectedWord === 1 &&
								targetWord !== 1 &&
								"border-red-500 bg-red-50",
							showAnswer &&
								targetWord === 1 &&
								selectedWord !== 1 &&
								"border-green-500/50",
							!showAnswer && "border-muted bg-background",
						)}
					>
						<Volume2 className="mx-auto mb-2 size-6 text-muted-foreground" />
						<span className="block font-bold text-3xl">{pair.word1}</span>
					</button>

					<span className="font-bold text-2xl text-muted-foreground">vs</span>

					<button
						type="button"
						onClick={() =>
							mode === "listen" && !showAnswer
								? handleSelect(2)
								: playWord(pair.word2)
						}
						disabled={mode === "listen" && showAnswer}
						className={cn(
							"group relative rounded-2xl border-4 px-8 py-6 text-center transition-all",
							mode === "listen" &&
								!showAnswer &&
								"cursor-pointer hover:scale-105 hover:border-orange-400",
							showAnswer &&
								selectedWord === 2 &&
								targetWord === 2 &&
								"border-green-500 bg-green-50",
							showAnswer &&
								selectedWord === 2 &&
								targetWord !== 2 &&
								"border-red-500 bg-red-50",
							showAnswer &&
								targetWord === 2 &&
								selectedWord !== 2 &&
								"border-green-500/50",
							!showAnswer && "border-muted bg-background",
						)}
					>
						<Volume2 className="mx-auto mb-2 size-6 text-muted-foreground" />
						<span className="block font-bold text-3xl">{pair.word2}</span>
					</button>
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col items-center gap-4">
				{mode === "listen" &&
					(!showAnswer ? (
						<Button size="lg" onClick={playRandomWord} className="gap-2">
							<Play className="size-5" />
							Play Word
						</Button>
					) : (
						<div className="space-y-4 text-center">
							<p
								className={cn(
									"font-medium text-lg",
									selectedWord === targetWord
										? "text-green-600"
										: "text-red-600",
								)}
							>
								{selectedWord === targetWord
									? "✓ Correct!"
									: `✗ It was "${targetWord === 1 ? pair.word1 : pair.word2}"`}
							</p>
							<Button onClick={handleNext} className="gap-2">
								Next Pair
								<ArrowRight className="size-4" />
							</Button>
						</div>
					))}

				{mode === "speak" && (
					<>
						<p className="text-center text-muted-foreground">
							{showAnswer
								? `The target was: "${targetWord === 1 ? pair.word1 : pair.word2}"`
								: "Press play, then say the word you hear"}
						</p>

						{!showAnswer && (
							<div className="flex gap-4">
								<Button
									size="lg"
									variant="outline"
									onClick={playRandomWord}
									className="gap-2"
								>
									<Play className="size-5" />
									Play Word
								</Button>
								<Button
									size="lg"
									variant={isListening ? "destructive" : "default"}
									onClick={isListening ? stopListening : startListening}
									className={cn("gap-2", isListening && "animate-pulse")}
								>
									{isListening ? (
										<MicOff className="size-5" />
									) : (
										<Mic className="size-5" />
									)}
									{isListening ? "Stop" : "Record"}
								</Button>
							</div>
						)}

						{transcript && !showAnswer && (
							<div className="space-y-2 text-center">
								<p className="text-muted-foreground text-sm">
									You said: "{transcript}"
								</p>
								<Button onClick={handleSpeakCheck}>Check Answer</Button>
							</div>
						)}

						{showAnswer && (
							<Button onClick={handleNext} className="gap-2">
								Next Pair
								<ArrowRight className="size-4" />
							</Button>
						)}
					</>
				)}
			</div>

			<p className="text-center text-muted-foreground text-sm">
				{currentIndex + 1} of {MINIMAL_PAIRS.length} pairs
			</p>
		</div>
	);
}

function ShadowingMode() {
	const [difficulty, setDifficulty] = useState<
		"beginner" | "intermediate" | "advanced"
	>("beginner");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [phase, setPhase] = useState<"listen" | "record" | "compare">("listen");
	const [result, setResult] = useState<{
		score: number;
		words: { word: string; correct: boolean }[];
	} | null>(null);

	const {
		isListening,
		transcript,
		isSupported,
		startListening,
		stopListening,
		resetTranscript,
	} = useSpeechRecognition();
	const { isSpeaking, speak, stop } = useSpeechSynthesis();

	const texts = SHADOWING_TEXTS[difficulty];
	const currentText = texts[currentIndex] ?? texts[0] ?? "";

	const handleListen = () => {
		if (isSpeaking) {
			stop();
		} else {
			speak(currentText, 0.85);
			setPhase("listen");
		}
	};

	const handleRecord = () => {
		if (isListening) {
			stopListening();
			if (transcript) {
				const comparison = compareTexts(currentText, transcript);
				setResult(comparison);
				setPhase("compare");
			}
		} else {
			resetTranscript();
			setResult(null);
			startListening();
			setPhase("record");
		}
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % texts.length);
		resetTranscript();
		setResult(null);
		setPhase("listen");
	};

	const handleReset = () => {
		resetTranscript();
		setResult(null);
		setPhase("listen");
	};

	if (!isSupported) {
		return (
			<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
				<p className="text-red-600 dark:text-red-400">
					Speech features are not supported in your browser. Please try Chrome
					or Edge.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<DifficultySelector
					selected={difficulty}
					onSelect={(level) => {
						setDifficulty(level);
						setCurrentIndex(0);
						setResult(null);
						resetTranscript();
						setPhase("listen");
					}}
				/>
				<span className="text-muted-foreground text-sm">
					{currentIndex + 1} / {texts.length}
				</span>
			</div>

			{/* Main card */}
			<div className="rounded-2xl border bg-linear-to-br from-green-50 to-emerald-50 p-8 dark:from-green-950/30 dark:to-emerald-950/30">
				<div className="mb-6 flex items-center justify-center gap-2">
					<div
						className={cn(
							"flex size-8 items-center justify-center rounded-full font-bold text-sm",
							phase === "listen"
								? "bg-green-500 text-white"
								: "bg-muted text-muted-foreground",
						)}
					>
						1
					</div>
					<div className="h-1 w-8 rounded-full bg-muted" />
					<div
						className={cn(
							"flex size-8 items-center justify-center rounded-full font-bold text-sm",
							phase === "record"
								? "bg-green-500 text-white"
								: "bg-muted text-muted-foreground",
						)}
					>
						2
					</div>
					<div className="h-1 w-8 rounded-full bg-muted" />
					<div
						className={cn(
							"flex size-8 items-center justify-center rounded-full font-bold text-sm",
							phase === "compare"
								? "bg-green-500 text-white"
								: "bg-muted text-muted-foreground",
						)}
					>
						3
					</div>
				</div>

				<div className="mb-4 text-center">
					<span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-sm dark:bg-green-900/30 dark:text-green-300">
						{phase === "listen" && "👂 Listen"}
						{phase === "record" && "🎤 Repeat"}
						{phase === "compare" && "📊 Results"}
					</span>
				</div>

				<p className="text-center font-medium text-2xl leading-relaxed">
					{currentText}
				</p>
			</div>

			{/* Controls */}
			<div className="flex flex-col items-center gap-4">
				<div className="flex gap-4">
					<Button
						size="lg"
						variant={isSpeaking ? "secondary" : "outline"}
						onClick={handleListen}
						className="gap-2"
					>
						{isSpeaking ? (
							<Pause className="size-5" />
						) : (
							<Volume2 className="size-5" />
						)}
						{isSpeaking ? "Playing..." : "Listen"}
					</Button>

					<Button
						size="lg"
						variant={isListening ? "destructive" : "default"}
						onClick={handleRecord}
						className={cn("gap-2", isListening && "animate-pulse")}
					>
						{isListening ? (
							<MicOff className="size-5" />
						) : (
							<Mic className="size-5" />
						)}
						{isListening ? "Stop & Check" : "Record"}
					</Button>
				</div>

				{/* Live transcript */}
				{isListening && transcript && (
					<div className="w-full rounded-xl border bg-muted/50 p-4">
						<p className="text-center text-muted-foreground text-sm">
							You're saying:
						</p>
						<p className="mt-1 text-center text-lg">{transcript}</p>
					</div>
				)}
			</div>

			{/* Results */}
			{result && (
				<div className="space-y-6 rounded-2xl border bg-card p-6">
					<ScoreDisplay score={result.score} />

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="rounded-xl bg-muted/50 p-4">
							<p className="mb-2 font-medium text-muted-foreground text-sm">
								Original:
							</p>
							<p>{currentText}</p>
						</div>
						<div className="rounded-xl bg-muted/50 p-4">
							<p className="mb-2 font-medium text-muted-foreground text-sm">
								Your version:
							</p>
							<p>{transcript}</p>
						</div>
					</div>

					<WordHighlight words={result.words} />

					<div className="flex justify-center gap-4">
						<Button variant="outline" onClick={handleReset} className="gap-2">
							<RefreshCw className="size-4" />
							Try Again
						</Button>
						<Button onClick={handleNext} className="gap-2">
							Next Phrase
							<ArrowRight className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

// ============================================
// MAIN PAGE
// ============================================

function PronunciationPage() {
	const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);

	const handleBack = () => {
		setSelectedMode(null);
	};

	return (
		<div className="min-h-screen pb-12">
			<div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
				{/* Header */}
				<div className="mb-8">
					{selectedMode && (
						<button
							type="button"
							onClick={handleBack}
							className="mb-4 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowRight className="size-4 rotate-180" />
							Back to modes
						</button>
					)}
					<h1 className="font-bold font-lyon text-4xl tracking-tight">
						{selectedMode
							? MODES.find((m) => m.id === selectedMode)?.name
							: "Pronunciation Practice"}
					</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						{selectedMode
							? MODES.find((m) => m.id === selectedMode)?.description
							: "Choose a practice mode to improve your English pronunciation"}
					</p>
				</div>

				{/* Content */}
				{!selectedMode ? (
					<ModeSelector
						selectedMode={selectedMode}
						onSelect={setSelectedMode}
					/>
				) : (
					<div className="fade-in slide-in-from-bottom-4 animate-in duration-300">
						{selectedMode === "read-aloud" && <ReadAloudMode />}
						{selectedMode === "tongue-twisters" && <TongueTwistersMode />}
						{selectedMode === "minimal-pairs" && <MinimalPairsMode />}
						{selectedMode === "shadowing" && <ShadowingMode />}
					</div>
				)}
			</div>
		</div>
	);
}

// ============================================
// TYPE DECLARATIONS
// ============================================

interface SpeechRecognitionEvent extends Event {
	resultIndex: number;
	results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
	length: number;
	item(index: number): SpeechRecognitionResult;
	[index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
	isFinal: boolean;
	length: number;
	item(index: number): SpeechRecognitionAlternative;
	[index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	onresult: ((event: SpeechRecognitionEvent) => void) | null;
	onend: (() => void) | null;
	onerror: (() => void) | null;
	start(): void;
	stop(): void;
	abort(): void;
}

interface SpeechRecognitionConstructor {
	new (): SpeechRecognitionInstance;
}

declare global {
	interface Window {
		SpeechRecognition: SpeechRecognitionConstructor;
		webkitSpeechRecognition: SpeechRecognitionConstructor;
	}
}
