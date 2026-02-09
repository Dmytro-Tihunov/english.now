import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { CheckIcon, LogOutIcon, Settings, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/loader";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { openCheckout } from "@/lib/paddle";
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

const PADDLE_PRICE_IDS = {
	monthly: import.meta.env.VITE_PADDLE_PRICE_MONTHLY ?? "",
	yearly: import.meta.env.VITE_PADDLE_PRICE_YEARLY ?? "",
} as const;

function UpgradeDialog() {
	const [isLoading, setIsLoading] = useState(false);
	const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
	const { data: session } = authClient.useSession();

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
					className="flex cursor-pointer items-center gap-0.5 whitespace-nowrap rounded-xl border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] px-2.5 py-1.5 font-medium text-lime-900 text-sm italic shadow-none transition duration-150 ease-in-out will-change-transform hover:bg-lime-700/10 hover:brightness-95 focus:shadow-none focus:outline-none focus-visible:shadow-none"
				>
					<Zap fill="currentColor" className="size-3.5" />
					PRO{" "}
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
									Save 30%
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
									$12
								</span>
								<span className="ml-1 font-light text-muted-foreground text-xs md:text-sm md:leading-7">
									/month
								</span>
							</div>
						</div>
					</Label>
				</RadioGroup>

				<div className="mt-1 flex">
					<Button
						disabled={isLoading}
						className="en-button-gradient h-14 w-full rounded-2xl text-base text-lime-900"
						onClick={async () => {
							if (!session?.user) return;
							setIsLoading(true);
							await openCheckout({
								priceId:
									plan === "yearly"
										? PADDLE_PRICE_IDS.yearly
										: PADDLE_PRICE_IDS.monthly,
								userId: session.user.id,
								email: session.user.email,
								onSuccess: (data) => {
									console.log(data);
									setIsLoading(false);
									toast.success("Subscription successful");
								},
							});
						}}
					>
						{isLoading ? <Loader /> : "Start 7-Day Free Trial"}
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
			to: "/lessons",
			label: "Lessons",
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
										"w-auto rounded-xl px-2.5 py-2 font-medium transition-all duration-300 hover:bg-neutral-200/60 md:inline-flex md:items-center md:justify-center md:text-sm",
										location.pathname === link.to ? "" : "bg-transparent",
									)}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>

					<div className="relative flex items-center justify-end gap-2">
						<UpgradeDialog />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="ml-2 flex w-full cursor-pointer flex-col items-start transition-opacity hover:opacity-80">
									<div className="flex flex-row items-center gap-2">
										{isPending || !session ? (
											<Skeleton className="size-8.5 rounded-full" />
										) : (
											<div className="relative flex items-center gap-2">
												{!session.user.image ? (
													<div className="relative flex size-8.5 items-center justify-center space-x-0 overflow-hidden rounded-full border border-neutral-300 bg-neutral-200 font-bold font-lyon text-neutral-400 uppercase">
														<svg
															className="absolute bottom-[-5px] h-full w-full object-contain"
															width="147"
															height="182"
															viewBox="0 0 147 182"
															fill="currentColor"
															stroke="currentColor"
															strokeWidth={2.5}
															xmlns="http://www.w3.org/2000/svg"
															aria-hidden="true"
														>
															<path
																d="M67.334 5.42313C63.3714 11.1355 58.8324 16.7032 48.0974 28.7064C35.129 43.2404 29.7975 51.9897 28.2125 61.0282L27.3479 65.9452L25.4747 62.2575C24.466 60.1605 21.7282 56.5451 19.3507 54.1589C14.3074 48.8804 14.7397 48.5912 9.91253 60.0882C-1.25475 86.6977 -3.12797 114.97 5.01333 135.361C14.3794 158.861 33.1837 174.697 59.1927 181.06C61.6422 181.638 67.334 182 73.9623 182C83.4004 181.928 85.6339 181.711 91.974 179.975C119.496 172.383 139.669 151.269 145.793 123.575C147.018 117.79 147.162 115.187 146.874 104.269C146.297 85.2515 142.767 70.8621 134.121 53.2189C129.871 44.3973 120.649 29.791 115.894 24.3679L113.444 21.5479L110.274 23.6448C105.015 27.1156 98.8905 33.768 96.8012 38.2511L94.8559 42.445L94.4236 37.7449C93.8472 32.2495 92.9827 29.6464 89.6685 23.7171C87.363 19.6679 80.3745 10.557 73.8182 3.18157L71.0804 4.05312e-06L67.334 5.42313ZM43.0541 115.187C50.7632 119.67 57.0312 123.503 57.0312 123.792C57.0312 124.081 56.0946 125.6 54.9419 127.19C52.4202 130.733 48.8899 132.469 44.2789 132.469C37.8667 132.397 33.0396 129.07 29.5093 122.056C27.3479 117.79 26.6995 107.161 28.6447 107.161C28.9329 107.161 35.4172 110.776 43.0541 115.187ZM119.568 111.789C120.288 125.889 107.968 136.518 97.0173 131.312C94.7118 130.227 90.1728 125.238 90.1728 123.792C90.1728 123.069 117.839 107.161 118.631 107.378C119.064 107.522 119.424 109.475 119.568 111.789Z"
																fill="transparent"
															/>
														</svg>
													</div>
												) : (
													<img
														src={session.user.image ?? undefined}
														alt={session.user.name ?? ""}
														className="size-8.5 rounded-full"
													/>
												)}
											</div>
										)}
									</div>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-[200px] rounded-xl shadow-sm"
								sideOffset={8}
								side="bottom"
							>
								<DropdownMenuLabel>
									<div className="flex flex-col text-xs">
										{session?.user.name}
										<span className="font-medium text-gray-500">
											{session?.user.email}
										</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Button
										asChild
										variant="ghost"
										className="w-full justify-start rounded-lg border-none text-left hover:border-none hover:bg-neutral-100"
										// onClick={() => setSettingsOpen(true)}
									>
										<Link to="/settings">
											<Settings className="size-4" />
											Settings
										</Link>
									</Button>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Button
										className="w-full justify-start rounded-lg border-none text-left hover:border-none hover:bg-neutral-100"
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
