import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	Briefcase,
	Check,
	ChevronLeft,
	Clock,
	GraduationCap,
	MessageCircle,
	Plane,
	Sparkles,
	Star,
	Target,
	Trophy,
	Users,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
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

const PLANS = [
	{
		id: "weekly",
		name: "Weekly",
		price: 4.99,
		period: "week",
		features: [
			"Unlimited AI conversations",
			"Personalized learning path",
			"Progress tracking",
		],
		popular: false,
	},
	{
		id: "yearly",
		name: "Yearly",
		price: 59.99,
		originalPrice: 259.48,
		period: "year",
		features: [
			"Everything in Weekly",
			"Save 77%",
			"Priority support",
			"Offline access",
		],
		popular: true,
		badge: "Best Value",
	},
	{
		id: "lifetime",
		name: "Lifetime",
		price: 149.99,
		period: "once",
		features: [
			"Everything in Yearly",
			"Pay once, own forever",
			"All future updates",
			"Premium support",
		],
		popular: false,
	},
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

	const prevStep = useCallback(() => {
		if (currentStep > 0) {
			setIsAnimating(true);
			setTimeout(() => {
				setCurrentStep((prev) => prev - 1);
				setIsAnimating(false);
			}, 150);
		}
	}, [currentStep]);

	const handleComplete = useCallback(() => {
		// Save completion status
		localStorage.setItem("onboarding-completed", "true");
		localStorage.setItem("selected-plan", selectedPlan);
		// Navigate to dashboard or signup
		navigate({ to: "/home" });
	}, [navigate, selectedPlan]);

	const handleSkip = useCallback(() => {
		localStorage.setItem("onboarding-completed", "true");
		navigate({ to: "/home" });
	}, [navigate]);

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
						className="h-full bg-lime-500 transition-all duration-500 ease-out"
						style={{ width: `${progressPercentage}%` }}
					/>
				</div>
			)}

			{/* Header */}
			{currentStep > 0 && (
				<header className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur-sm">
					<div className="container mx-auto flex items-center justify-between px-4 py-4">
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
					</div>
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
					{currentStep === 0 && (
						<WelcomeStep onNext={nextStep} onSkip={handleSkip} />
					)}

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

// Welcome Step Component
function WelcomeStep({
	onNext,
	onSkip,
}: {
	onNext: () => void;
	onSkip: () => void;
}) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
			<div className="mx-auto w-full max-w-md text-center">
				{/* Logo/Icon */}
				<div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-3xl bg-radial from-[#EFFF9B] to-[#D8FF76] shadow-lg">
					<span className="text-5xl">🎯</span>
				</div>

				<h1 className="mb-4 font-bold font-lyon text-4xl tracking-tight">
					Learn English
					<br />
					<span className="bg-linear-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent">
						The Smart Way
					</span>
				</h1>

				<p className="mb-8 text-lg text-muted-foreground">
					Practice speaking with AI, build vocabulary, and master grammar — all
					personalized for you.
				</p>

				{/* Features */}
				<div className="mb-8 space-y-3 text-left">
					{[
						{ icon: MessageCircle, text: "AI-powered conversations" },
						{ icon: Target, text: "Personalized learning path" },
						{ icon: Trophy, text: "Track your progress" },
					].map((feature) => (
						<div
							key={feature.text}
							className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
						>
							<div className="flex size-10 items-center justify-center rounded-lg bg-lime-100">
								<feature.icon className="size-5 text-lime-600" />
							</div>
							<span className="font-medium">{feature.text}</span>
						</div>
					))}
				</div>

				<Button
					size="lg"
					className="en-button-gradient h-14 w-full rounded-2xl text-base"
					onClick={onNext}
				>
					Get Started
					<ArrowRight className="ml-2 size-5" />
				</Button>

				<button
					type="button"
					onClick={onSkip}
					className="mt-4 text-muted-foreground text-sm transition-colors hover:text-foreground"
				>
					I already have an account
				</button>
			</div>
		</div>
	);
}

// Generic Selection Step Component
function SelectionStep({
	title,
	subtitle,
	options,
	selected,
	onSelect,
	onNext,
	canProceed,
}: {
	title: string;
	subtitle: string;
	options: Array<{
		id: string;
		name: string;
		description: string;
		icon?: string;
		IconComponent?: React.ComponentType<{ className?: string }>;
	}>;
	selected: string;
	onSelect: (id: string) => void;
	onNext: () => void;
	canProceed: boolean;
}) {
	return (
		<div className="flex flex-1 flex-col px-4 py-8">
			<div className="mx-auto w-full max-w-lg">
				<div className="mb-8 text-center">
					<h1 className="mb-2 font-bold font-lyon text-3xl tracking-tight">
						{title}
					</h1>
					<p className="text-muted-foreground">{subtitle}</p>
				</div>

				<div className="space-y-3">
					{options.map((option) => {
						const isSelected = selected === option.id;
						return (
							<button
								key={option.id}
								type="button"
								onClick={() => onSelect(option.id)}
								className={cn(
									"flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
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
								<div
									className={cn(
										"flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl",
										isSelected
											? "bg-radial from-[#EFFF9B] to-[#D8FF76]"
											: "bg-neutral-100",
									)}
								>
									{option.icon ? (
										option.icon
									) : option.IconComponent ? (
										<option.IconComponent
											className={cn(
												"size-6",
												isSelected ? "text-lime-700" : "text-neutral-600",
											)}
										/>
									) : null}
								</div>
								<div className="flex-1">
									<h3 className="font-semibold">{option.name}</h3>
									<p className="text-muted-foreground text-sm">
										{option.description}
									</p>
								</div>
								<div
									className={cn(
										"flex size-6 items-center justify-center rounded-full border-2 transition-all",
										isSelected
											? "border-lime-500 bg-lime-500"
											: "border-neutral-300",
									)}
								>
									{isSelected && <Check className="size-4 text-white" />}
								</div>
							</button>
						);
					})}
				</div>

				<div className="mt-8">
					<Button
						size="lg"
						className="en-button-gradient h-14 w-full rounded-2xl text-base"
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
					<h1 className="mb-2 font-bold font-lyon text-3xl tracking-tight">
						What do you want to focus on?
					</h1>
					<p className="text-muted-foreground">
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

				<div className="mt-8">
					<Button
						size="lg"
						className="en-button-gradient h-14 w-full rounded-2xl text-base"
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
				<div className="relative mx-auto mb-6 size-24">
					<div className="absolute inset-0 animate-ping rounded-full bg-lime-200 opacity-75" />
					<div className="relative flex size-24 items-center justify-center rounded-full bg-radial from-[#EFFF9B] to-[#D8FF76]">
						<Sparkles className="size-10 text-lime-700" />
					</div>
				</div>

				<h1 className="mb-2 font-bold font-lyon text-3xl tracking-tight">
					Your Personal Plan is Ready!
				</h1>
				<p className="mb-8 text-muted-foreground">
					Based on your preferences, we've created a custom learning path
				</p>

				{/* Summary Card */}
				<div
					className="mb-8 rounded-3xl bg-white p-6 text-left"
					style={{
						boxShadow:
							"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04)",
					}}
				>
					<h3 className="mb-4 font-semibold text-lg">Your Learning Profile</h3>
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
				<div className="mb-8 rounded-2xl bg-lime-50 p-4">
					<div className="flex items-center justify-center gap-2 text-lime-700">
						<Clock className="size-5" />
						<span className="font-medium">
							With {timeMinutes} min/day, you could reach the next level in ~8
							weeks
						</span>
					</div>
				</div>

				<Button
					size="lg"
					className="en-button-gradient h-14 w-full rounded-2xl text-base"
					onClick={onNext}
				>
					Start Learning
					<ArrowRight className="ml-2 size-5" />
				</Button>
			</div>
		</div>
	);
}

// Paywall Step Component
function PaywallStep({
	selectedPlan,
	onSelectPlan,
	onComplete,
	onSkip,
}: {
	selectedPlan: string;
	onSelectPlan: (plan: string) => void;
	onComplete: () => void;
	onSkip: () => void;
}) {
	return (
		<div className="flex flex-1 flex-col px-4 py-8">
			<div className="mx-auto w-full max-w-2xl">
				<div className="mb-8 text-center">
					<h1 className="mb-2 font-bold font-lyon text-3xl tracking-tight">
						Unlock Your Full Potential
					</h1>
					<p className="text-muted-foreground">
						Join thousands of learners improving their English every day
					</p>
				</div>

				{/* Social proof */}
				<div className="mb-6 flex items-center justify-center gap-4">
					<div className="-space-x-2 flex">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-lime-400 to-lime-600 text-white text-xs"
							>
								{String.fromCharCode(64 + i)}
							</div>
						))}
					</div>
					<div className="text-sm">
						<span className="font-semibold">10,000+</span>
						<span className="text-muted-foreground"> learners this month</span>
					</div>
				</div>

				{/* Plans */}
				<div className="mb-6 grid gap-4 md:grid-cols-3">
					{PLANS.map((plan) => {
						const isSelected = selectedPlan === plan.id;
						return (
							<button
								key={plan.id}
								type="button"
								onClick={() => onSelectPlan(plan.id)}
								className={cn(
									"relative flex flex-col rounded-3xl border-2 p-5 text-left transition-all",
									isSelected
										? "border-lime-500"
										: "border-transparent hover:border-neutral-200",
									plan.popular && "md:-mt-4 md:mb-4",
								)}
								style={
									plan.popular
										? {
												background:
													"linear-gradient(180deg, #EFFF9B 0%, #D8FF76 60%, #C6F64D 100%)",
											}
										: {
												background: "white",
												boxShadow:
													"0 0 0 1px rgba(0,0,0,.05),0 4px 8px rgba(0,0,0,.04)",
											}
								}
							>
								{plan.badge && (
									<div className="-top-3 -translate-x-1/2 absolute left-1/2 rounded-full bg-black px-3 py-1 font-medium text-white text-xs">
										{plan.badge}
									</div>
								)}
								{plan.popular && (
									<div className="mb-2 flex items-center gap-1 font-medium text-lime-800 text-sm">
										<Star className="size-4" fill="currentColor" />
										Most Popular
									</div>
								)}
								<div className="mb-2">
									<h3 className="font-bold text-lg">{plan.name}</h3>
								</div>
								<div className="mb-4 flex items-baseline gap-1">
									<span className="font-bold text-3xl">${plan.price}</span>
									<span className="text-muted-foreground text-sm">
										/{plan.period}
									</span>
								</div>
								{plan.originalPrice && (
									<div className="mb-2 text-muted-foreground text-sm line-through">
										${plan.originalPrice}/year
									</div>
								)}
								<ul className="mt-auto space-y-2">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-center gap-2 text-sm"
										>
											<Check className="size-4 shrink-0 text-lime-600" />
											{feature}
										</li>
									))}
								</ul>
								<div
									className={cn(
										"mt-4 flex size-6 items-center justify-center self-end rounded-full border-2 transition-all",
										isSelected
											? "border-lime-600 bg-lime-600"
											: "border-neutral-300",
									)}
								>
									{isSelected && <Check className="size-4 text-white" />}
								</div>
							</button>
						);
					})}
				</div>

				{/* CTA */}
				<Button
					size="lg"
					className="en-button-gradient h-14 w-full rounded-2xl text-base"
					onClick={onComplete}
				>
					Start 7-Day Free Trial
					<ArrowRight className="ml-2 size-5" />
				</Button>

				<p className="mt-3 text-center text-muted-foreground text-xs">
					Cancel anytime. No credit card required for trial.
				</p>

				{/* Skip option */}
				<div className="mt-6 text-center">
					<button
						type="button"
						onClick={onSkip}
						className="text-muted-foreground text-sm underline transition-colors hover:text-foreground"
					>
						Continue with limited features
					</button>
				</div>

				{/* Trust badges */}
				<div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground text-xs">
					<span className="flex items-center gap-1">
						<Check className="size-4" />
						Secure payment
					</span>
					<span className="flex items-center gap-1">
						<Check className="size-4" />
						30-day money back
					</span>
					<span className="flex items-center gap-1">
						<Check className="size-4" />
						Cancel anytime
					</span>
				</div>
			</div>
		</div>
	);
}
