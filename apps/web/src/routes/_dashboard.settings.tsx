import { env } from "@english.now/env/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	Brain,
	Camera,
	Check,
	Loader2,
	LogOutIcon,
	Trash2,
	User,
	Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { openCheckout } from "@/lib/paddle";
import { cn } from "@/lib/utils";
import { createTitle, PAGE_TITLE } from "@/utils/title";
import { useTRPC } from "@/utils/trpc";

const PADDLE_PRICE_IDS = {
	monthly: import.meta.env.VITE_PADDLE_PRICE_MONTHLY ?? "",
	yearly: import.meta.env.VITE_PADDLE_PRICE_YEARLY ?? "",
} as const;

export const Route = createFileRoute("/_dashboard/settings")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: createTitle(PAGE_TITLE.settings),
			},
		],
	}),
});

const LANGUAGES = [
	{ code: "es", name: "Spanish" },
	{ code: "pt", name: "Portuguese" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "it", name: "Italian" },
	{ code: "zh", name: "Chinese" },
	{ code: "ja", name: "Japanese" },
	{ code: "ko", name: "Korean" },
	{ code: "ru", name: "Russian" },
	{ code: "ar", name: "Arabic" },
	{ code: "hi", name: "Hindi" },
	{ code: "uk", name: "Ukrainian" },
];

const PROFICIENCY_LEVELS = [
	{ value: "beginner", label: "Beginner", description: "Just starting out" },
	{ value: "elementary", label: "Elementary", description: "Basic phrases" },
	{
		value: "intermediate",
		label: "Intermediate",
		description: "Everyday conversations",
	},
	{
		value: "upper-intermediate",
		label: "Upper Intermediate",
		description: "Complex topics",
	},
	{ value: "advanced", label: "Advanced", description: "Near fluent" },
];

const DAILY_GOALS = [
	{ minutes: 5, label: "Casual", description: "5 min/day" },
	{ minutes: 15, label: "Regular", description: "15 min/day" },
	{ minutes: 30, label: "Serious", description: "30 min/day" },
	{ minutes: 60, label: "Intense", description: "60 min/day" },
];

interface Settings {
	nativeLanguage: string;
	proficiencyLevel: string;
	dailyGoal: number;
	soundEffects: boolean;
	pronunciationFeedback: boolean;
	autoPlayAudio: boolean;
	showTranslations: boolean;
}

const STORAGE_KEY = "english-now-settings";

const DEFAULT_SETTINGS: Settings = {
	nativeLanguage: "es",
	proficiencyLevel: "intermediate",
	dailyGoal: 15,
	soundEffects: true,
	pronunciationFeedback: true,
	autoPlayAudio: true,
	showTranslations: true,
};

