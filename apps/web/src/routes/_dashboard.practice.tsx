import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	Loader2,
	MessageCircleIcon,
	MicIcon,
	SparklesIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dashboard/practice")({
	component: RouteComponent,
});

function DialogTopics({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const navigate = useNavigate();
	const [selectedScenario, setSelectedScenario] = useState<string>("");
	const [selectedLevel, setSelectedLevel] = useState<string>("");
	const [isStarting, setIsStarting] = useState(false);

	const SCENARIOS = [
		{ id: "job-interview", name: "Job Interview", icon: "💼" },
		{ id: "restaurant-order", name: "Restaurant Ordering", icon: "🍽️" },
		{ id: "travel-directions", name: "Asking for Directions", icon: "🗺️" },
		{ id: "small-talk", name: "Casual Small Talk", icon: "💬" },
		{ id: "doctor-visit", name: "Doctor's Appointment", icon: "🏥" },
		{ id: "shopping", name: "Shopping Experience", icon: "🛍️" },
	] as const;

	const LEVELS = [
		{
			id: "beginner",
			name: "Beginner",
			description: "Simple words and phrases",
		},
		{
			id: "intermediate",
			name: "Intermediate",
			description: "Everyday conversations",
		},
		{ id: "advanced", name: "Advanced", description: "Complex discussions" },
	] as const;

	const handleStartConversation = () => {
		if (selectedScenario && selectedLevel) {
			setIsStarting(true);
			setOpen(false);
			navigate({
				to: "/conversation",
				search: {
					scenario: selectedScenario,
					level: selectedLevel,
					autostart: true,
				},
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-2xl">
				<h1 className="mt-3 mb-5 text-center font-bold font-lyon text-3xl tracking-tight">
					What would you like to talk about?
				</h1>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{SCENARIOS.map((scenario) => (
						<button
							key={scenario.id}
							type="button"
							onClick={() => setSelectedScenario(scenario.id)}
							className={cn(
								"flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:border-border/50 hover:bg-neutral-100",
								selectedScenario === scenario.id
									? "border-border bg-neutral-100"
									: "border-transparent bg-neutral-50",
							)}
						>
							<span className="text-2xl">{scenario.icon}</span>
							<span className="font-medium text-sm">{scenario.name}</span>
						</button>
					))}
				</div>

				{/* Level Selection */}
				<div className="space-y-3">
					<p className="font-medium text-sm">Select your level</p>
					<div className="grid grid-cols-3 gap-3">
						{LEVELS.map((level) => (
							<button
								key={level.id}
								type="button"
								onClick={() => setSelectedLevel(level.id)}
								className={cn(
									"flex flex-col gap-1 rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50",
									selectedLevel === level.id
										? "border-primary bg-primary/5"
										: "border-transparent bg-muted/30",
								)}
							>
								<span className="font-medium">{level.name}</span>
								<span className="text-muted-foreground text-xs">
									{level.description}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Start Button */}
				<Button
					size="lg"
					className="rounded-xl bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] text-black text-sm"
					onClick={handleStartConversation}
					disabled={!selectedScenario || !selectedLevel || isStarting}
				>
					{isStarting ? (
						<Loader2 className="size-5 animate-spin" />
					) : (
						<SparklesIcon className="size-5" />
					)}
					Start Conversation
				</Button>
			</DialogContent>
		</Dialog>
	);
}

function RouteComponent() {
	const [dialogOpen, setDialogOpen] = useState(false);

	const TOPICS = [
		{ id: "travel", name: "Travel", icon: "✈️" },
		{ id: "food", name: "Food", icon: "🍕" },
		{ id: "home", name: "Home", icon: "🏠" },
		{ id: "family", name: "Family", icon: "👪" },
		{ id: "work", name: "Work", icon: "💼" },
		{ id: "school", name: "School", icon: "🎓" },
		{ id: "other", name: "Other", icon: "🌍" },
	] as const;

	return (
		<div className="min-h-screen">
			<DialogTopics open={dialogOpen} setOpen={setDialogOpen} />
			<div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
				<div className="mb-6 flex flex-col gap-1">
					<div>
						<h1 className="font-bold font-lyon text-3xl tracking-tight md:text-4xl">
							Practice
						</h1>
					</div>
				</div>

				<div className="mb-10 border-black/5 border-b pb-8">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div
							className="overflow-hidden rounded-3xl bg-white"
							style={{
								boxShadow:
									"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
							}}
						>
							<div className="p-0">
								<button
									type="button"
									onClick={() => setDialogOpen(true)}
									className="group flex w-full items-center justify-between border-black/5 border-b p-4 transition-colors duration-300 hover:bg-neutral-100"
								>
									<div className="flex items-center gap-3">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#C6F64D] bg-radial from-[#EFFF9B] to-[#D8FF76]">
											<MessageCircleIcon className="size-5 text-lime-700" />
										</div>
										<div className="text-left">
											<h2 className="font-semibold text-slate-900">
												Conversation
											</h2>
											<p className="text-muted-foreground text-sm">
												Practice your English
											</p>
										</div>
									</div>
									<svg
										className="relative size-5 text-gray-400 transition-all duration-300 group-hover:text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
								<div className="p-4">
									<div className="flex flex-wrap gap-2">
										{TOPICS.map((topic) => (
											<button
												type="button"
												onClick={() => setDialogOpen(true)}
												key={topic.id}
												className="group flex animate-fade-in-up not-last:items-center rounded-xl border bg-neutral-100/80 px-2.5 py-1.5 font-semibold text-sm hover:border-lime-500 hover:bg-lime-100"
											>
												{topic.icon} {topic.name}
											</button>
										))}
										<button
											type="button"
											onClick={() => setDialogOpen(true)}
											className="group flex animate-fade-in-up items-center gap-1 rounded-xl border border-lime-500 border-dashed bg-lime-100/80 px-2.5 py-1.5 font-semibold text-lime-700 text-sm hover:border-lime-500 hover:bg-lime-100"
										>
											<SparklesIcon className="size-4 text-lime-700" />
											Custom Topic
										</button>
									</div>
								</div>
							</div>
						</div>
						<div
							className="overflow-hidden rounded-3xl bg-white"
							style={{
								boxShadow:
									"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
							}}
						>
							<Link
								to="/pronunciation"
								className="group flex w-full items-center justify-between border-black/5 border-b p-4 transition-colors duration-300 hover:bg-neutral-100"
							>
								<div className="flex items-center gap-2.5">
									<div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#C6F64D] bg-radial from-[#EFFF9B] to-[#D8FF76]">
										<MicIcon className="size-5 text-lime-700" />
									</div>
									<div className="text-left">
										<h2 className="font-semibold text-slate-900">
											Pronunciation
										</h2>
										<p className="text-muted-foreground text-sm">
											Practice your pronunciation
										</p>
									</div>
								</div>
								<svg
									className="relative size-5 text-gray-400 transition-all duration-300 group-hover:text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
							<div className="p-4">
								<p className="text-muted-foreground text-sm">
									Practice your pronunciation
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="">
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-center gap-2">
							<div className="flex flex-col items-center gap-2">
								<img src="/test.png" alt="Empty state" className="w-1/4" />
								<p className="font-medium text-xl">
									You don’t have records yet
								</p>
								<p className="text-muted-foreground">
									Most people create multiple records daily to get better at
									speaking
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
