import { env } from "@english.now/env/client";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	Briefcase,
	Check,
	Clock,
	GraduationCap,
	MessageCircle,
	Plane,
	Target,
	Users,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import Logo from "@/components/logo";
import NativeLanguageStep from "@/components/onboarding/nativelanguage-step";
import PaywallStep from "@/components/onboarding/paywall-step";
import SelectionStep from "@/components/onboarding/selection-step";
import WelcomeStep from "@/components/onboarding/welcome-step";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/functions/get-profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
	beforeLoad: async () => {
		const profile = await getProfile();
		if (profile?.isOnboardingCompleted) {
			throw redirect({ to: "/home" });
		}
		return { profile };
	},
	component: OnboardingPage,
});

type OnboardingData = {
	level: string;
	goal: string;
	time: string;
	focus: string[];
};

const STEPS = [
	{ id: "welcome", title: "Welcome" },
	{ id: "native-language", title: "Native Language" },
	{ id: "level", title: "Your Level" },
	{ id: "goal", title: "Your Goal" },
	{ id: "time", title: "Daily Time" },
	{ id: "focus", title: "Focus Areas" },
	{ id: "plan", title: "Your Plan" },
	{ id: "paywall", title: "Get Started" },
];

const LEVELS = [
	{
		id: "beginner",
		name: "Beginner",
		description: "I know some basic words and phrases",
		icon: "🌱",
	},
	{
		id: "elementary",
		name: "Elementary",
		description: "I can have simple conversations",
		icon: "🌿",
	},
	{
		id: "intermediate",
		name: "Intermediate",
		description: "I can discuss various topics",
		icon: "🌳",
	},
	{
		id: "upper-intermediate",
		name: "Upper Intermediate",
		description: "I'm comfortable in most situations",
		icon: "🌲",
	},
	{
		id: "advanced",
		name: "Advanced",
		description: "I want to perfect my English",
		icon: "🏔️",
	},
];

const GOALS = [
	{
		id: "career",
		name: "Career Growth",
		description: "Get better job opportunities",
		icon: Briefcase,
	},
	{
		id: "travel",
		name: "Travel",
		description: "Communicate while traveling",
		icon: Plane,
	},
	{
		id: "education",
		name: "Education",
		description: "Study abroad or pass exams",
		icon: GraduationCap,
	},
	{
		id: "social",
		name: "Social",
		description: "Make friends and connect",
		icon: Users,
	},
	{
		id: "personal",
		name: "Personal Growth",
		description: "Challenge myself to learn",
		icon: Target,
	},
	{
		id: "content",
		name: "Entertainment",
		description: "Enjoy movies, books & music",
		icon: BookOpen,
	},
];

const TIME_OPTIONS = [
	{
		id: "5",
		name: "5 minutes",
		description: "Quick daily practice",
		icon: "⚡",
	},
	{
		id: "15",
		name: "15 minutes",
		description: "Steady progress",
		icon: "🚶",
	},
	{
		id: "30",
		name: "30 minutes",
		description: "Serious learning",
		icon: "🏃",
	},
	{
		id: "60",
		name: "60+ minutes",
		description: "Intensive study",
		icon: "🚀",
	},
];

const FOCUS_AREAS = [
	{ id: "speaking", name: "Speaking", icon: MessageCircle },
	{ id: "vocabulary", name: "Vocabulary", icon: BookOpen },
	{ id: "grammar", name: "Grammar", icon: GraduationCap },
	{ id: "pronunciation", name: "Pronunciation", icon: Zap },
];