function RouteComponent() {
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();
	const trpc = useTRPC();
	const { data: subscriptionData } = useQuery(
		trpc.profile.getSubscription.queryOptions(),
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Profile state
	const [name, setName] = useState("");
	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("profile");
	// Settings state
	const [settings, setSettings] = useState<Settings>(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					return JSON.parse(stored);
				} catch {
					return DEFAULT_SETTINGS;
				}
			}
		}
		return DEFAULT_SETTINGS;
	});

	// Delete account state
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	// Initialize name from session
	useState(() => {
		if (session?.user?.name) {
			setName(session.user.name);
		}
	});

	const updateSetting = <K extends keyof Settings>(
		key: K,
		value: Settings[K],
	) => {
		setSettings((prev) => {
			const newSettings = { ...prev, [key]: value };
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
			return newSettings;
		});
	};

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({ to: "/" });
				},
			},
		});
	};

	const handleUpdateProfile = async () => {
		if (!name.trim()) {
			toast.error("Name cannot be empty");
			return;
		}

		setIsUpdatingProfile(true);
		try {
			await authClient.updateUser({
				name: name.trim(),
			});
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error("Failed to update profile");
			console.error(error);
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image must be smaller than 5MB");
			return;
		}

		// Show preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setAvatarPreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);

		// Upload to R2 through server
		setIsUploadingAvatar(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch(`${env.VITE_SERVER_URL}/api/upload/avatar`, {
				method: "POST",
				credentials: "include",
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to upload image");
			}

			const { publicUrl } = await response.json();

			// Update user profile with new avatar URL
			await authClient.updateUser({
				image: publicUrl,
			});

			toast.success("Avatar updated successfully");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to upload avatar",
			);
			console.error(error);
			setAvatarPreview(null);
		} finally {
			setIsUploadingAvatar(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (deleteConfirmation !== "DELETE") {
			toast.error('Please type "DELETE" to confirm');
			return;
		}

		setIsDeleting(true);
		try {
			await authClient.deleteUser();
			toast.success("Account deleted successfully");
			navigate({ to: "/" });
		} catch (error) {
			toast.error("Failed to delete account");
			console.error(error);
		} finally {
			setIsDeleting(false);
			setShowDeleteDialog(false);
		}
	};

	const currentAvatar = avatarPreview || session?.user?.image;

	const TABS = [
		{
			label: "Profile",
			value: "profile",
			icon: User,
		},
		{
			label: "Learning",
			value: "learning",
			icon: Brain,
		},
		{
			label: "Billing",
			value: "billing",
			icon: Zap,
		},
	];

	return (
		<div className="container relative z-10 mx-auto max-w-2xl px-4 py-6 pt-8">
			<div className="flex flex-row items-center justify-between">
				<h1 className="font-bold font-lyon text-4xl tracking-tight">
					Settings
				</h1>
				<Tabs>
					<TabsList
						className="inline-flex h-full items-center justify-center gap-1.5 rounded-xl border bg-muted p-1 text-muted-foreground duration-200"
						style={{
							boxShadow:
								"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
						}}
					>
						{TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								onClick={() => setActiveTab(tab.value)}
								data-state={activeTab === tab.value ? "active" : "inactive"}
								className="flex gap-1 rounded-lg px-2 py-1 font-medium text-sm"
							>
								{/* {(tab.icon && <tab.icon className="size-3.5" />) || null} */}
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			<div className="mt-10 space-y-10">
				<section hidden={activeTab !== "profile"}>
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-lg">Profile</h2>
						<Button
							variant="outline"
							className="items-center gap-1.5 rounded-xl"
							onClick={handleSignOut}
						>
							<LogOutIcon className="size-4" />
							Sign out
						</Button>
					</div>
					<hr className="mt-4 border-border/50" />

					<div className="mt-6 space-y-6">
						{/* Avatar */}
						<div>
							<div className="mt-2">
								<button
									type="button"
									onClick={handleAvatarClick}
									disabled={isUploadingAvatar}
									className="group relative size-16 overflow-hidden rounded-full border-2 border-transparent border-dashed transition-colors hover:border-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
								>
									{currentAvatar ? (
										<img
											src={currentAvatar}
											alt={session?.user?.name ?? "Avatar"}
											className="size-full rounded-full object-cover"
										/>
									) : (
										<div className="flex size-full items-center justify-center rounded-full bg-neutral-200 font-bold font-lyon text-2xl text-neutral-500 uppercase">
											{session?.user?.name?.charAt(0) ?? "?"}
										</div>
									)}
									<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
										{isUploadingAvatar ? (
											<Loader2 className="size-5 animate-spin text-white" />
										) : (
											<Camera className="size-5 text-white" />
										)}
									</div>
								</button>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileSelect}
									className="hidden"
								/>
							</div>
						</div>

						{/* Name */}
						<div>
							<Label htmlFor="name" className="text-muted-foreground">
								Name
							</Label>
							<div className="mt-2 flex gap-3">
								<Input
									id="name"
									value={name || session?.user?.name || ""}
									onChange={(e) => setName(e.target.value)}
									placeholder="Your name"
									className="h-11 max-w-md rounded-xl"
								/>
								{name && name !== session?.user?.name && (
									<Button
										onClick={handleUpdateProfile}
										disabled={isUpdatingProfile}
										className="h-11 rounded-xl"
									>
										{isUpdatingProfile ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Check className="size-4" />
										)}
										Save
									</Button>
								)}
							</div>
						</div>

						{/* Email */}
						<div>
							<Label htmlFor="email" className="text-muted-foreground">
								Email
							</Label>
							<div className="mt-2">
								<Input
									id="email"
									value={session?.user?.email ?? ""}
									disabled
									className="h-11 max-w-md rounded-xl bg-muted/50"
								/>
								<p className="mt-2 text-muted-foreground text-sm">
									If you need to change your email, please contact support.
								</p>
							</div>
						</div>
					</div>

					{/* Delete Account Section */}

					<div className="mt-6">
						{" "}
						<hr className="mt-2 mb-4 border-border/50" />
						<div className="flex flex-col items-start justify-between gap-4">
							<div>
								<h3 className="font-medium text-destructive">Delete Account</h3>
								<p className="mt-1 text-muted-foreground text-sm">
									Permanently delete your account and all associated data. This
									action cannot be undone.
								</p>
							</div>
							<Button
								variant="destructive"
								className="shrink-0 rounded-xl"
								onClick={() => setShowDeleteDialog(true)}
							>
								<Trash2 className="size-4" />
								Delete
							</Button>
						</div>
					</div>
				</section>

				{/* Personalization Section */}
				<section hidden={activeTab !== "learning"}>
					<h2 className="font-semibold text-lg">Personalization</h2>
					<hr className="border-border/50" />
					<div className="mt-6 space-y-8">
						{/* Native Language */}
						<div className="space-y-3">
							<Label className="font-medium text-sm">Native Language</Label>
							<p className="text-muted-foreground text-xs">
								We'll use this for translations and explanations
							</p>
							<div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
								{LANGUAGES.map((lang) => (
									<button
										key={lang.code}
										type="button"
										onClick={() => updateSetting("nativeLanguage", lang.code)}
										className={cn(
											"rounded-xl border px-3 py-2.5 text-sm transition-all",
											settings.nativeLanguage === lang.code
												? "border-primary bg-primary/10 text-foreground"
												: "border-border hover:border-muted-foreground/30 hover:bg-muted/50",
										)}
									>
										{lang.name}
									</button>
								))}
							</div>
						</div>

						{/* Proficiency Level */}
						<div className="space-y-3">
							<Label className="font-medium text-sm">English Level</Label>
							<p className="text-muted-foreground text-xs">
								This helps us personalize your content difficulty
							</p>
							<div className="space-y-2">
								{PROFICIENCY_LEVELS.map((level) => (
									<button
										key={level.value}
										type="button"
										onClick={() =>
											updateSetting("proficiencyLevel", level.value)
										}
										className={cn(
											"flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
											settings.proficiencyLevel === level.value
												? "border-primary bg-primary/10"
												: "border-border hover:border-muted-foreground/30 hover:bg-muted/50",
										)}
									>
										<div>
											<div className="font-medium text-sm">{level.label}</div>
											<div className="text-muted-foreground text-xs">
												{level.description}
											</div>
										</div>
										{settings.proficiencyLevel === level.value && (
											<Check className="size-5 text-primary" />
										)}
									</button>
								))}
							</div>
						</div>

						{/* Daily Goal */}
						<div className="space-y-3">
							<Label className="font-medium text-sm">Daily Learning Goal</Label>
							<p className="text-muted-foreground text-xs">
								Set a realistic goal to build consistency
							</p>
							<div className="grid grid-cols-4 gap-2">
								{DAILY_GOALS.map((goal) => (
									<button
										key={goal.minutes}
										type="button"
										onClick={() => updateSetting("dailyGoal", goal.minutes)}
										className={cn(
											"flex flex-col items-center rounded-xl border px-3 py-3 transition-all",
											settings.dailyGoal === goal.minutes
												? "border-primary bg-primary/10"
												: "border-border hover:border-muted-foreground/30 hover:bg-muted/50",
										)}
									>
										<span className="font-semibold text-lg">
											{goal.minutes}
										</span>
										<span className="text-muted-foreground text-xs">min</span>
										<span className="mt-1 text-xs">{goal.label}</span>
									</button>
								))}
							</div>
						</div>

						{/* Learning Preferences */}
						<div className="space-y-4">
							<Label className="font-medium text-sm">
								Learning Preferences
							</Label>

							<div className="space-y-4 rounded-xl border border-border p-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label
											htmlFor="sound-effects"
											className="font-normal text-sm"
										>
											Sound Effects
										</Label>
										<p className="text-muted-foreground text-xs">
											Play sounds for correct/incorrect answers
										</p>
									</div>
									<Switch
										id="sound-effects"
										checked={settings.soundEffects}
										onCheckedChange={(checked) =>
											updateSetting("soundEffects", checked)
										}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label
											htmlFor="pronunciation"
											className="font-normal text-sm"
										>
											Pronunciation Feedback
										</Label>
										<p className="text-muted-foreground text-xs">
											Get feedback on your speaking exercises
										</p>
									</div>
									<Switch
										id="pronunciation"
										checked={settings.pronunciationFeedback}
										onCheckedChange={(checked) =>
											updateSetting("pronunciationFeedback", checked)
										}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="auto-play" className="font-normal text-sm">
											Auto-play Audio
										</Label>
										<p className="text-muted-foreground text-xs">
											Automatically play word pronunciations
										</p>
									</div>
									<Switch
										id="auto-play"
										checked={settings.autoPlayAudio}
										onCheckedChange={(checked) =>
											updateSetting("autoPlayAudio", checked)
										}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label
											htmlFor="translations"
											className="font-normal text-sm"
										>
											Show Translations
										</Label>
										<p className="text-muted-foreground text-xs">
											Display translations in your native language
										</p>
									</div>
									<Switch
										id="translations"
										checked={settings.showTranslations}
										onCheckedChange={(checked) =>
											updateSetting("showTranslations", checked)
										}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Billing Section */}
				<section hidden={activeTab !== "billing"}>
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-lg">Billing</h2>
						{(!subscriptionData || subscriptionData.status === "canceled") && (
							<Button
								className="bg-[radial-gradient(100%_100%_at_50%_0%,_#EFFF9B_0%,_#D8FF76_60%,_#C6F64D_100%)] text-slate-900 hover:brightness-95"
								onClick={() => {
									if (!session?.user) return;
									openCheckout({
										priceId: PADDLE_PRICE_IDS.monthly,
										userId: session.user.id,
										email: session.user.email,
									});
								}}
							>
								<Zap className="size-4" />
								Upgrade
							</Button>
						)}
					</div>
					<hr className="mt-4 border-border/50" />
					<div className="mt-6 space-y-6">
						{/* Current Plan */}
						<div>
							<Label className="text-muted-foreground">Your current plan</Label>
							<p className="mt-1 font-medium">
								{subscriptionData
									? (() => {
											const status = subscriptionData.status;
											if (status === "active" || status === "trialing") {
												return (
													<span className="inline-flex items-center gap-1.5">
														<span className="size-2 rounded-full bg-green-500" />
														Pro{" "}
														<span className="text-muted-foreground">
															({status === "trialing" ? "Trial" : "Active"})
														</span>
													</span>
												);
											}
											if (status === "paused") {
												return (
													<span className="inline-flex items-center gap-1.5">
														<span className="size-2 rounded-full bg-yellow-500" />
														Pro{" "}
														<span className="text-muted-foreground">
															(Paused)
														</span>
													</span>
												);
											}
											if (status === "past_due") {
												return (
													<span className="inline-flex items-center gap-1.5">
														<span className="size-2 rounded-full bg-red-500" />
														Pro{" "}
														<span className="text-muted-foreground">
															(Past Due)
														</span>
													</span>
												);
											}
											return (
												<span className="text-muted-foreground">Free</span>
											);
										})()
									: "Free"}
							</p>
						</div>

						{/* Billing Period */}
						{subscriptionData?.currentPeriodEnd &&
							(subscriptionData.status === "active" ||
								subscriptionData.status === "trialing") && (
								<div>
									<Label className="text-muted-foreground">
										Next billing date
									</Label>
									<p className="mt-1 font-medium">
										{new Date(
											subscriptionData.currentPeriodEnd,
										).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
							)}

						{/* Manage Subscription */}
						{subscriptionData && subscriptionData.status !== "canceled" && (
							<div>
								<p className="text-muted-foreground text-sm">
									To manage your subscription, update payment details, or
									cancel, visit your{" "}
									<a
										href="https://customer-portal.paddle.com"
										target="_blank"
										rel="noopener noreferrer"
										className="font-medium text-lime-700 underline hover:text-lime-800"
									>
										Paddle customer portal
									</a>
									.
								</p>
							</div>
						)}
					</div>
				</section>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle className="text-destructive">
							Delete Account
						</DialogTitle>
						<DialogDescription>
							This action is irreversible. All your data, progress, and
							subscription will be permanently deleted.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Label htmlFor="confirm-delete" className="text-sm">
							Type <span className="font-mono font-semibold">DELETE</span> to
							confirm
						</Label>
						<Input
							id="confirm-delete"
							value={deleteConfirmation}
							onChange={(e) => setDeleteConfirmation(e.target.value)}
							placeholder="DELETE"
							className="mt-2"
						/>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setShowDeleteDialog(false);
								setDeleteConfirmation("");
							}}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteAccount}
							disabled={deleteConfirmation !== "DELETE" || isDeleting}
						>
							{isDeleting ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								<Trash2 className="size-4" />
							)}
							Delete Account
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
