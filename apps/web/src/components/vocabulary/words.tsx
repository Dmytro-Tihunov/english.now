import { LayoutGrid, List, Plus } from "lucide-react";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type MasteryLevel = "new" | "learning" | "reviewing" | "mastered";

interface CustomList {
	id: string;
	name: string;
	description: string;
	words: VocabularyWord[];
	createdAt: Date;
	tags: string[];
}

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
export default function Words() {
	const [customLists, setCustomLists] = useState<CustomList[]>([
		{
			id: "1",
			name: "Phrases",
			description: "Phrases",
			words: [],
			createdAt: new Date(),
			tags: [],
		},
	]);
	const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | "all">("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("list");
	return (
		<>
			{customLists.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white/50 py-16 pb-24 dark:bg-slate-900/50">
					<div className="flex w-32 items-center justify-center">
						<img src="/icons/empty.png" alt="Empty state" />
					</div>
					<div className="mb-6 flex flex-col items-center justify-center gap-3">
						<h3 className="font-semibold text-lg">No words added yet</h3>
						<p className="max-w-sm text-center text-muted-foreground">
							Add words to your vocabulary to track your progress and improve
							your language skills.
						</p>
					</div>
					<div className="flex">
						<Button
							type="button"
							variant="outline"
							className="group flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-xl border border-neutral-200 bg-linear-to-b from-neutral-50 to-neutral-100 px-2.5 py-1.5 font-medium text-neutral-700 text-sm shadow-none transition duration-150 ease-in-out will-change-transform hover:brightness-95 focus:shadow-none focus:outline-none focus-visible:shadow-none"
						>
							<Plus className="size-4" />
							Add Manually
						</Button>
					</div>
				</div>
			) : (
				<div>
					<div className="mb-2 flex items-center justify-between">
						<div className="font-medium text-lg">Words</div>
						<div className="flex items-center gap-3">
							{/* <Select value={selectedLevel}>
								<SelectTrigger className="rounded-lg border bg-white/80 px-3 py-2 text-sm backdrop-blur dark:bg-slate-800/80">
									<SelectValue placeholder="Level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Levels</SelectItem>
									<SelectItem value="A1">A1</SelectItem>
									<SelectItem value="A2">A2</SelectItem>
									<SelectItem value="B1">B1</SelectItem>
									<SelectItem value="B2">B2</SelectItem>
									<SelectItem value="C1">C1</SelectItem>
									<SelectItem value="C2">C2</SelectItem>
								</SelectContent>
							</Select> */}
							<div className="flex rounded-lg bg-neutral-100 backdrop-blur">
								<Button
									variant={viewMode === "list" ? "secondary" : "ghost"}
									size="icon"
									className="size-8"
									onClick={() => setViewMode("list")}
								>
									<List className="size-4" />
								</Button>
								<Button
									variant={viewMode === "grid" ? "secondary" : "ghost"}
									size="icon"
									className="size-8"
									onClick={() => setViewMode("grid")}
								>
									<LayoutGrid className="size-4" />
								</Button>
							</div>
							<button
								type="button"
								className="flex size-8 items-center justify-center rounded-lg bg-linear-to-t from-[#202020] to-[#2F2F2F] text-white backdrop-blur"
							>
								<Plus className="size-4" />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
