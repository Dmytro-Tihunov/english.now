import {
	Briefcase,
	ChefHat,
	ChevronRight,
	Code,
	GraduationCap,
	Palette,
	Plane,
	Stethoscope,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface VocabularyCategory {
	id: string;
	name: string;
	icon: React.ReactNode;
	description: string;
	wordCount: number;
	color: string;
}

// Pre-generated vocabulary data
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

export default function Explore() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="group flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-xl border border-neutral-200 bg-linear-to-b from-neutral-50 to-neutral-100 px-2.5 py-1.5 font-medium text-neutral-700 text-sm italic shadow-none transition duration-150 ease-in-out will-change-transform hover:brightness-95 focus:shadow-none focus:outline-none focus-visible:shadow-none"
				>
					Explore
					<span className="font-lyon text-lg text-neutral-700/80 italic group-hover:text-neutral-700">
						lists
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="flex max-h-[600px] min-w-4xl flex-col overflow-hidden p-0">
				<DialogHeader className="shrink-0 p-4">
					<DialogTitle className="font-bold font-lyon text-2xl">
						Explore Lists
					</DialogTitle>
					{/* <DialogClose asChild>
					<Button variant="ghost" size="icon">
						<X className="h-4 w-4" />
					</Button>
				</DialogClose> */}
				</DialogHeader>
				{!selectedCategory && (
					<div className="grid min-h-0 flex-1 grid-cols-4 gap-8 px-4">
						<div className="col-span-1 flex flex-col gap-2 overflow-y-auto pt-5">
							<button
								type="button"
								className="group relative overflow-hidden rounded-xl bg-neutral-100 px-2.5 py-2 text-left font-medium text-sm transition-all hover:bg-accent"
							>
								All Categories
							</button>
							{VOCABULARY_CATEGORIES.sort((a, b) =>
								a.name.localeCompare(b.name),
							).map((category) => (
								<button
									type="button"
									key={category.id}
									onClick={() => setSelectedCategory(category.id)}
									className="group relative overflow-hidden rounded-xl px-2.5 py-2 text-left font-medium text-sm transition-all hover:bg-accent"
								>
									{category.name}
								</button>
							))}
						</div>
						<div
							className="col-span-3 overflow-y-auto scroll-smooth py-5"
							style={{ scrollbarWidth: "none" }}
						>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{VOCABULARY_CATEGORIES.map((category) => (
									<button
										type="button"
										key={category.id}
										onClick={() => setSelectedCategory(category.id)}
										className="group rounded-2xl border bg-white p-3 text-left transition-all"
									>
										<div
											className={cn(
												"mb-4 flex size-9 items-center justify-center rounded-xl bg-linear-to-br text-white",
												category.color,
											)}
										>
											{category.icon}
										</div>
										<h3 className="font-semibold">{category.name}</h3>
										<p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
											{category.description}
										</p>
										<div className="mt-3 flex items-center justify-between">
											<span className="text-muted-foreground text-xs">
												{category.wordCount} words
											</span>
											<ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
										</div>
									</button>
								))}
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
