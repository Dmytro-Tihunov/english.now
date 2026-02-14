import { env } from "@english.now/env/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
	BookOpen,
	Check,
	GraduationCap,
	Loader2,
	MessageSquare,
	Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/functions/get-profile";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/utils/trpc";

export const Route = createFileRoute("/generating")({
	beforeLoad: async () => {
		const profile = await getProfile();
		if (!profile?.isOnboardingCompleted) {
			throw redirect({ to: "/onboarding" });
		}
		return { profile };
	},
	component: GeneratingPage,
});

type GenerationStep = {
	id: string;
	label: string;
	icon: typeof Sparkles;
	status: "pending" | "active" | "completed" | "error";
};

function GeneratingPage() {
	const navigate = useNavigate();
	const trpc = useTRPC();
	const abortRef = useRef<AbortController | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [steps, setSteps] = useState<GenerationStep[]>([
		{
			id: "outline",
			label: "Creating your course structure",
			icon: GraduationCap,
			status: "pending",
		},
		{
			id: "lessons",
			label: "Generating personalized lessons",
			icon: BookOpen,
			status: "pending",
		},
		{
			id: "vocabulary",
			label: "Building your vocabulary",
			icon: MessageSquare,
			status: "pending",
		},
		{
			id: "phrases",
			label: "Preparing phrases & expressions",
			icon: Sparkles,
			status: "pending",
		},
	]);

	// Check if user already has a ready learning path
	const statusQuery = useQuery(trpc.content.getGenerationStatus.queryOptions());

	useEffect(() => {
		if (statusQuery.data?.status === "ready") {
			navigate({ to: "/home" });
		}
	}, [statusQuery.data, navigate]);

	const updateStepStatus = useCallback(
		(stepId: string, status: GenerationStep["status"]) => {
			setSteps((prev) =>
				prev.map((s) => {
					if (s.id === stepId) return { ...s, status };
					// Mark previous steps as completed when a new step becomes active
					if (
						status === "active" &&
						prev.findIndex((p) => p.id === s.id) <
							prev.findIndex((p) => p.id === stepId)
					) {
						return { ...s, status: "completed" };
					}
					return s;
				}),
			);
		},
		[],
	);

	const startGeneration = useCallback(async () => {
		setError(null);
		setSteps((prev) => prev.map((s) => ({ ...s, status: "pending" })));

		// Set first step as active
		updateStepStatus("outline", "active");

		const controller = new AbortController();
		abortRef.current = controller;

		try {
			const session = await authClient.getSession();
			const headers = session.data?.session
				? {
						Cookie: `better-auth.session_token=${session.data.session.token}`,
					}
				: {};

			const response = await fetch(
				`${env.VITE_SERVER_URL}/api/content/generate`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...headers,
					},
					credentials: "include",
					signal: controller.signal,
				},
			);

			if (!response.ok) {
				// Check if it's a JSON response (already exists / generating)
				const contentType = response.headers.get("content-type");
				if (contentType?.includes("application/json")) {
					const json = await response.json();
					if (json.status === "already_exists") {
						navigate({ to: "/home" });
						return;
					}
					if (json.status === "generating") {
						// Already generating, just poll
						setError(
							"Content is being generated. Please wait a moment and try again.",
						);
						return;
					}
				}
				throw new Error(`Server error: ${response.status}`);
			}

			// Check if the response is JSON (already_exists case with 200)
			const contentType = response.headers.get("content-type");
			if (contentType?.includes("application/json")) {
				const json = await response.json();
				if (json.status === "already_exists") {
					navigate({ to: "/home" });
					return;
				}
			}

			// Parse SSE stream
			const reader = response.body?.getReader();
			const decoder = new TextDecoder();

			if (!reader) {
				throw new Error("No response body");
			}

			let buffer = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() ?? "";

				for (const line of lines) {
					if (line.startsWith("data:")) {
						const dataStr = line.slice(5).trim();
						if (!dataStr) continue;

						try {
							const eventData = JSON.parse(dataStr);

							if (eventData.step) {
								if (eventData.step === "complete") {
									// Mark all steps completed
									setSteps((prev) =>
										prev.map((s) => ({
											...s,
											status: "completed",
										})),
									);
									// Brief delay then redirect
									setTimeout(() => {
										navigate({ to: "/home" });
									}, 1500);
									return;
								}

								// Mark current step as active
								updateStepStatus(eventData.step, "active");
							}
						} catch {
							// Skip malformed JSON
						}
					}

					if (line.startsWith("event:")) {
						const eventName = line.slice(6).trim();
						if (eventName === "error") {
							// Next data line will have the error
						}
						if (eventName === "done") {
							setSteps((prev) =>
								prev.map((s) => ({
									...s,
									status: "completed",
								})),
							);
							setTimeout(() => {
								navigate({ to: "/home" });
							}, 1500);
							return;
						}
					}
				}
			}
		} catch (err) {
			if (controller.signal.aborted) return;
			console.error("Generation error:", err);
			setError(
				err instanceof Error
					? err.message
					: "Something went wrong. Please try again.",
			);
			setSteps((prev) =>
				prev.map((s) =>
					s.status === "active" ? { ...s, status: "error" } : s,
				),
			);
		}
	}, [navigate, updateStepStatus]);

	// Auto-start generation on mount
	useEffect(() => {
		if (statusQuery.data?.status === "ready") return;
		if (statusQuery.isLoading) return;
		startGeneration();

		return () => {
			abortRef.current?.abort();
		};
	}, [statusQuery.data, statusQuery.isLoading]);

	const progress = steps.filter((s) => s.status === "completed").length * 25;

	return (
		<div className="flex min-h-dvh flex-col items-center justify-center bg-background p-6">
			<div className="w-full max-w-md space-y-8">
				{/* Logo */}
				<div className="flex justify-center">
					<Logo />
				</div>

				{/* Title */}
				<div className="space-y-2 text-center">
					<h1 className="font-bold text-2xl tracking-tight">
						Preparing Your Learning Path
					</h1>
					<p className="text-muted-foreground text-sm">
						We're creating a personalized course just for you. This takes about
						30 seconds.
					</p>
				</div>

				{/* Progress bar */}
				<div className="space-y-2">
					<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
						<div
							className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<p className="text-center text-muted-foreground text-xs">
						{progress}% complete
					</p>
				</div>

				{/* Steps */}
				<div className="space-y-3">
					{steps.map((step) => {
						const Icon = step.icon;
						return (
							<div
								key={step.id}
								className={cn(
									"flex items-center gap-3 rounded-lg border p-3 transition-all duration-300",
									step.status === "active" && "border-primary/50 bg-primary/5",
									step.status === "completed" &&
										"border-green-500/30 bg-green-50 dark:bg-green-950/20",
									step.status === "error" &&
										"border-red-500/30 bg-red-50 dark:bg-red-950/20",
									step.status === "pending" && "border-transparent opacity-50",
								)}
							>
								<div
									className={cn(
										"flex size-8 items-center justify-center rounded-full",
										step.status === "active" && "bg-primary/10 text-primary",
										step.status === "completed" &&
											"bg-green-100 text-green-600 dark:bg-green-900/30",
										step.status === "error" &&
											"bg-red-100 text-red-600 dark:bg-red-900/30",
										step.status === "pending" &&
											"bg-muted text-muted-foreground",
									)}
								>
									{step.status === "active" ? (
										<Loader2 className="size-4 animate-spin" />
									) : step.status === "completed" ? (
										<Check className="size-4" />
									) : (
										<Icon className="size-4" />
									)}
								</div>
								<span
									className={cn(
										"font-medium text-sm",
										step.status === "completed" &&
											"text-green-700 dark:text-green-400",
										step.status === "error" && "text-red-700 dark:text-red-400",
										step.status === "pending" && "text-muted-foreground",
									)}
								>
									{step.label}
								</span>
							</div>
						);
					})}
				</div>

				{/* Error state */}
				{error && (
					<div className="space-y-3 text-center">
						<p className="text-red-600 text-sm dark:text-red-400">{error}</p>
						<Button onClick={startGeneration} variant="outline">
							Try Again
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
