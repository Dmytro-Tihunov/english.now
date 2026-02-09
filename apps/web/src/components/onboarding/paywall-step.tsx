import { ArrowRight, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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

export default function PaywallStep({
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
				<div className="mb-3 text-center">
					<h1 className="mb-2 font-bold font-lyon text-4xl tracking-tight md:text-5xl">
						Unlock Your Full Potential
					</h1>
					<p className="text-muted-foreground md:text-lg">
						Join thousands of learners improving their English every day
					</p>
				</div>

				{/* Social proof */}
				<div className="mb-10 flex items-center justify-center gap-4">
					<div className="-space-x-2 flex">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] font-medium text-lime-900 text-xs"
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
												boxShadow:
													"inset 0 0 0 1px #C6F64D, inset 0 0 8px 2px #C6F64D",
											}
										: {
												background: "white",
												boxShadow:
													"0 0 0 1px rgba(0,0,0,.05),0 4px 8px rgba(0,0,0,.04)",
											}
								}
							>
								{plan.popular && (
									<div className="mb-2 flex items-center gap-1 font-medium text-lime-800 text-sm">
										<Star className="size-4" fill="currentColor" />
										Most Popular
									</div>
								)}
								<div>
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

				<div className="mx-auto max-w-md">
					<Button
						size="lg"
						className="en-button-gradient h-14 w-full rounded-2xl text-base text-lime-900"
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
		</div>
	);
}