function OnboardingPage() {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);
	const [data, setData] = useState<OnboardingData>({
		level: "",
		goal: "",
		time: "",
		focus: [],
	});
	const [isAnimating, setIsAnimating] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState("yearly");

	const saveOnboardingMutation = useMutation({
		mutationFn: async (input: {
			nativeLanguage: string;
			proficiencyLevel: string;
			dailyGoal: number;
			focusAreas: string[];
			goal: string;
			timezone: string;
		}) => {
			const response = await fetch(
				`${env.VITE_SERVER_URL}/api/profile/onboarding`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(input),
				},
			);
			if (!response.ok) throw new Error("Failed to save onboarding");
			return response.json();
		},
	});

	// Load saved progress from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("onboarding-progress");
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setData(parsed.data || data);
				setCurrentStep(parsed.step || 0);
			} catch (_e) {
				// Ignore parsing errors
			}
		}
	}, []);

	// Save progress to localStorage
	useEffect(() => {
		localStorage.setItem(
			"onboarding-progress",
			JSON.stringify({ data, step: currentStep }),
		);
	}, [data, currentStep]);

	const nextStep = useCallback(() => {
		if (currentStep < STEPS.length - 1) {
			setIsAnimating(true);
			setTimeout(() => {
				setCurrentStep((prev) => prev + 1);
				setIsAnimating(false);
			}, 150);
		}
	}, [currentStep]);

	const handleComplete = useCallback(async () => {
		try {
			await saveOnboardingMutation.mutateAsync({
				nativeLanguage: "en", // Default, could be collected in onboarding
				proficiencyLevel: data.level,
				dailyGoal: Number.parseInt(data.time) || 15,
				focusAreas: data.focus,
				goal: data.goal,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			});

			// Clear local progress
			localStorage.removeItem("onboarding-progress");
			localStorage.setItem("selected-plan", selectedPlan);

			// Navigate to dashboard
			navigate({ to: "/home" });
		} catch (error) {
			console.error("Failed to save onboarding:", error);
		}
	}, [navigate, selectedPlan, data, saveOnboardingMutation]);

	const handleSkip = useCallback(async () => {
		try {
			await saveOnboardingMutation.mutateAsync({
				nativeLanguage: "en",
				proficiencyLevel: data.level || "beginner",
				dailyGoal: Number.parseInt(data.time) || 15,
				focusAreas: data.focus.length > 0 ? data.focus : ["speaking"],
				goal: data.goal || "personal",
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			});

			localStorage.removeItem("onboarding-progress");
			navigate({ to: "/home" });
		} catch (error) {
			console.error("Failed to save onboarding:", error);
		}
	}, [navigate, data, saveOnboardingMutation]);

	const toggleFocus = (focusId: string) => {
		setData((prev) => ({
			...prev,
			focus: prev.focus.includes(focusId)
				? prev.focus.filter((f) => f !== focusId)
				: [...prev.focus, focusId],
		}));
	};

	const canProceed = () => {
		switch (STEPS[currentStep]?.id) {
			case "welcome":
				return true;
			case "level":
				return !!data.level;
			case "goal":
				return !!data.goal;
			case "time":
				return !!data.time;
			case "focus":
				return data.focus.length > 0;
			case "plan":
				return true;
			case "paywall":
				return true;
			default:
				return true;
		}
	};

	const progressPercentage = Math.round(
		((currentStep + 1) / STEPS.length) * 100,
	);

	return (
		<div className="relative flex min-h-dvh flex-col bg-neutral-50">
			{/* Progress bar */}
			{currentStep > 0 && currentStep < STEPS.length - 1 && (
				<div className="fixed top-0 right-0 left-0 z-50 h-1 bg-neutral-200">
					<div
						className="h-full bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] transition-all duration-500 ease-out"
						style={{ width: `${progressPercentage}%` }}
					/>
				</div>
			)}

			{/* Header */}
			{currentStep > 0 && (
				<header>
					<div className="container relative z-10 mx-auto px-4">
						<nav className="flex items-center justify-between py-5 md:grid-cols-5">
							<div className="col-span-3 items-center gap-3 md:flex">
								<Logo />
							</div>
							<div className="relative z-50 flex items-center justify-end gap-2">
								<LanguageSwitcher className="h-9 rounded-xl" />
							</div>
						</nav>
					</div>
					{/* <div className="container mx-auto flex items-center justify-between px-4 py-4">
						<button
							type="button"
							onClick={prevStep}
							className="flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							<ChevronLeft className="size-4" />
							Back
						</button>
						{currentStep < STEPS.length - 1 && (
							<button
								type="button"
								onClick={handleSkip}
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Skip
							</button>
						)}
					</div> */}
				</header>
			)}

			{/* Main content */}
			<main className="flex flex-1 flex-col">
				<div
					className={cn(
						"flex flex-1 flex-col transition-opacity duration-150",
						isAnimating ? "opacity-0" : "opacity-100",
					)}
				>
					{/* Welcome Step */}
					{currentStep === 0 && <WelcomeStep onNext={nextStep} />}

					{/* Level Step */}
					{currentStep === 1 && (
						<SelectionStep
							title="What's your English level?"
							subtitle="This helps us personalize your learning experience"
							options={LEVELS.map((l) => ({
								id: l.id,
								name: l.name,
								description: l.description,
								icon: l.icon,
							}))}
							selected={data.level}
							onSelect={(id) => setData((prev) => ({ ...prev, level: id }))}
							onNext={nextStep}
							canProceed={canProceed()}
						/>
					)}

					{/* Goal Step */}
					{currentStep === 2 && (
						<SelectionStep
							title="What's your main goal?"
							subtitle="We'll create a learning path tailored to your needs"
							options={GOALS.map((g) => ({
								id: g.id,
								name: g.name,
								description: g.description,
								IconComponent: g.icon,
							}))}
							selected={data.goal}
							onSelect={(id) => setData((prev) => ({ ...prev, goal: id }))}
							onNext={nextStep}
							canProceed={canProceed()}
						/>
					)}

					{/* Time Step */}
					{currentStep === 3 && (
						<SelectionStep
							title="How much time can you practice daily?"
							subtitle="Consistency is key to language learning"
							options={TIME_OPTIONS.map((t) => ({
								id: t.id,
								name: t.name,
								description: t.description,
								icon: t.icon,
							}))}
							selected={data.time}
							onSelect={(id) => setData((prev) => ({ ...prev, time: id }))}
							onNext={nextStep}
							canProceed={canProceed()}
						/>
					)}

					{/* Focus Areas Step */}
					{currentStep === 4 && (
						<FocusAreasStep
							selected={data.focus}
							onToggle={toggleFocus}
							onNext={nextStep}
							canProceed={canProceed()}
						/>
					)}

					{/* Plan Summary Step */}
					{currentStep === 5 && (
						<PlanSummaryStep data={data} onNext={nextStep} />
					)}

					{/* Paywall Step */}
					{currentStep === 6 && (
						<PaywallStep
							selectedPlan={selectedPlan}
							onSelectPlan={setSelectedPlan}
							onComplete={handleComplete}
							onSkip={handleSkip}
						/>
					)}
				</div>
			</main>
		</div>
	);
}

