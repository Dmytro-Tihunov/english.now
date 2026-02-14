import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckIcon, Loader2, StarIcon } from "lucide-react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { openCheckout } from "@/lib/paddle";
import _plans from "@/lib/plans";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_public/pricing")({
	component: PricingPage,
});

const faqs = [
	{
		question: "Can I switch between plans?",
		answer:
			"Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies at your next billing cycle.",
	},
	{
		question: "Is there a free trial for Pro?",
		answer:
			"Absolutely! We offer a 7-day free trial for our Pro plan. No credit card required to start. You can explore all Pro features and decide if it's right for you.",
	},
	{
		question: "What payment methods do you accept?",
		answer:
			"We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. For Team plans, we also offer invoice-based billing.",
	},
	{
		question: "Do you offer student discounts?",
		answer:
			"No, currently we don't offer student discounts. But we're working on it. Stay tuned!",
		// answer:
		// 	"Yes! Students with a valid .edu email address get 50% off all paid plans. Contact our support team with proof of enrollment to claim your discount.",
	},
	{
		question: "Can I cancel my subscription anytime?",
		answer:
			"Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. No questions asked, no hidden fees.",
	},
	{
		question: "Is my learning progress saved if I cancel?",
		answer:
			"Your progress is always saved, even if you cancel or switch to the free plan. You can pick up where you left off whenever you decide to come back.",
	},
];

function PricingPage() {
	const { data: session } = authClient.useSession();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	async function handlePlanClick(plan: (typeof _plans)[number]) {
		setIsLoading(true);
		if (!plan.paddlePriceId) {
			navigate({ to: "/signup" });
			return;
		}

		if (!session?.user) {
			navigate({ to: "/signup" });
			return;
		}

		await openCheckout({
			priceId: plan.paddlePriceId,
			userId: session.user.id,
			email: session.user.email,
		}).finally(() => {
			setIsLoading(false);
		});
	}

	return (
		<div className="relative">
			<div className="container relative mx-auto max-w-5xl px-4 py-16">
				<div className="mb-16 text-center">
					<h1 className="mb-4 font-bold font-lyon text-5xl text-neutral-950 leading-tight tracking-tight sm:text-5xl lg:text-6xl dark:text-white">
						Which plan is right for you?
						<br />
						<span className="text-muted-foreground">
							Use our 7 day free trial.
						</span>
					</h1>
					<p className="text-balance text-center text-muted-foreground text-sm md:mx-auto md:max-w-boundary-sm md:text-lg">
						All plans include access to our AI-powered learning tools.
					</p>
				</div>

				<div className="relative flex w-full flex-row items-end justify-between gap-3">
					{_plans.map((_plan) => {
						const card = (
							<div
								className={`relative min-h-[428px] w-full gap-6 overflow-hidden rounded-3xl bg-background p-6 ${_plan.isPopular ? "border-[#C6F64D]" : ""}`}
								style={{
									boxShadow:
										"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
								}}
							>
								<div className="relative z-10 mb-4">
									<div className="flex flex-col gap-1.5">
										<div
											data-slot="card-title"
											className="flex items-center gap-2 font-semibold text-lg"
										>
											<span className="font-bold font-lyon text-2xl">
												{_plan.name}
											</span>
											{_plan.duration === "year" && (
												<span className="rounded-md bg-radial from-[#EFFF9B] to-[#D8FF76] px-2 py-3 font-semibold text-lime-900 text-sm normal-case tracking-normal md:py-[0.250rem] md:text-xs">
													Save 20%
												</span>
											)}
										</div>
										<div className="text-muted-foreground text-sm">
											{_plan.description}
										</div>
									</div>
								</div>
								<div className="relative z-10 flex items-baseline">
									<div className="font-semibold text-3xl leading-none tracking-snug md:text-4xl">
										${_plan.price}
									</div>
									<div className="ml-1 text-muted-foreground text-sm md:text-sm md:leading-7">
										/{_plan.duration}
									</div>
								</div>
								<div className="relative z-10 my-6 flex items-center gap-4">
									<Button
										disabled={isLoading}
										variant={_plan.isPopular ? "default" : "outline"}
										onClick={() => handlePlanClick(_plan)}
										className={cn(
											"inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
											_plan.isPopular
												? "bg-linear-to-t from-[#202020] to-[#2F2F2F] text-white shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.4)] outline-none transition-all hover:opacity-90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:from-[rgb(192,192,192)] dark:to-[rgb(255,255,255)] dark:shadow-[inset_0_1px_4px_0_rgba(128,128,128,0.2)] dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none"
												: "border border-border/50 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
										)}
									>
										{isLoading ? (
											<Loader2 className="size-4 animate-spin" />
										) : _plan.price > 0 ? (
											"Start 7-day trial"
										) : (
											"Get started"
										)}
									</Button>
								</div>
								<div className="relative z-10 mb-4 font-medium text-black/50 text-sm">
									What's included
								</div>
								<ul className="relative z-10 space-y-3 text-sm">
									{_plan.features.map((feature) => (
										<li
											className="flex items-center justify-start gap-2"
											key={feature}
										>
											<CheckIcon className="size-4 shrink-0 text-muted-foreground" />
											{feature}
										</li>
									))}
								</ul>
							</div>
						);

						return (
							<div className="w-full" key={_plan.name}>
								{_plan.isPopular ? (
									<div className="relative">
										<div
											className="rounded-[1.6rem] p-2"
											style={{
												background:
													"linear-gradient(180deg, #EFFF9B 0%, #D8FF76 60%, #C6F64D 100%)",
												boxShadow:
													"inset 0 0 0 1px #C6F64D, inset 0 0 8px 2px #C6F64D",
											}}
										>
											<div className="mt-1.5 mb-2.5 flex items-center justify-center gap-1.5 text-center font-medium text-lime-900 text-sm">
												<StarIcon fill="currentColor" className="size-4" />
												Most Popular
											</div>
											{card}
										</div>
									</div>
								) : (
									<div className="relative">
										<div className="p-2">{card}</div>
									</div>
								)}
							</div>
						);
					})}
				</div>

				<div className="mx-auto max-w-3xl sm:mt-20">
					<div className="mb-10 text-center">
						<h2 className="mb-2 font-bold font-lyon text-5xl tracking-tight md:text-5xl">
							FAQs
						</h2>
						<p className="text-lg text-muted-foreground">
							Everything you need to know about our pricing and plans.
						</p>
					</div>

					<div className="overflow-hidden rounded-3xl bg-neutral-100 p-2">
						<Accordion
							type="single"
							collapsible
							className="divide-y rounded-3xl border-border/50 bg-white transition-all duration-300"
							style={{
								boxShadow:
									"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
							}}
						>
							{faqs.map((faq, index) => (
								<AccordionItem
									key={faq.question}
									value={`item-${index}`}
									className="px-6"
								>
									<AccordionTrigger className="py-5 text-left font-medium hover:no-underline">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="pb-5 text-muted-foreground transition-all duration-300">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>
		</div>
	);
}
