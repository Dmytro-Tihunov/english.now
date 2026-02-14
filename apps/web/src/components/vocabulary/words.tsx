import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, LayoutGrid, List, Loader2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/utils/trpc";
import { Button } from "../ui/button";

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const LEVEL_COLORS: Record<string, { bg: string }> = {
	A1: { bg: "bg-emerald-500" },
	A2: { bg: "bg-teal-500" },
	B1: { bg: "bg-blue-500" },
	B2: { bg: "bg-indigo-500" },
	C1: { bg: "bg-purple-500" },
	C2: { bg: "bg-rose-500" },
};

const MASTERY_LABELS: Record<string, string> = {
	new: "New",
	learning: "Learning",
	reviewing: "Reviewing",
	mastered: "Mastered",
};

const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function Words() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { data: words, isLoading } = useQuery(
		trpc.vocabulary.getVocabulary.queryOptions({ limit: 200 }),
	);

	const [viewMode, setViewMode] = useState<"grid" | "list">("list");
	const [selectedCategory, setSelectedCategory] = useState<string | "all">(
		"all",
	);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [newWord, setNewWord] = useState({
		word: "",
		translation: "",
		definition: "",
		level: "B1" as CEFRLevel,
		category: "",
	});

	const addWordMutation = useMutation(
		trpc.vocabulary.addWord.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.vocabulary.getVocabulary.queryKey(),
				});
				setAddDialogOpen(false);
				setNewWord({
					word: "",
					translation: "",
					definition: "",
					level: "B1",
					category: "",
				});
			},
		}),
	);

	const deleteWordMutation = useMutation(
		trpc.vocabulary.deleteWord.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.vocabulary.getVocabulary.queryKey(),
				});
			},
		}),
	);

	const categories = useMemo(() => {
		if (!words) return [];
		const cats = new Set(words.map((w) => w.category).filter(Boolean));
		return Array.from(cats) as string[];
	}, [words]);

	const filteredWords = useMemo(() => {
		if (!words) return [];
		if (selectedCategory === "all") return words;
		return words.filter((w) => w.category === selectedCategory);
	}, [words, selectedCategory]);

	const handleAddWord = () => {
		if (!newWord.word.trim() || !newWord.definition.trim()) return;
		addWordMutation.mutate({
			word: newWord.word.trim(),
			translation: newWord.translation.trim() || undefined,
			definition: newWord.definition.trim(),
			level: newWord.level,
			category: newWord.category.trim() || undefined,
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!words || words.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white/50 py-16 pb-24 dark:bg-slate-900/50">
				<div className="flex w-32 items-center justify-center">
					<img src="/icons/empty.png" alt="Empty state" />
				</div>
				<div className="mb-6 flex flex-col items-center justify-center gap-3">
					<h3 className="font-semibold text-lg">No words added yet</h3>
					<p className="max-w-sm text-center text-muted-foreground">
						Add words manually or explore lists to build your vocabulary.
					</p>
				</div>
				<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="size-4" />
							Add Your First Word
						</Button>
					</DialogTrigger>
					<AddWordDialogContent
						newWord={newWord}
						setNewWord={setNewWord}
						onSubmit={handleAddWord}
						isPending={addWordMutation.isPending}
					/>
				</Dialog>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="font-medium text-lg">
						{filteredWords.length} Words
					</span>
				</div>
				<div className="flex items-center gap-2">
					{categories.length > 0 && (
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="rounded-lg border bg-white/80 px-3 py-1.5 text-sm"
						>
							<option value="all">All Categories</option>
							{categories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
					)}
					<div className="flex items-center rounded-2xl border border-border/50 bg-muted/50 p-0.5">
						<Button
							variant={viewMode === "list" ? "secondary" : "ghost"}
							size="icon"
							className={cn("size-7", viewMode === "list" && "bg-white")}
							onClick={() => setViewMode("list")}
						>
							<List className="size-4" />
						</Button>
						<Button
							variant={viewMode === "grid" ? "secondary" : "ghost"}
							size="icon"
							className={cn("size-7", viewMode === "grid" && "bg-white")}
							onClick={() => setViewMode("grid")}
						>
							<LayoutGrid className="size-4" />
						</Button>
					</div>
					<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
						<DialogTrigger asChild>
							<button
								type="button"
								className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl bg-linear-to-t from-[#202020] to-[#2F2F2F] font-base text-white shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.4)] outline-none backdrop-blur transition-all hover:opacity-90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:from-[rgb(192,192,192)] dark:to-[rgb(255,255,255)] dark:shadow-[inset_0_1px_4px_0_rgba(128,128,128,0.2)] dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none"
							>
								<Plus className="size-4" />
							</button>
						</DialogTrigger>
						<AddWordDialogContent
							newWord={newWord}
							setNewWord={setNewWord}
							onSubmit={handleAddWord}
							isPending={addWordMutation.isPending}
						/>
					</Dialog>
				</div>
			</div>
			{viewMode === "list" ? (
				<div className="space-y-2">
					{filteredWords.map((word) => (
						<div
							key={word.id}
							className="group flex items-center justify-between rounded-xl border bg-white p-4 transition-all hover:shadow-sm dark:bg-slate-900"
						>
							<div className="flex items-center gap-4">
								<div
									className={cn(
										"flex size-10 items-center justify-center rounded-lg font-bold text-sm text-white",
										LEVEL_COLORS[word.level]?.bg ?? "bg-blue-500",
									)}
								>
									{word.level}
								</div>
								<div>
									<div className="flex items-center gap-2">
										<span className="font-semibold">{word.word}</span>
									</div>
									<p className="line-clamp-1 text-muted-foreground text-sm">
										{word.definition}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{word.translation && (
									<span className="text-muted-foreground text-xs">
										{word.translation}
									</span>
								)}
								<Badge
									variant={
										word.mastery === "mastered"
											? "mastered"
											: word.mastery === "learning"
												? "learning"
												: word.mastery === "new"
													? "notStarted"
													: "secondary"
									}
								>
									{MASTERY_LABELS[word.mastery] ?? word.mastery}
								</Badge>
								<button
									type="button"
									onClick={() => deleteWordMutation.mutate({ wordId: word.id })}
									className="ml-1 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
								>
									<Trash2 className="size-3.5" />
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredWords.map((word) => (
						<div
							key={word.id}
							className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900"
						>
							<button
								type="button"
								onClick={() => deleteWordMutation.mutate({ wordId: word.id })}
								className="absolute top-3 right-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
							>
								<Trash2 className="size-3.5" />
							</button>
							<div className="mb-3 flex items-center justify-between">
								<Badge variant={word.level as CEFRLevel}>{word.level}</Badge>
								<Badge
									variant={
										word.mastery === "mastered"
											? "mastered"
											: word.mastery === "learning"
												? "learning"
												: word.mastery === "new"
													? "notStarted"
													: "secondary"
									}
									className="text-xs"
								>
									{MASTERY_LABELS[word.mastery] ?? word.mastery}
								</Badge>
							</div>
							<h3 className="mb-1 font-bold text-lg">{word.word}</h3>
							<p className="line-clamp-2 text-muted-foreground text-sm">
								{word.definition}
							</p>
							{word.translation && (
								<div className="mt-3 flex items-center gap-1 text-muted-foreground text-xs">
									<Globe className="size-3" />
									{word.translation}
								</div>
							)}
							{word.tags && (word.tags as string[]).length > 0 && (
								<div className="mt-3 flex gap-1">
									{(word.tags as string[]).slice(0, 2).map((tag) => (
										<span
											key={tag}
											className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs"
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Add Word Dialog ──────────────────────────────────────────────────────────

function AddWordDialogContent({
	newWord,
	setNewWord,
	onSubmit,
	isPending,
}: {
	newWord: {
		word: string;
		translation: string;
		definition: string;
		level: CEFRLevel;
		category: string;
	};
	setNewWord: React.Dispatch<
		React.SetStateAction<{
			word: string;
			translation: string;
			definition: string;
			level: CEFRLevel;
			category: string;
		}>
	>;
	onSubmit: () => void;
	isPending: boolean;
}) {
	return (
		<DialogContent className="sm:max-w-md">
			<DialogHeader>
				<DialogTitle className="font-bold font-lyon text-xl">
					Add New Word
				</DialogTitle>
			</DialogHeader>
			<div className="space-y-4 py-2">
				<div className="space-y-2">
					<Label htmlFor="word">Word</Label>
					<Input
						id="word"
						placeholder="e.g., serendipity"
						value={newWord.word}
						onChange={(e) =>
							setNewWord((prev) => ({ ...prev, word: e.target.value }))
						}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="translation">Translation</Label>
					<Input
						id="translation"
						placeholder="Translation in your language"
						value={newWord.translation}
						onChange={(e) =>
							setNewWord((prev) => ({ ...prev, translation: e.target.value }))
						}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="definition">Definition</Label>
					<Input
						id="definition"
						placeholder="A clear, concise definition"
						value={newWord.definition}
						onChange={(e) =>
							setNewWord((prev) => ({ ...prev, definition: e.target.value }))
						}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="level">Level</Label>
						<select
							id="level"
							value={newWord.level}
							onChange={(e) =>
								setNewWord((prev) => ({
									...prev,
									level: e.target.value as CEFRLevel,
								}))
							}
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
						>
							{CEFR_LEVELS.map((lvl) => (
								<option key={lvl} value={lvl}>
									{lvl}
								</option>
							))}
						</select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Input
							id="category"
							placeholder="e.g., Business"
							value={newWord.category}
							onChange={(e) =>
								setNewWord((prev) => ({ ...prev, category: e.target.value }))
							}
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<DialogClose asChild>
					<Button variant="outline">Cancel</Button>
				</DialogClose>
				<Button
					onClick={onSubmit}
					disabled={
						!newWord.word.trim() || !newWord.definition.trim() || isPending
					}
				>
					{isPending ? (
						<Loader2 className="mr-2 size-4 animate-spin" />
					) : (
						<Plus className="mr-2 size-4" />
					)}
					Add Word
				</Button>
			</div>
		</DialogContent>
	);
}
