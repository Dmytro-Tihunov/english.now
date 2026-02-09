import { createFileRoute } from "@tanstack/react-router";
import {
	Briefcase,
	CheckCircle2,
	ChefHat,
	ChevronRight,
	Clock,
	Code,
	Globe,
	GraduationCap,
	Loader2,
	Palette,
	Plane,
	Plus,
	RotateCcw,
	Search,
	Shuffle,
	Sparkles,
	Star,
	Stethoscope,
	Users,
	Volume2,
	Wand2,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import Explore from "@/components/vocabulary/explore";
import Phrases from "@/components/vocabulary/phrases";
import Practice from "@/components/vocabulary/practice";
import Progress from "@/components/vocabulary/progress";
import Words from "@/components/vocabulary/words";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../components/ui/tabs";
import { cn } from "../lib/utils";

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type MasteryLevel = "new" | "learning" | "reviewing" | "mastered";

interface VocabularyWord {
	id: string;
	word: string;
	pronunciation: string;
	partOfSpeech: string;
	definition: string;
	exampleSentence: string;
	translation?: string;
	level: CEFRLevel;
	mastery: MasteryLevel;
	category: string;
	tags: string[];
	synonyms?: string[];
	antonyms?: string[];
}

interface VocabularyCategory {
	id: string;
	name: string;
	icon: React.ReactNode;
	description: string;
	wordCount: number;
	color: string;
}

interface CustomList {
	id: string;
	name: string;
	description: string;
	words: VocabularyWord[];
	createdAt: Date;
	tags: string[];
}

// CEFR Level colors matching the design system
const LEVEL_COLORS: Record<
	CEFRLevel,
	{ bg: string; text: string; border: string }
> = {
	A1: {
		bg: "bg-emerald-500",
		text: "text-emerald-700 dark:text-emerald-400",
		border: "border-emerald-500/30",
	},
	A2: {
		bg: "bg-teal-500",
		text: "text-teal-700 dark:text-teal-400",
		border: "border-teal-500/30",
	},
	B1: {
		bg: "bg-blue-500",
		text: "text-blue-700 dark:text-blue-400",
		border: "border-blue-500/30",
	},
	B2: {
		bg: "bg-indigo-500",
		text: "text-indigo-700 dark:text-indigo-400",
		border: "border-indigo-500/30",
	},
	C1: {
		bg: "bg-purple-500",
		text: "text-purple-700 dark:text-purple-400",
		border: "border-purple-500/30",
	},
	C2: {
		bg: "bg-rose-500",
		text: "text-rose-700 dark:text-rose-400",
		border: "border-rose-500/30",
	},
};

const MASTERY_COLORS: Record<
	MasteryLevel,
	{ bg: string; text: string; label: string }
> = {
	new: {
		bg: "bg-slate-100 dark:bg-slate-800",
		text: "text-slate-600 dark:text-slate-400",
		label: "New",
	},
	learning: {
		bg: "bg-amber-100 dark:bg-amber-900/30",
		text: "text-amber-700 dark:text-amber-400",
		label: "Learning",
	},
	reviewing: {
		bg: "bg-blue-100 dark:bg-blue-900/30",
		text: "text-blue-700 dark:text-blue-400",
		label: "Reviewing",
	},
	mastered: {
		bg: "bg-green-100 dark:bg-green-900/30",
		text: "text-green-700 dark:text-green-400",
		label: "Mastered",
	},
};

const VOCABULARY_CATEGORIES: VocabularyCategory[] = [
	{
		id: "business",
		name: "Business & Finance",
		icon: <Briefcase className="h-5 w-5" />,
		description: "Professional vocabulary for the workplace",
		wordCount: 245,
		color: "from-blue-500 to-indigo-600",
	},
	{
		id: "technology",
		name: "Technology & IT",
		icon: <Code className="h-5 w-5" />,
		description: "Tech terms and digital vocabulary",
		wordCount: 189,
		color: "from-cyan-500 to-blue-600",
	},
	{
		id: "travel",
		name: "Travel & Tourism",
		icon: <Plane className="h-5 w-5" />,
		description: "Essential words for travelers",
		wordCount: 156,
		color: "from-orange-500 to-pink-600",
	},
	{
		id: "healthcare",
		name: "Healthcare & Medicine",
		icon: <Stethoscope className="h-5 w-5" />,
		description: "Medical and health-related terms",
		wordCount: 198,
		color: "from-green-500 to-emerald-600",
	},
	{
		id: "food",
		name: "Food & Cooking",
		icon: <ChefHat className="h-5 w-5" />,
		description: "Culinary vocabulary",
		wordCount: 134,
		color: "from-amber-500 to-orange-600",
	},
	{
		id: "arts",
		name: "Arts & Culture",
		icon: <Palette className="h-5 w-5" />,
		description: "Creative and cultural terms",
		wordCount: 112,
		color: "from-purple-500 to-pink-600",
	},
	{
		id: "academic",
		name: "Academic English",
		icon: <GraduationCap className="h-5 w-5" />,
		description: "Vocabulary for academic writing",
		wordCount: 276,
		color: "from-slate-600 to-slate-800",
	},
	{
		id: "social",
		name: "Social & Relationships",
		icon: <Users className="h-5 w-5" />,
		description: "Everyday social interactions",
		wordCount: 167,
		color: "from-rose-500 to-red-600",
	},
];

// Sample vocabulary words
const SAMPLE_WORDS: VocabularyWord[] = [
	{
		id: "1",
		word: "entrepreneur",
		pronunciation: "/ˌɒntrəprəˈnɜː/",
		partOfSpeech: "noun",
		definition:
			"A person who sets up and runs a business, taking financial risks",
		exampleSentence:
			"The young entrepreneur launched her startup at just 22 years old.",
		translation: "empresario",
		level: "B2",
		mastery: "learning",
		category: "business",
		tags: ["business", "career", "startup"],
		synonyms: ["businessperson", "founder", "tycoon"],
	},
	{
		id: "2",
		word: "sustainable",
		pronunciation: "/səˈsteɪnəbl/",
		partOfSpeech: "adjective",
		definition:
			"Able to be maintained at a certain rate or level without depleting resources",
		exampleSentence:
			"The company has committed to using only sustainable materials.",
		translation: "sostenible",
		level: "B1",
		mastery: "new",
		category: "business",
		tags: ["environment", "business", "green"],
		synonyms: ["eco-friendly", "green", "renewable"],
	},
	{
		id: "3",
		word: "algorithm",
		pronunciation: "/ˈælɡərɪðəm/",
		partOfSpeech: "noun",
		definition:
			"A process or set of rules followed in calculations or problem-solving operations",
		exampleSentence:
			"The search algorithm helps users find relevant results quickly.",
		translation: "algoritmo",
		level: "B2",
		mastery: "reviewing",
		category: "technology",
		tags: ["tech", "programming", "AI"],
		synonyms: ["procedure", "formula", "method"],
	},
	{
		id: "4",
		word: "itinerary",
		pronunciation: "/aɪˈtɪnərəri/",
		partOfSpeech: "noun",
		definition: "A planned route or journey",
		exampleSentence:
			"I've prepared a detailed itinerary for our trip to Japan.",
		translation: "itinerario",
		level: "B1",
		mastery: "mastered",
		category: "travel",
		tags: ["travel", "planning", "tourism"],
		synonyms: ["schedule", "plan", "route"],
	},
	{
		id: "5",
		word: "collaborate",
		pronunciation: "/kəˈlæbəreɪt/",
		partOfSpeech: "verb",
		definition: "To work jointly on an activity or project",
		exampleSentence:
			"Teams across different departments collaborate on major projects.",
		translation: "colaborar",
		level: "B1",
		mastery: "learning",
		category: "business",
		tags: ["teamwork", "business", "work"],
		synonyms: ["cooperate", "partner", "work together"],
	},
	{
		id: "6",
		word: "innovative",
		pronunciation: "/ˈɪnəveɪtɪv/",
		partOfSpeech: "adjective",
		definition: "Introducing new ideas; original and creative in thinking",
		exampleSentence:
			"The company is known for its innovative approach to product design.",
		translation: "innovador",
		level: "B2",
		mastery: "new",
		category: "business",
		tags: ["creativity", "business", "technology"],
		synonyms: ["creative", "original", "groundbreaking"],
	},
	{
		id: "7",
		word: "cybersecurity",
		pronunciation: "/ˌsaɪbəsɪˈkjʊərəti/",
		partOfSpeech: "noun",
		definition:
			"The practice of protecting systems and networks from digital attacks",
		exampleSentence:
			"Cybersecurity has become a top priority for all organizations.",
		translation: "ciberseguridad",
		level: "B2",
		mastery: "new",
		category: "technology",
		tags: ["tech", "security", "internet"],
		synonyms: ["digital security", "information security"],
	},
	{
		id: "8",
		word: "accommodation",
		pronunciation: "/əˌkɒməˈdeɪʃn/",
		partOfSpeech: "noun",
		definition: "A place where travelers can sleep, like a hotel or hostel",
		exampleSentence:
			"We need to book accommodation before the tourist season starts.",
		translation: "alojamiento",
		level: "A2",
		mastery: "mastered",
		category: "travel",
		tags: ["travel", "hotel", "tourism"],
		synonyms: ["lodging", "housing", "shelter"],
	},
];

// AI brainstorm suggestions based on topics
const AI_SUGGESTIONS: Record<string, string[]> = {
	"software developer": [
		"debugging",
		"deployment",
		"repository",
		"framework",
		"scalability",
		"refactoring",
		"API",
		"middleware",
		"microservices",
		"containerization",
	],
	"marketing manager": [
		"conversion rate",
		"brand awareness",
		"target audience",
		"engagement",
		"campaign",
		"analytics",
		"influencer",
		"ROI",
		"segmentation",
		"funnel",
	],
	doctor: [
		"diagnosis",
		"prescription",
		"symptoms",
		"prognosis",
		"consultation",
		"treatment",
		"chronic",
		"acute",
		"dosage",
		"side effects",
	],
	chef: [
		"sauté",
		"garnish",
		"julienne",
		"reduction",
		"emulsion",
		"braising",
		"blanching",
		"mise en place",
		"seasoning",
		"caramelization",
	],
	default: [
		"essential",
		"fundamental",
		"comprehensive",
		"significant",
		"relevant",
		"approach",
		"strategy",
		"implement",
		"establish",
		"maintain",
	],
};

export const Route = createFileRoute("/_dashboard/vocabulary")({
	component: VocabularyPage,
});

function VocabularyPage() {
	const [activeView, setActiveView] = useState<
		"words" | "phrases" | "progress"
	>("words");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | "all">("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [customLists, setCustomLists] = useState<CustomList[]>([]);
	const [isBrainstorming, setIsBrainstorming] = useState(false);
	const [brainstormTopic, setBrainstormTopic] = useState("");
	const [brainstormResults, setBrainstormResults] = useState<string[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
	const [flashcardMode, setFlashcardMode] = useState(false);
	const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
	const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);

	const filteredWords = useMemo(() => {
		return SAMPLE_WORDS.filter((word) => {
			const matchesSearch =
				word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
				word.definition.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesLevel =
				selectedLevel === "all" || word.level === selectedLevel;
			const matchesCategory =
				!selectedCategory || word.category === selectedCategory;
			return matchesSearch && matchesLevel && matchesCategory;
		});
	}, [searchQuery, selectedLevel, selectedCategory]);

	const handleBrainstorm = () => {
		setIsGenerating(true);

		setTimeout(() => {
			const topic = brainstormTopic.toLowerCase();
			let suggestions = AI_SUGGESTIONS.default;

			for (const [key, words] of Object.entries(AI_SUGGESTIONS)) {
				if (topic.includes(key) || key.includes(topic)) {
					suggestions = words;
					break;
				}
			}

			setBrainstormResults(suggestions);
			setIsGenerating(false);
		}, 1500);
	};

	const createListFromBrainstorm = () => {
		const newList: CustomList = {
			id: Date.now().toString(),
			name: `${brainstormTopic} Vocabulary`,
			description: `Custom vocabulary list for ${brainstormTopic}`,
			words: brainstormResults.map((word, idx) => ({
				id: `custom-${Date.now()}-${idx}`,
				word,
				pronunciation: "",
				partOfSpeech: "",
				definition: "Definition to be added",
				exampleSentence: "",
				level: "B1" as CEFRLevel,
				mastery: "new" as MasteryLevel,
				category: "custom",
				tags: [brainstormTopic],
			})),
			createdAt: new Date(),
			tags: [brainstormTopic],
		};
		setCustomLists([...customLists, newList]);
		setBrainstormTopic("");
		setBrainstormResults([]);
		setIsBrainstorming(false);
	};

	return (
		<div>
			<div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
				<div className="mb-4 flex flex-col items-center md:flex-row md:items-center md:justify-between">
					<div className="flex items-center">
						<div>
							<h1 className="font-bold font-lyon text-2.5xl text-neutral-950 tracking-tight md:text-3xl">
								Vocabulary
							</h1>
						</div>
					</div>
				</div>
				<Tabs
					value={activeView}
					onValueChange={(v) => setActiveView(v as typeof activeView)}
					className="space-y-5"
				>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<TabsList
							className="inline-flex h-fit items-center justify-center rounded-2xl p-[3px] text-muted-foreground"
							style={{
								boxShadow:
									"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
							}}
						>
							<TabsTrigger
								value="words"
								className="flex h-[34px] items-center gap-1 rounded-xl px-2.5 py-1.5 font-medium text-sm"
							>
								Words
							</TabsTrigger>
							<TabsTrigger
								value="phrases"
								className="flex h-[34px] items-center gap-1 rounded-xl px-2.5 py-1.5 font-medium text-sm"
							>
								Phrases
							</TabsTrigger>
							<TabsTrigger
								value="progress"
								className="flex h-[34px] items-center gap-1 rounded-xl px-2.5 py-1.5 font-medium text-sm"
							>
								Progress
							</TabsTrigger>
							{/* <TabsTrigger
								value="explore"
								className="flex h-[33px] items-center gap-1 rounded-xl px-2.5 py-1.5 font-medium text-sm"
							>
								
								Explore
							</TabsTrigger> */}
						</TabsList>
						<div className="flex gap-3">
							<Practice />
							<Explore />
						</div>
					</div>

					<TabsContent value="explore" className="space-y-8">
						{selectedCategory && (
							<div className="space-y-6">
								<div className="flex items-center gap-4">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedCategory(null)}
									>
										← Back to categories
									</Button>
									<h2 className="font-semibold text-lg">
										{
											VOCABULARY_CATEGORIES.find(
												(c) => c.id === selectedCategory,
											)?.name
										}
									</h2>
								</div>
								<WordsGrid
									words={filteredWords}
									viewMode={viewMode}
									onSelectWord={setSelectedWord}
								/>
							</div>
						)}

						{/* All Words (when no category selected and searching) */}
						{!selectedCategory && searchQuery && (
							<div className="space-y-4">
								<h2 className="font-semibold text-lg">Search Results</h2>
								<WordsGrid
									words={filteredWords}
									viewMode={viewMode}
									onSelectWord={setSelectedWord}
								/>
							</div>
						)}

						{/* Featured Words */}
						{!selectedCategory && !searchQuery && (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="font-semibold text-lg">
										Words to Review Today
									</h2>
									<Button variant="ghost" size="sm" className="gap-2">
										<Shuffle className="h-4 w-4" />
										Shuffle
									</Button>
								</div>
								<WordsGrid
									words={SAMPLE_WORDS.filter(
										(w) => w.mastery !== "mastered",
									).slice(0, 4)}
									viewMode="grid"
									onSelectWord={setSelectedWord}
								/>
							</div>
						)}
					</TabsContent>

					<TabsContent value="words">
						<Words />
					</TabsContent>

					<TabsContent value="phrases">
						<Phrases />
					</TabsContent>

					{/* Practice Tab */}
					<TabsContent value="progress" className="space-y-8">
						<Progress />
						{/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							<Card className="overflow-hidden">
								<div className="bg-linear-to-br from-purple-500 to-pink-600 p-6 text-white">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
										<Layers className="h-6 w-6" />
									</div>
									<h3 className="font-bold text-xl">Flashcards</h3>
									<p className="mt-1 text-sm text-white/80">
										Review with spaced repetition
									</p>
								</div>
								<CardContent className="p-6">
									<div className="mb-4 flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Due today</span>
										<span className="font-semibold">
											{stats.learning + stats.newWords} cards
										</span>
									</div>
									<Button
										onClick={() => setFlashcardMode(true)}
										className="w-full gap-2"
									>
										<Zap className="h-4 w-4" />
										Start Review
									</Button>
								</CardContent>
							</Card>
						</div> */}
					</TabsContent>
				</Tabs>
			</div>

			{/* AI Brainstorm Modal */}
			{isBrainstorming && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
					<Card className="zoom-in-95 w-full max-w-lg animate-in">
						<CardHeader className="border-b">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#DCFF6F] to-emerald-400">
										<Sparkles className="h-5 w-5 text-slate-900" />
									</div>
									<div>
										<CardTitle>AI Vocabulary Brainstorm</CardTitle>
										<CardDescription>
											Generate vocabulary based on your needs
										</CardDescription>
									</div>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => {
										setIsBrainstorming(false);
										setBrainstormResults([]);
									}}
								>
									<X className="h-5 w-5" />
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-6 p-6">
							<div className="space-y-2">
								<label
									htmlFor="brainstorm-topic"
									className="font-medium text-sm"
								>
									What's your profession or interest?
								</label>
								<div className="flex gap-2">
									<Input
										id="brainstorm-topic"
										placeholder="e.g., Software Developer, Marketing, Healthcare..."
										value={brainstormTopic}
										onChange={(e) => setBrainstormTopic(e.target.value)}
										onKeyDown={(e) =>
											e.key === "Enter" && brainstormTopic && handleBrainstorm()
										}
									/>
									<Button
										onClick={handleBrainstorm}
										disabled={!brainstormTopic || isGenerating}
										className="gap-2 bg-linear-to-r from-[#DCFF6F] to-emerald-400 text-slate-900"
									>
										{isGenerating ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Wand2 className="h-4 w-4" />
										)}
										Generate
									</Button>
								</div>
							</div>

							{/* Quick suggestions */}
							<div className="space-y-2">
								<span className="text-muted-foreground text-sm">
									Quick suggestions:
								</span>
								<div className="flex flex-wrap gap-2">
									{[
										"Software Developer",
										"Marketing Manager",
										"Doctor",
										"Chef",
									].map((suggestion) => (
										<button
											type="button"
											key={suggestion}
											onClick={() => {
												setBrainstormTopic(suggestion);
											}}
											className="rounded-full border bg-white px-3 py-1 text-sm transition-colors hover:border-[#DCFF6F] hover:bg-[#DCFF6F]/10 dark:bg-slate-800"
										>
											{suggestion}
										</button>
									))}
								</div>
							</div>

							{/* Results */}
							{brainstormResults.length > 0 && (
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="font-medium text-sm">
											Generated vocabulary ({brainstormResults.length} words)
										</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleBrainstorm}
											className="gap-1"
										>
											<RotateCcw className="h-3 w-3" />
											Regenerate
										</Button>
									</div>
									<div className="flex flex-wrap gap-2">
										{brainstormResults.map((word) => (
											<Badge
												key={word}
												variant="secondary"
												className="px-3 py-1.5 text-sm"
											>
												{word}
											</Badge>
										))}
									</div>
									<Button
										onClick={createListFromBrainstorm}
										className="w-full gap-2"
									>
										<Plus className="h-4 w-4" />
										Create List with These Words
									</Button>
								</div>
							)}

							{isGenerating && (
								<div className="flex flex-col items-center py-8">
									<Loader2 className="mb-4 h-8 w-8 animate-spin text-[#DCFF6F]" />
									<p className="text-muted-foreground text-sm">
										Generating vocabulary for {brainstormTopic}...
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Word Detail Modal */}
			{selectedWord && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
					<Card className="zoom-in-95 w-full max-w-lg animate-in">
						<CardHeader className="border-b">
							<div className="flex items-start justify-between">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Badge variant={selectedWord.level}>
											{selectedWord.level}
										</Badge>
										<Badge
											variant={
												selectedWord.mastery === "new"
													? "notStarted"
													: selectedWord.mastery === "mastered"
														? "mastered"
														: selectedWord.mastery === "learning"
															? "learning"
															: "secondary"
											}
										>
											{MASTERY_COLORS[selectedWord.mastery].label}
										</Badge>
									</div>
									<CardTitle className="text-2xl">
										{selectedWord.word}
									</CardTitle>
									<div className="flex items-center gap-2 text-muted-foreground">
										<span className="text-sm">
											{selectedWord.pronunciation}
										</span>
										<Button variant="ghost" size="icon" className="h-6 w-6">
											<Volume2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setSelectedWord(null)}
								>
									<X className="h-5 w-5" />
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-6 p-6">
							<div>
								<span className="text-muted-foreground text-xs uppercase tracking-wide">
									{selectedWord.partOfSpeech}
								</span>
								<p className="mt-1 text-lg">{selectedWord.definition}</p>
							</div>

							<div className="rounded-xl bg-[#DCFF6F]/10 p-4">
								<span className="text-muted-foreground text-xs uppercase tracking-wide">
									Example
								</span>
								<p className="mt-1 italic">"{selectedWord.exampleSentence}"</p>
							</div>

							{selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
								<div>
									<span className="text-muted-foreground text-xs uppercase tracking-wide">
										Synonyms
									</span>
									<div className="mt-2 flex flex-wrap gap-2">
										{selectedWord.synonyms.map((syn) => (
											<Badge key={syn} variant="outline">
												{syn}
											</Badge>
										))}
									</div>
								</div>
							)}

							{selectedWord.translation && (
								<div className="flex items-center gap-2 rounded-lg border p-3">
									<Globe className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{selectedWord.translation}</span>
								</div>
							)}

							<div className="flex gap-2">
								<Button variant="secondary" className="flex-1 gap-2">
									<Star className="h-4 w-4" />
									Add to List
								</Button>
								<Button className="flex-1 gap-2 bg-linear-to-r from-[#DCFF6F] to-emerald-400 text-slate-900">
									<CheckCircle2 className="h-4 w-4" />
									Mark as Learned
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Flashcard Mode */}
			{flashcardMode && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
					<div className="w-full max-w-lg">
						<div className="mb-6 flex items-center justify-between text-white">
							<span className="text-sm opacity-70">
								Card {currentFlashcardIndex + 1} of {SAMPLE_WORDS.length}
							</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setFlashcardMode(false)}
								className="text-white hover:bg-white/10"
							>
								<X className="h-5 w-5" />
							</Button>
						</div>

						<button
							type="button"
							className={cn(
								"relative w-full cursor-pointer rounded-3xl bg-white p-8 text-center shadow-2xl transition-all duration-500 dark:bg-slate-800",
								showFlashcardAnswer && "bg-[#DCFF6F] dark:bg-[#DCFF6F]",
							)}
							onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
						>
							<div className="flex min-h-[200px] flex-col items-center justify-center">
								{!showFlashcardAnswer ? (
									<>
										<h2 className="mb-2 font-bold text-3xl">
											{SAMPLE_WORDS[currentFlashcardIndex].word}
										</h2>
										<p className="text-muted-foreground">
											{SAMPLE_WORDS[currentFlashcardIndex].pronunciation}
										</p>
										<p className="mt-4 text-muted-foreground text-sm">
											Tap to reveal definition
										</p>
									</>
								) : (
									<>
										<p className="mb-4 text-slate-800 text-xl">
											{SAMPLE_WORDS[currentFlashcardIndex].definition}
										</p>
										<p className="text-slate-600 italic">
											"{SAMPLE_WORDS[currentFlashcardIndex].exampleSentence}"
										</p>
									</>
								)}
							</div>
							<div className="-translate-x-1/2 absolute bottom-4 left-1/2">
								<Badge variant={SAMPLE_WORDS[currentFlashcardIndex].level}>
									{SAMPLE_WORDS[currentFlashcardIndex].level}
								</Badge>
							</div>
						</button>

						<div className="mt-6 flex justify-center gap-4">
							<Button
								variant="outline"
								size="lg"
								className="border-red-500/50 text-red-400 hover:bg-red-500/10"
								onClick={() => {
									setShowFlashcardAnswer(false);
									setCurrentFlashcardIndex(
										(prev) => (prev + 1) % SAMPLE_WORDS.length,
									);
								}}
							>
								<X className="mr-2 h-5 w-5" />
								Hard
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
								onClick={() => {
									setShowFlashcardAnswer(false);
									setCurrentFlashcardIndex(
										(prev) => (prev + 1) % SAMPLE_WORDS.length,
									);
								}}
							>
								<Clock className="mr-2 h-5 w-5" />
								Review
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="border-green-500/50 text-green-400 hover:bg-green-500/10"
								onClick={() => {
									setShowFlashcardAnswer(false);
									setCurrentFlashcardIndex(
										(prev) => (prev + 1) % SAMPLE_WORDS.length,
									);
								}}
							>
								<CheckCircle2 className="mr-2 h-5 w-5" />
								Easy
							</Button>
						</div>

						{/* <Progress
							value={((currentFlashcardIndex + 1) / SAMPLE_WORDS.length) * 100}
							className="mt-6 h-1 bg-white/20"
						/> */}
					</div>
				</div>
			)}
		</div>
	);
}

