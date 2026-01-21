import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Bookmark, BookOpen, Dumbbell, Lock, Sparkles } from "lucide-react";
import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

// CEFR level colors for borders
export const CEFR_COLORS = {
	A1: {
		border: "border-emerald-500",
		bg: "bg-emerald-500",
		text: "text-emerald-600 dark:text-emerald-400",
		glow: "shadow-emerald-500/25",
	},
	A2: {
		border: "border-teal-500",
		bg: "bg-teal-500",
		text: "text-teal-600 dark:text-teal-400",
		glow: "shadow-teal-500/25",
	},
	B1: {
		border: "border-blue-500",
		bg: "bg-blue-500",
		text: "text-blue-600 dark:text-blue-400",
		glow: "shadow-blue-500/25",
	},
	B2: {
		border: "border-indigo-500",
		bg: "bg-indigo-500",
		text: "text-indigo-600 dark:text-indigo-400",
		glow: "shadow-indigo-500/25",
	},
	C1: {
		border: "border-purple-500",
		bg: "bg-purple-500",
		text: "text-purple-600 dark:text-purple-400",
		glow: "shadow-purple-500/25",
	},
	C2: {
		border: "border-rose-500",
		bg: "bg-rose-500",
		text: "text-rose-600 dark:text-rose-400",
		glow: "shadow-rose-500/25",
	},
} as const;

// Mastery level colors for fills
export const MASTERY_COLORS = {
	not_started: {
		fill: "bg-gray-100 dark:bg-gray-800",
		text: "text-gray-500",
		label: "Not started",
	},
	struggling: {
		fill: "bg-red-50 dark:bg-red-950/50",
		text: "text-red-600 dark:text-red-400",
		label: "Needs practice",
	},
	learning: {
		fill: "bg-amber-50 dark:bg-amber-950/50",
		text: "text-amber-600 dark:text-amber-400",
		label: "Learning",
	},
	mastered: {
		fill: "bg-green-50 dark:bg-green-950/50",
		text: "text-green-600 dark:text-green-400",
		label: "Mastered",
	},
} as const;

export type GrammarLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type MasteryLevel =
	| "not_started"
	| "struggling"
	| "learning"
	| "mastered";

export interface GrammarNodeData extends Record<string, unknown> {
	label: string;
	level: GrammarLevel;
	mastery: MasteryLevel;
	isLocked: boolean;
	lockedReason?: string;
	stepNumber?: number;
	onLearn?: () => void;
	onQuiz?: () => void;
	onAskAI?: () => void;
	onBookmark?: () => void;
	isBookmarked?: boolean;
}

function GrammarNodeComponent({ data, selected }: NodeProps<GrammarNodeData>) {
	const [isHovered, setIsHovered] = useState(false);

	const cefrColors = CEFR_COLORS[data.level];
	const masteryColors = MASTERY_COLORS[data.mastery];

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Main Node */}
			<div
				className={cn(
					"relative min-w-[140px] rounded-xl border-2 px-4 py-3 transition-all duration-200",
					cefrColors.border,
					masteryColors.fill,
					selected && `shadow-lg ${cefrColors.glow}`,
					data.isLocked && "opacity-60",
					!data.isLocked && "cursor-pointer hover:shadow-md",
				)}
			>
				{/* Step number badge (for guided path) */}
				{data.stepNumber && (
					<div
						className={cn(
							"-left-3 -top-3 absolute flex h-6 w-6 items-center justify-center rounded-full font-bold text-white text-xs",
							cefrColors.bg,
						)}
					>
						{data.stepNumber}
					</div>
				)}

				{/* Lock indicator */}
				{data.isLocked && (
					<div className="-right-2 -top-2 absolute flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-white">
						<Lock className="h-3 w-3" />
					</div>
				)}

				{/* Bookmark indicator */}
				{data.isBookmarked && !data.isLocked && (
					<div className="-right-2 -top-2 absolute flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
						<Bookmark className="h-3 w-3 fill-current" />
					</div>
				)}

				{/* CEFR badge */}
				<div
					className={cn(
						"mb-1 inline-block rounded px-1.5 py-0.5 font-bold text-[10px]",
						cefrColors.bg,
						"text-white",
					)}
				>
					{data.level}
				</div>

				{/* Title */}
				<div className="font-semibold text-foreground text-sm leading-tight">
					{data.label}
				</div>

				{/* Mastery indicator */}
				<div className={cn("mt-1 font-medium text-[10px]", masteryColors.text)}>
					{masteryColors.label}
				</div>
			</div>

			{/* Hover Actions Popup */}
			{isHovered && !data.isLocked && (
				<div
					className={cn(
						"-translate-x-1/2 fade-in-0 zoom-in-95 slide-in-from-top-2 absolute left-1/2 z-50 animate-in duration-150",
						"top-full mt-2",
					)}
				>
					<div className="flex gap-1 rounded-lg border bg-background/95 p-1.5 shadow-xl backdrop-blur">
						<Button
							size="sm"
							variant="ghost"
							className="h-8 gap-1.5 px-2 text-xs"
							onClick={(e) => {
								e.stopPropagation();
								data.onLearn?.();
							}}
						>
							<BookOpen className="h-3.5 w-3.5" />
							Learn
						</Button>
						<Button
							size="sm"
							variant="ghost"
							className="h-8 gap-1.5 px-2 text-xs"
							onClick={(e) => {
								e.stopPropagation();
								data.onQuiz?.();
							}}
						>
							<Dumbbell className="h-3.5 w-3.5" />
							Quiz
						</Button>
						<Button
							size="sm"
							variant="ghost"
							className="h-8 gap-1.5 px-2 text-xs"
							onClick={(e) => {
								e.stopPropagation();
								data.onAskAI?.();
							}}
						>
							<Sparkles className="h-3.5 w-3.5" />
							AI
						</Button>
						<Button
							size="sm"
							variant={data.isBookmarked ? "secondary" : "ghost"}
							className="h-8 w-8 p-0"
							onClick={(e) => {
								e.stopPropagation();
								data.onBookmark?.();
							}}
						>
							<Bookmark
								className={cn(
									"h-3.5 w-3.5",
									data.isBookmarked && "fill-current",
								)}
							/>
						</Button>
					</div>
				</div>
			)}

			{/* Locked tooltip */}
			{isHovered && data.isLocked && data.lockedReason && (
				<div className="-translate-x-1/2 fade-in-0 zoom-in-95 absolute top-full left-1/2 z-50 mt-2 animate-in duration-150">
					<div className="max-w-[200px] rounded-lg border bg-background/95 p-3 shadow-xl backdrop-blur">
						<div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
							<Lock className="h-4 w-4" />
							<span className="font-medium text-xs">Complete first:</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							{data.lockedReason}
						</p>
					</div>
				</div>
			)}

			{/* Handles for connections */}
			<Handle
				type="target"
				position={Position.Top}
				className="!h-2 !w-2 !border-2 !border-background !bg-muted-foreground"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!h-2 !w-2 !border-2 !border-background !bg-muted-foreground"
			/>
		</div>
	);
}

export const GrammarNode = memo(GrammarNodeComponent);