// Native Language Step Component
<NativeLanguageStep />;

// Focus Areas Step Component
function FocusAreasStep({
	selected,
	onToggle,
	onNext,
	canProceed,
}: {
	selected: string[];
	onToggle: (id: string) => void;
	onNext: () => void;
	canProceed: boolean;
}) {
	return (
		<div className="flex flex-1 flex-col px-4 py-8">
			<div className="mx-auto w-full max-w-lg">
				<div className="mb-8 text-center">
					<h1 className="mb-2 font-bold font-lyon text-4xl tracking-tight md:text-5xl">
						What do you want to focus on?
					</h1>
					<p className="text-muted-foreground md:text-lg">
						Select all that apply — you can change this later
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3">
					{FOCUS_AREAS.map((area) => {
						const isSelected = selected.includes(area.id);
						return (
							<button
								key={area.id}
								type="button"
								onClick={() => onToggle(area.id)}
								className={cn(
									"relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all",
									isSelected
										? "border-lime-500 bg-lime-50"
										: "border-transparent bg-white hover:bg-neutral-50",
								)}
								style={
									!isSelected
										? {
												boxShadow:
													"0 0 0 1px rgba(0,0,0,.05),0 2px 4px rgba(0,0,0,.04)",
											}
										: undefined
								}
							>
								{isSelected && (
									<div className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-lime-500">
										<Check className="size-3 text-white" />
									</div>
								)}
								<div
									className={cn(
										"flex size-14 items-center justify-center rounded-xl",
										isSelected
											? "bg-radial from-[#EFFF9B] to-[#D8FF76]"
											: "bg-neutral-100",
									)}
								>
									<area.icon
										className={cn(
											"size-7",
											isSelected ? "text-lime-700" : "text-neutral-600",
										)}
									/>
								</div>
								<span className="font-semibold">{area.name}</span>
							</button>
						);
					})}
				</div>

				<div className="mx-auto mt-8 max-w-md">
					<Button
						size="lg"
						className="en-button-gradient h-14 w-full rounded-2xl text-base text-lime-900"
						disabled={!canProceed}
						onClick={onNext}
					>
						Continue
						<ArrowRight className="ml-2 size-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}

// Plan Summary Step Component
function PlanSummaryStep({
	data,
	onNext,
}: {
	data: OnboardingData;
	onNext: () => void;
}) {
	const levelName = LEVELS.find((l) => l.id === data.level)?.name || "Beginner";
	const goalName = GOALS.find((g) => g.id === data.goal)?.name || "Learning";
	const timeMinutes = data.time || "15";
	const focusNames = data.focus
		.map((f) => FOCUS_AREAS.find((a) => a.id === f)?.name)
		.filter(Boolean);

	return (
		<div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
			<div className="mx-auto w-full max-w-md text-center">
				{/* Success animation */}
				{/* <div className="relative mx-auto mb-6 flex size-16 justify-center">
					<div className="absolute inset-0 animate-ping rounded-full bg-lime-200 opacity-75" />
					<div className="relative flex size-24 items-center justify-center rounded-full bg-radial from-[#EFFF9B] to-[#D8FF76]">
						<Sparkles className="size-10 text-lime-700" />
					</div>
				</div> */}

				<h1 className="mb-4 font-bold font-lyon text-4xl tracking-tight md:text-5xl">
					Your Personal Plan is Ready!
				</h1>
				<p className="text-muted-foreground md:text-lg">
					Based on your preferences, we've created a custom learning path
				</p>

				{/* Summary Card */}
				<div
					className="mt-8 mb-8 rounded-3xl bg-white p-6 text-left"
					style={{
						boxShadow:
							"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04)",
					}}
				>
					<h3 className="mb-4 font-bold font-lyon text-2xl tracking-tight">
						Your Learning Profile
					</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between border-b border-dashed pb-3">
							<span className="text-muted-foreground">Current Level</span>
							<span className="font-medium">{levelName}</span>
						</div>
						<div className="flex items-center justify-between border-b border-dashed pb-3">
							<span className="text-muted-foreground">Main Goal</span>
							<span className="font-medium">{goalName}</span>
						</div>
						<div className="flex items-center justify-between border-b border-dashed pb-3">
							<span className="text-muted-foreground">Daily Practice</span>
							<span className="font-medium">{timeMinutes} minutes</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Focus Areas</span>
							<span className="font-medium">
								{focusNames.join(", ") || "All"}
							</span>
						</div>
					</div>
				</div>

				{/* Projection */}
				{/* <div className="mb-8 rounded-2xl bg-lime-50 p-4">
					<div className="flex items-center justify-center gap-2 text-lime-700">
						<Clock className="size-5" />
						<span className="font-medium">
							With {timeMinutes} min/day, you could reach the next level in ~8
							weeks
						</span>
					</div>
				</div> */}

				<Button
					size="lg"
					className="en-button-gradient h-14 w-full rounded-2xl text-base text-lime-900"
					onClick={onNext}
				>
					Start Learning
					<ArrowRight className="size-5" />
				</Button>
			</div>
		</div>
	);
}

// Paywall Step Component
<PaywallStep />;