// Words Grid Component
function WordsGrid({
	words,
	viewMode,
	onSelectWord,
}: {
	words: VocabularyWord[];
	viewMode: "grid" | "list";
	onSelectWord: (word: VocabularyWord) => void;
}) {
	if (words.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12">
				<Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
				<p className="text-muted-foreground">No words found</p>
			</div>
		);
	}

	if (viewMode === "list") {
		return (
			<div className="space-y-2">
				{words.map((word) => (
					<button
						type="button"
						key={word.id}
						onClick={() => onSelectWord(word)}
						className="hover:-translate-y-0.5 flex w-full items-center justify-between rounded-xl border bg-white p-4 text-left transition-all hover:shadow-md dark:bg-slate-900"
					>
						<div className="flex items-center gap-4">
							<div
								className={cn(
									"flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm text-white",
									LEVEL_COLORS[word.level].bg,
								)}
							>
								{word.level}
							</div>
							<div>
								<div className="flex items-center gap-2">
									<span className="font-semibold">{word.word}</span>
									<span className="text-muted-foreground text-sm">
										{word.pronunciation}
									</span>
								</div>
								<p className="line-clamp-1 text-muted-foreground text-sm">
									{word.definition}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant={
									word.mastery === "new"
										? "notStarted"
										: word.mastery === "mastered"
											? "mastered"
											: word.mastery === "learning"
												? "learning"
												: "secondary"
								}
							>
								{MASTERY_COLORS[word.mastery].label}
							</Badge>
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						</div>
					</button>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{words.map((word) => (
				<button
					type="button"
					key={word.id}
					onClick={() => onSelectWord(word)}
					className="group hover:-translate-y-1 relative overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:shadow-lg dark:bg-slate-900"
				>
					<div
						className={cn(
							"-translate-y-6 absolute top-0 right-0 h-20 w-20 translate-x-6 rounded-full opacity-20",
							LEVEL_COLORS[word.level].bg,
						)}
					/>

					<div className="mb-3 flex items-center justify-between">
						<Badge variant={word.level}>{word.level}</Badge>
						<Badge
							variant={
								word.mastery === "new"
									? "notStarted"
									: word.mastery === "mastered"
										? "mastered"
										: word.mastery === "learning"
											? "learning"
											: "secondary"
							}
							className="text-xs"
						>
							{MASTERY_COLORS[word.mastery].label}
						</Badge>
					</div>

					<h3 className="mb-1 font-bold text-lg">{word.word}</h3>
					<p className="mb-2 text-muted-foreground text-xs">
						{word.pronunciation}
					</p>
					<p className="line-clamp-2 text-muted-foreground text-sm">
						{word.definition}
					</p>

					<div className="mt-4 flex items-center justify-between">
						<div className="flex gap-1">
							{word.tags.slice(0, 2).map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs"
								>
									{tag}
								</span>
							))}
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<Volume2 className="h-4 w-4" />
						</Button>
					</div>
				</button>
			))}
		</div>
	);
}
