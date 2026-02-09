import { env } from "@english.now/env/client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, MessageCircleIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function DialogTopics({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const navigate = useNavigate();
	const [selectedScenario, setSelectedScenario] = useState<string>("");

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

	// Create conversation and navigate directly to session
	const startConversation = useMutation({
		mutationFn: async (input: { scenario: string }) => {
			const response = await fetch(
				`${env.VITE_SERVER_URL}/api/conversation/start`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(input),
				},
			);
			if (!response.ok) throw new Error("Failed to start conversation");
			return response.json() as Promise<{ sessionId: string }>;
		},
		onSuccess: (data) => {
			setOpen(false);
			navigate({
				to: "/conversation/$sessionId",
				params: { sessionId: data.sessionId },
			});
		},
	});

	const handleStartConversation = () => {
		if (selectedScenario) {
			startConversation.mutate({
				scenario: selectedScenario,
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-2xl">
				<h1 className="mt-3 mb-5 text-center font-bold font-lyon text-4xl tracking-tight">
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

				{/* Start Button */}
				<Button
					size="lg"
					className="rounded-xl bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] text-black text-sm"
					onClick={handleStartConversation}
					disabled={!selectedScenario || startConversation.isPending}
				>
					{startConversation.isPending ? (
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

export default function Conversation() {
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
		<div
			className="overflow-hidden rounded-[1.2rem] bg-white"
			style={{
				boxShadow:
					"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
			}}
		>
			<DialogTopics open={dialogOpen} setOpen={setDialogOpen} />
			<div className="p-0">
				<button
					type="button"
					onClick={() => setDialogOpen(true)}
					className="group flex w-full cursor-pointer items-center justify-between border-black/5 border-b p-4 transition-colors duration-300 hover:bg-neutral-100"
				>
					<div className="flex items-center gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#C6F64D] bg-radial from-[#EFFF9B] to-[#D8FF76]">
							<MessageCircleIcon className="size-5 text-lime-700" />
						</div>
						<div className="text-left">
							<h2 className="font-semibold text-slate-900">Conversation</h2>
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
							className="group flex animate-fade-in-up items-center gap-1 rounded-xl border border-lime-600 border-dashed bg-lime-100/80 px-2.5 py-1.5 font-semibold text-lime-700 text-sm hover:border-lime-600 hover:border-solid hover:bg-lime-100"
						>
							Custom Topic
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
