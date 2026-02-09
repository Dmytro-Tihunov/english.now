import { BookOpen, Brain, LayoutGrid, List, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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

export default function Phrases() {
	const [customLists, setCustomLists] = useState<CustomList[]>([]);
	const [isBrainstorming, setIsBrainstorming] = useState(false);
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
						<h3 className="font-semibold text-lg">No phrases added yet</h3>
						<p className="max-w-sm text-center text-muted-foreground">
							Add phrases to your vocabulary to track your progress and improve
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
						<div className="font-medium text-lg">Phrases</div>
						<div className="flex items-center gap-3">
							<select
								value={selectedLevel}
								onChange={(e) =>
									setSelectedLevel(e.target.value as CEFRLevel | "all")
								}
								className="rounded-lg border bg-white/80 px-3 py-2 text-sm backdrop-blur dark:bg-slate-800/80"
							>
								<option value="all">All Levels</option>
								<option value="A1">A1</option>
								<option value="A2">A2</option>
								<option value="B1">B1</option>
								<option value="B2">B2</option>
								<option value="C1">C1</option>
								<option value="C2">C2</option>
							</select>
							<div className="flex rounded-lg bg-neutral-100 backdrop-blur">
								<Button
									variant={viewMode === "list" ? "secondary" : "ghost"}
									size="icon"
									className="size-7"
									onClick={() => setViewMode("list")}
								>
									<List className="size-4" />
								</Button>
								<Button
									variant={viewMode === "grid" ? "secondary" : "ghost"}
									size="icon"
									className="size-7"
									onClick={() => setViewMode("grid")}
								>
									<LayoutGrid className="size-4" />
								</Button>
							</div>
						</div>{" "}
					</div>
					{/* <Button
								type="button"
								variant="outline"
								onClick={() => setIsBrainstorming(true)}
								className="gap-2 rounded-xl"
							>
								<SparklesIcon className="size-4" />
								New List
							</Button> */}
					{/*
					 */}

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{customLists.map((list) => (
							<Card key={list.id} className="overflow-hidden">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-base">{list.name}</CardTitle>
											<CardDescription className="mt-1">
												{list.description}
											</CardDescription>
										</div>
										<Badge variant="secondary">{list.words.length} words</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex flex-wrap gap-1">
										{list.tags.map((tag) => (
											<Badge key={tag} variant="outline" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="secondary"
											className="flex-1 gap-1"
										>
											<BookOpen className="h-3 w-3" />
											Study
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="flex-1 gap-1"
										>
											<Brain className="h-3 w-3" />
											Quiz
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
						<button
							type="button"
							onClick={() => setIsBrainstorming(true)}
							className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-muted-foreground transition-colors hover:border-[#DCFF6F] hover:bg-[#DCFF6F]/5"
						>
							<span className="font-medium">Create New List</span>
						</button>
					</div>
				</div>
			)}
		</>
	);
}
