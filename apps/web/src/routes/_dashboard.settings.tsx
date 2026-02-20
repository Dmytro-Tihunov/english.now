import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Brain, Loader2, LogOutIcon, SettingsIcon, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Billing } from "@/components/settings/billing";
import { Personalization } from "@/components/settings/personalization";
import { Profile } from "@/components/settings/profile";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { createTitle, PAGE_TITLE } from "@/utils/title";

const VALID_TABS = ["profile", "learning", "billing"] as const;
type SettingsTab = (typeof VALID_TABS)[number];

export const Route = createFileRoute("/_dashboard/settings")({
	validateSearch: (search: Record<string, unknown>): { tab?: SettingsTab } => {
		const tab = search.tab;
		return {
			tab:
				typeof tab === "string" && VALID_TABS.includes(tab as SettingsTab)
					? (tab as SettingsTab)
					: undefined,
		};
	},
	component: RouteComponent,
	pendingComponent: SettingsPending,
	head: () => ({
		meta: [
			{
				title: createTitle(PAGE_TITLE.settings),
			},
		],
	}),
});

function SettingsPending() {
	return (
		<div className="flex h-dvh w-full items-center justify-center">
			<Loader2 className="size-8 animate-spin text-muted-foreground" />
		</div>
	);
}

function RouteComponent() {
	const navigate = useNavigate();

	const { tab } = Route.useSearch();

	const [activeTab, setActiveTab] = useState<SettingsTab>(
		() => tab ?? "profile",
	);

	useEffect(() => {
		setActiveTab(tab ?? "profile");
	}, [tab]);

	const handleTabChange = (value: SettingsTab) => {
		setActiveTab(value);
		if (value === "profile") {
			navigate({ to: "/settings", replace: true });
		} else {
			navigate({ to: "/settings", search: { tab: value }, replace: true });
		}
	};

	const TABS = [
		{
			label: "General",
			value: "profile",
			icon: SettingsIcon,
		},
		{
			label: "Personalization",
			value: "learning",
			icon: Brain,
		},
		{
			label: "Billing & Subscription",
			value: "billing",
			icon: Zap,
		},
	];

	return (
		<div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
			<div className="mb-4 flex flex-col items-center md:flex-row md:items-center md:justify-between">
				<div className="flex items-center">
					<div>
						<h1 className="font-bold font-lyon text-2.5xl text-neutral-950 tracking-tight md:text-3xl">
							Settings
						</h1>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-4 items-start gap-10">
				<div className="col-span-1 flex h-fit flex-col items-stretch gap-0.5 rounded-2xl border border-border/50 bg-muted/50 p-0.5">
					{TABS.map((tab) => (
						<button
							key={tab.value}
							type="button"
							disabled={activeTab === tab.value}
							className={cn(
								"flex h-[34px] cursor-pointer items-center gap-1.5 rounded-xl px-2.5 font-medium text-muted-foreground text-sm italic transition-all",
								activeTab === tab.value &&
									"bg-background text-foreground shadow-sm",
							)}
							onClick={() => handleTabChange(tab.value as SettingsTab)}
						>
							{tab.icon && <tab.icon className="size-4" />}
							{tab.label}
						</button>
					))}
					<hr className="mt-2 border-border/50 border-dashed" />
					<button
						type="button"
						className="mb-1 flex h-[34px] cursor-pointer items-center gap-1.5 rounded-xl px-2.5 font-medium text-muted-foreground text-sm italic transition-all hover:text-foreground"
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
					</button>
				</div>

				<div className="col-span-3">
					<section hidden={activeTab !== "profile"}>
						<Profile />
					</section>
					<section hidden={activeTab !== "learning"}>
						<Personalization />
					</section>
					<section hidden={activeTab !== "billing"}>
						<Billing />
					</section>
				</div>
			</div>
		</div>
	);
}
