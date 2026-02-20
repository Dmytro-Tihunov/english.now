import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
	BookOpen,
	Briefcase,
	Check,
	Clapperboard,
	Cpu,
	Dumbbell,
	Gamepad2,
	GraduationCap,
	Loader2,
	MessageCircle,
	Music,
	Palette,
	Plane,
	Target,
	Users,
	UtensilsCrossed,
	Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/utils/trpc";

const LANGUAGES = [
	{ id: "uk", name: "Ukrainian", flag: "🇺🇦" },
	{ id: "en", name: "English", flag: "🇬🇧" },
	{ id: "fr", name: "French", flag: "🇫🇷" },
	{ id: "es", name: "Spanish", flag: "🇪🇸" },
	{ id: "de", name: "German", flag: "🇩🇪" },
	{ id: "pt", name: "Portuguese", flag: "🇵🇹" },
	{ id: "it", name: "Italian", flag: "🇮🇹" },
	{ id: "pl", name: "Polish", flag: "🇵🇱" },
	{ id: "ja", name: "Japanese", flag: "🇯🇵" },
	{ id: "ko", name: "Korean", flag: "🇰🇷" },
	{ id: "zh", name: "Chinese", flag: "🇨🇳" },
	{ id: "ar", name: "Arabic", flag: "🇸🇦" },
	{ id: "hi", name: "Hindi", flag: "🇮🇳" },
	{ id: "tr", name: "Turkish", flag: "🇹🇷" },
];

const DAILY_GOALS = [
	{ minutes: 5, label: "Casual", description: "5 min/day" },
	{ minutes: 10, label: "Steady", description: "10 min/day" },
	{ minutes: 15, label: "Serious", description: "15 min/day" },
	{ minutes: 20, label: "Intensive", description: "20+ min/day" },
];

const GOALS: { id: string; name: string; icon: LucideIcon }[] = [
	{ id: "career", name: "Career Growth", icon: Briefcase },
	{ id: "travel", name: "Travel", icon: Plane },
	{ id: "education", name: "Education", icon: GraduationCap },
	{ id: "social", name: "Social", icon: Users },
	{ id: "personal", name: "Personal Growth", icon: Target },
	{ id: "content", name: "Entertainment", icon: BookOpen },
];

const FOCUS_AREAS: { id: string; name: string; icon: LucideIcon }[] = [
	{ id: "speaking", name: "Speaking", icon: MessageCircle },
	{ id: "vocabulary", name: "Vocabulary", icon: BookOpen },
	{ id: "grammar", name: "Grammar", icon: GraduationCap },
	{ id: "pronunciation", name: "Pronunciation", icon: Zap },
];

const INTERESTS: { id: string; name: string; icon: LucideIcon }[] = [
	{ id: "technology", name: "Technology", icon: Cpu },
	{ id: "travel", name: "Travel", icon: Plane },
	{ id: "music", name: "Music", icon: Music },
	{ id: "movies", name: "Movies & TV", icon: Clapperboard },
	{ id: "food", name: "Food & Cooking", icon: UtensilsCrossed },
	{ id: "fitness", name: "Health & Fitness", icon: Dumbbell },
	{ id: "business", name: "Business", icon: Briefcase },
	{ id: "art", name: "Art & Design", icon: Palette },
	{ id: "gaming", name: "Gaming", icon: Gamepad2 },
	{ id: "books", name: "Books & Literature", icon: BookOpen },
];

