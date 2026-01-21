import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { CheckIcon, FlameIcon, LogOutIcon, Settings, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import SettingsModal from "../settings-modal";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Skeleton } from "../ui/skeleton";

const WEEK_DAYS = [
	{ key: "sat", label: "S" },
	{ key: "sun", label: "S" },
	{ key: "mon", label: "M" },
	{ key: "tue", label: "T" },
	{ key: "wed", label: "W" },
	{ key: "thu", label: "T" },
	{ key: "fri", label: "F" },
] as const;

function StreakDropdown() {
	const today = new Date().getDay();
	// Convert: Sunday=0 -> index 1, Saturday=6 -> index 0, others shift by +1
	const todayIndex = today === 0 ? 1 : today === 6 ? 0 : today + 1;

	// Mock data - in real app this would come from props/API
	const streak = 0;
	const completedDays: string[] = []; // keys of completed days

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex cursor-pointer items-center justify-center gap-0.5 rounded-xl px-3 py-2 font-medium text-orange-400 text-sm transition-colors hover:bg-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
				>
					<FlameIcon className="size-4" fill="currentColor" />
					{streak}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-[320px] rounded-3xl border border-border/50 p-2.5 shadow-none"
				sideOffset={23}
				side="bottom"
			>
				{/* Header */}
				<div className="rounded-xl border border-border/50 p-4">
					<div className="mb-4 flex items-start justify-between">
						<div>
							<h3 className="font-semibold text-orange-500 text-xl">
								{streak} day streak
							</h3>
							<p className="mt-0.5 text-muted-foreground text-sm">
								Time to start your first lesson!
							</p>
						</div>
						<div className="rounded-xl bg-radial from-orange-400 to-orange-500 p-2">
							<FlameIcon className="size-6 text-white" fill="white" />
						</div>
					</div>

					{/* Week Progress */}
					<div className="mb-6 flex items-center justify-between">
						{WEEK_DAYS.map((day, index) => {
							const isToday = index === todayIndex;
							const isCompleted = completedDays.includes(day.key);

							return (
								<div key={day.key} className="flex flex-col items-center gap-2">
									<span className="font-medium text-neutral-500 text-xs">
										{day.label}
									</span>
									<div
										className={cn(
											"flex size-9 items-center justify-center rounded-full transition-all",
											isCompleted
												? "bg-[#EA580C]"
												: isToday
													? "border-2 border-orange-300 bg-transparent"
													: "bg-gray-100",
										)}
									>
										{isCompleted && (
											<FlameIcon className="size-4 text-white" fill="white" />
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				{/* Stats Grid */}
				<div className="grid grid-cols-2 gap-4 px-4 py-2.5 pb-0">
					<div className="flex flex-col">
						<div className="mb-1 flex items-center font-medium text-muted-foreground text-xs">
							Current Streak
						</div>
						<span className="font-semibold text-gray-900 text-lg">1</span>
					</div>

					<div className="flex flex-col">
						<div className="mb-1 flex items-center font-medium text-muted-foreground text-xs">
							Longest Streak
						</div>
						<span className="font-semibold text-gray-900 text-lg">1</span>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UpgradeDialog() {
	const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
	// const [freeTrial, setFreeTrial] = useState(true);
	const features = [
		"Unlimited AI conversations",
		"Advanced AI feedback",
		"Full vocabulary library",
		"Personalized learning path",
		"Progress tracking and analytics",
	];
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					type="button"
					aria-label="Upgrade now"
					className="group flex w-full cursor-pointer items-center justify-center gap-0.5 whitespace-nowrap rounded-xl px-2 py-2 font-medium text-lime-700 text-sm shadow-none transition duration-150 ease-in-out will-change-transform hover:bg-lime-700/10 focus:shadow-none focus:outline-none focus-visible:shadow-none focus-visible:shadow-outline-indigo active:scale-97"
				>
					<Zap fill="currentColor" className="size-3.5" />
					Upgrade
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="mb-2 font-bold font-lyon text-[1.7rem] leading-tight">
						Upgrade Your Plan
					</DialogTitle>
					<DialogDescription className="text-lg">
						Join{" "}
						<span className="rounded-lg bg-lime-100 px-2 py-0.5 font-medium text-lime-700">
							10,000+
						</span>{" "}
						learners and start your <br /> journey to fluency today.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						{features.map((feature) => (
							<div className="flex items-center gap-2" key={feature}>
								<CheckIcon className="size-4 shrink-0 text-muted-foreground" />
								<span className="text-muted-foreground text-sm">{feature}</span>
							</div>
						))}
					</div>
				</div>
				<RadioGroup
					value={plan}
					onValueChange={(value) => setPlan(value as "monthly" | "yearly")}
					className="grid grid-cols-1 gap-3"
				>
					<Label
						htmlFor="yearly"
						className={cn(
							"relative flex cursor-pointer flex-col items-center rounded-2xl border p-4 transition-all",
							plan === "yearly"
								? "border-lime-600 dark:bg-lime-950/30"
								: "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600",
						)}
					>
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<RadioGroupItem value="yearly" id="yearly" />
								<span className="font-bold text-slate-900 dark:text-white">
									Yearly
								</span>
								<span className="rounded-md bg-lime-100 bg-radial px-2 py-1 font-medium text-lime-700 text-xs">
									Save 20%
								</span>
							</div>
							<div>
								<span className="font-bold text-lg text-slate-900 dark:text-white">
									$100
								</span>
								<span className="ml-1 font-light text-muted-foreground text-xs md:text-sm md:leading-7">
									/year
								</span>
							</div>
						</div>
					</Label>
					<Label
						htmlFor="monthly"
						className={cn(
							"relative flex cursor-pointer flex-col items-center rounded-2xl border p-4 transition-all",
							plan === "monthly"
								? "border-lime-600 dark:border-[#D8FF76] dark:bg-lime-950/30"
								: "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600",
						)}
					>
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<RadioGroupItem value="monthly" id="monthly" />
								<span className="font-bold text-slate-900 dark:text-white">
									Monthly
								</span>
							</div>
							<div>
								<span className="font-bold text-lg text-slate-900 dark:text-white">
									$10
								</span>
								<span className="ml-1 font-light text-muted-foreground text-xs md:text-sm md:leading-7">
									/month
								</span>
							</div>
						</div>
					</Label>
				</RadioGroup>
				{/* <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <div className="flex flex-col">
            <span className="font-medium text-slate-900 text-sm dark:text-white">
              Include free trial
            </span>
            <span className="text-slate-500 text-xs dark:text-slate-400">
              7 days free, cancel anytime
            </span>
          </div>
          <Switch checked={freeTrial} onCheckedChange={setFreeTrial} />
        </div> */}
				{/* <div className="text-center text-neutral-500 text-xs dark:text-neutral-400">
        Cancel anytime. We’ll remind you 7 days before your trial ends.
        </div> */}
				<div className="mt-1 flex">
					<Button className="relative inline-flex h-12 w-full shrink-0 cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-2xl bg-linear-to-t from-[#202020] to-[#2F2F2F] text-base text-white shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.4)] outline-none transition-all hover:opacity-90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:from-[rgb(192,192,192)] dark:to-[rgb(255,255,255)] dark:shadow-[inset_0_1px_4px_0_rgba(128,128,128,0.2)] dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none">
						Start 7-Day Free Trial
					</Button>
				</div>
				<div>
					<div className="text-center text-muted-foreground text-xs">
						By continuing, you agree to our{" "}
						<Link
							target="_blank"
							className="text-lime-700 hover:text-lime-700/80"
							to="/terms"
						>
							Terms of Service
						</Link>
						,{" "}
						<Link
							target="_blank"
							className="text-lime-700 hover:text-lime-700/80"
							to="/privacy"
						>
							Privacy
						</Link>{" "}
						and{" "}
						<Link
							target="_blank"
							className="text-lime-700 hover:text-lime-700/80"
							to="/refund"
						>
							Refund & Cancellation Policy
						</Link>
						.
					</div>
					{/* 
					<div className="flex items-center justify-center gap-1.5 font-medium text-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={16}
							height={17}
							fill="none"
							className="shrink-0"
							aria-label="Shield checkmark"
							role="img"
							viewBox="0 0 16 17"
						>
							<title>Safe &amp; secure payment</title>
							<path
								fill="#278C49"
								d="M.895 4.654c0-.62.37-1.186.939-1.437L7.36.776c.403-.181.869-.181 1.28 0l5.526 2.441c.568.251.94.817.94 1.437v3.69a9.9 9.9 0 0 1-1.25 4.773c-2.435 4.417-8.488 4.417-11.713 0A9.9 9.9 0 0 1 .895 8.344z"
							/>
							<g clipPath="url(#a)">
								<path
									stroke="#fff"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.184}
									d="M10.632 6.562 7.014 10.18 5.369 8.536"
								/>
							</g>
							<defs>
								<clipPath id="a">
									<rect
										x={4.053}
										y={4.585}
										width={7.895}
										height={7.895}
										fill="#fff"
									/>
								</clipPath>
							</defs>
						</svg>
						Pay safe &amp; Secure
					</div> */}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default function Navbar() {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { data: session, isPending } = authClient.useSession();

	const _links = [
		{
			to: "/home",
			label: "Home",
		},
		{
			to: "/practice",
			label: "Practice",
		},
		{
			to: "/vocabulary",
			label: "Vocabulary",
		},
	];

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={`sticky border-border/50 border-b ${
				isScrolled ? "border-b" : ""
			}`}
			// style={{
			//   boxShadow:
			//     "rgba(0, 0, 0, 0.04) 0px 8px 12px -4px, rgba(0, 0, 0, 0.055) 0px 0px 2px 0px, rgba(0, 0, 0, 0.055) 0px 1px 2px 0px",
			// }}
		>
			<div className="container relative z-10 mx-auto max-w-5xl px-4">
				<nav className="flex grid-cols-2 items-center justify-between py-5 md:grid-cols-5">
					<div className="col-span-3 items-center gap-3 md:flex">
						<Logo />
						<div className="hidden gap-1.5 md:flex">
							{_links.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className={cn(
										"w-auto rounded-xl px-3 py-2 font-medium transition-all duration-300 hover:bg-neutral-200/60 md:inline-flex md:items-center md:justify-center md:text-sm",
										location.pathname === link.to ? "" : "bg-transparent",
									)}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>

					<div className="relative z-50 flex items-center justify-end gap-1">
						{/* <UpgradeDialog /> */}
						<StreakDropdown />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="ml-2 flex w-full cursor-pointer flex-col items-start transition-opacity hover:opacity-80">
									<div className="flex flex-row items-center gap-2">
										{isPending || !session ? (
											<Skeleton className="size-8 rounded-full" />
										) : (
											<div className="relative flex items-center gap-2">
												<img
													src={session.user.image ?? undefined}
													alt={session.user.name ?? ""}
													className="size-8.5 rounded-full"
												/>
											</div>
										)}
									</div>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-[220px] rounded-xl shadow-sm"
								sideOffset={8}
								side="bottom"
							>
								<DropdownMenuLabel>
									<div className="flex flex-col text-gray-500 text-xs">
										Signed in as
										<span className="font-medium">{session?.user.email}</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Button
										variant="ghost"
										className="w-full text-left"
										onClick={() => setSettingsOpen(true)}
									>
										<Settings className="size-4" />
										Settings
									</Button>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Button
										className="w-full"
										variant="ghost"
										onClick={() => {
											authClient.signOut({
												fetchOptions: {
													onSuccess: () => {
														navigate({
															to: "/",
														});
													},
												},
											});
										}}
									>
										<LogOutIcon className="size-4" />
										Sign Out
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
							<SettingsModal
								open={settingsOpen}
								onOpenChange={setSettingsOpen}
							/>
						</DropdownMenu>
					</div>
				</nav>
			</div>
		</div>
	);
}
