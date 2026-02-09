import { useMemo } from "react";
import { Progress as ProgressComponent } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

export default function Progress() {
	const stats = useMemo(() => {
		const total = SAMPLE_WORDS.length;
		const mastered = SAMPLE_WORDS.filter(
			(w) => w.mastery === "mastered",
		).length;
		const learning = SAMPLE_WORDS.filter(
			(w) => w.mastery === "learning",
		).length;
		const newWords = SAMPLE_WORDS.filter((w) => w.mastery === "new").length;
		return {
			total,
			mastered,
			learning,
			newWords,
			progress: Math.round((mastered / total) * 100),
		};
	}, []);
	return (
		<div className="flex flex-col gap-4">
			<h1 className="flex items-center gap-2">Learning Progress</h1>

			<div className="mb-6 space-y-4">
				<div className="flex items-center justify-between text-sm">
					<span>Overall Progress</span>
					<span className="font-semibold">{stats.progress}%</span>
				</div>
				<ProgressComponent value={stats.progress} className="h-3" />
			</div>
			<div className="grid gap-4 sm:grid-cols-4">
				{Object.entries(MASTERY_COLORS).map(([key, value]) => {
					const count = SAMPLE_WORDS.filter((w) => w.mastery === key).length;
					return (
						<div key={key} className={cn("rounded-xl p-4", value.bg)}>
							<div className={cn("font-bold text-2xl", value.text)}>
								{count}
							</div>
							<div className={cn("text-sm", value.text)}>{value.label}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