export const Personalization = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const { data: profile, isLoading } = useQuery(
		trpc.profile.get.queryOptions(),
	);

	const updateMutation = useMutation(
		trpc.profile.updateProfile.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.profile.get.queryKey(),
				});
				toast.success("Settings updated");
			},
			onError: () => {
				toast.error("Failed to update settings");
			},
		}),
	);

	const update = (field: string, value: unknown) => {
		updateMutation.mutate({ [field]: value });
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Native Language */}
			<div className="flex flex-row gap-8">
				<div className="flex-1 space-y-2">
					<Label className="font-medium text-sm">Native Language</Label>
					<p className="text-muted-foreground text-xs">
						We'll use this for translations and explanations
					</p>
					<Select
						value={profile?.nativeLanguage ?? ""}
						onValueChange={(value) => update("nativeLanguage", value)}
					>
						<SelectTrigger className="w-full max-w-md">
							<SelectValue placeholder="Select language" />
						</SelectTrigger>
						<SelectContent>
							{LANGUAGES.map((lang) => (
								<SelectItem key={lang.id} value={lang.id}>
									<span className="flex items-center gap-2">
										<span>{lang.flag}</span>
										<span>{lang.name}</span>
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Daily Learning Goal */}
				<div className="flex-1 space-y-2">
					<Label className="font-medium text-sm">Daily Learning Goal</Label>
					<p className="text-muted-foreground text-xs">
						Set a realistic goal to build consistency
					</p>
					<Select
						value={String(profile?.dailyGoal ?? 15)}
						onValueChange={(value) => update("dailyGoal", Number(value))}
					>
						<SelectTrigger className="w-full max-w-md">
							<SelectValue placeholder="Select goal" />
						</SelectTrigger>
						<SelectContent>
							{DAILY_GOALS.map((goal) => (
								<SelectItem key={goal.minutes} value={String(goal.minutes)}>
									{goal.minutes} min — {goal.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			{/* Learning Goal */}
			<div className="space-y-3">
				<Label className="font-medium text-sm">Learning Goal</Label>
				<p className="text-muted-foreground text-xs">
					What's your main reason for learning English?
				</p>
				<div className="grid grid-cols-3 gap-2">
					{GOALS.map((goal) => {
						const isSelected = profile?.goal === goal.id;
						return (
							<button
								key={goal.id}
								type="button"
								onClick={() => update("goal", goal.id)}
								className={cn(
									"flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all",
									isSelected
										? "border-lime-500 bg-lime-50"
										: "border-transparent bg-muted/50 hover:bg-muted",
								)}
							>
								<goal.icon
									className={cn(
										"size-5",
										isSelected ? "text-lime-700" : "text-muted-foreground",
									)}
								/>
								<span
									className={cn(
										"font-medium text-xs",
										isSelected ? "text-lime-900" : "text-muted-foreground",
									)}
								>
									{goal.name}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Focus Areas */}
			<div className="space-y-3">
				<Label className="font-medium text-sm">Focus Areas</Label>
				<p className="text-muted-foreground text-xs">
					Select the skills you want to improve
				</p>
				<div className="grid grid-cols-2 gap-2">
					{FOCUS_AREAS.map((area) => {
						const isSelected = profile?.focusAreas?.includes(area.id) ?? false;
						return (
							<button
								key={area.id}
								type="button"
								onClick={() => {
									const current = profile?.focusAreas ?? [];
									const next = isSelected
										? current.filter((f) => f !== area.id)
										: [...current, area.id];
									if (next.length === 0) {
										toast.error("You need at least one focus area");
										return;
									}
									update("focusAreas", next);
								}}
								className={cn(
									"relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
									isSelected
										? "border-lime-500 bg-lime-50"
										: "border-transparent bg-muted/50 hover:bg-muted",
								)}
							>
								{isSelected && (
									<div className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-lime-500">
										<Check className="size-2.5 text-white" />
									</div>
								)}
								<area.icon
									className={cn(
										"size-5 shrink-0",
										isSelected ? "text-lime-700" : "text-muted-foreground",
									)}
								/>
								<span
									className={cn(
										"font-medium text-sm",
										isSelected ? "text-lime-900" : "text-muted-foreground",
									)}
								>
									{area.name}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Interests */}
			<div className="space-y-3">
				<Label className="font-medium text-sm">Interests</Label>
				<p className="text-muted-foreground text-xs">
					We'll tailor conversations and content to your interests
				</p>
				<div className="grid grid-cols-2 gap-2">
					{INTERESTS.map((interest) => {
						const isSelected =
							profile?.interests?.includes(interest.id) ?? false;
						return (
							<button
								key={interest.id}
								type="button"
								onClick={() => {
									const current = profile?.interests ?? [];
									const next = isSelected
										? current.filter((i) => i !== interest.id)
										: [...current, interest.id];
									update("interests", next);
								}}
								className={cn(
									"relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
									isSelected
										? "border-lime-500 bg-lime-50"
										: "border-transparent bg-muted/50 hover:bg-muted",
								)}
							>
								{isSelected && (
									<div className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-lime-500">
										<Check className="size-2.5 text-white" />
									</div>
								)}
								<interest.icon
									className={cn(
										"size-5 shrink-0",
										isSelected ? "text-lime-700" : "text-muted-foreground",
									)}
								/>
								<span
									className={cn(
										"font-medium text-sm",
										isSelected ? "text-lime-900" : "text-muted-foreground",
									)}
								>
									{interest.name}
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};
