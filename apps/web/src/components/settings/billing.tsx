import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { openCheckout } from "@/lib/paddle";
import { useTRPC } from "@/utils/trpc";

const PADDLE_PRICE_IDS = {
	monthly: import.meta.env.VITE_PADDLE_PRICE_MONTHLY ?? "",
	yearly: import.meta.env.VITE_PADDLE_PRICE_YEARLY ?? "",
} as const;

export const Billing = () => {
	const trpc = useTRPC();
	const { data: session } = authClient.useSession();
	const { data: subscriptionData } = useQuery(
		trpc.profile.getSubscription.queryOptions(),
	);

	return (
		<div className="space-y-6">
			{/* {(!subscriptionData ||
								subscriptionData.status === "canceled") && (
								<Button
									className="bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] text-slate-900 hover:brightness-95"
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
							)} */}
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
											<span className="text-muted-foreground">(Paused)</span>
										</span>
									);
								}
								if (status === "past_due") {
									return (
										<span className="inline-flex items-center gap-1.5">
											<span className="size-2 rounded-full bg-red-500" />
											Pro{" "}
											<span className="text-muted-foreground">(Past Due)</span>
										</span>
									);
								}
								return <span className="text-muted-foreground">Free</span>;
							})()
						: "Free"}
				</p>
			</div>

			{/* Billing Period */}
			{subscriptionData?.currentPeriodEnd &&
				(subscriptionData.status === "active" ||
					subscriptionData.status === "trialing") && (
					<div>
						<Label className="text-muted-foreground">Next billing date</Label>
						<p className="mt-1 font-medium">
							{new Date(subscriptionData.currentPeriodEnd).toLocaleDateString(
								"en-US",
								{
									year: "numeric",
									month: "long",
									day: "numeric",
								},
							)}
						</p>
					</div>
				)}

			{/* Manage Subscription */}
			{subscriptionData && subscriptionData.status !== "canceled" && (
				<div>
					<p className="text-muted-foreground text-sm">
						To manage your subscription, update payment details, or cancel,
						visit your{" "}
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
	);
};
