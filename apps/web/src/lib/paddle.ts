import {
	type CheckoutEventsData,
	initializePaddle,
	type Paddle,
} from "@paddle/paddle-js";

let paddleInstance: Paddle | null = null;
let paddlePromise: Promise<Paddle | undefined> | null = null;

/**
 * Initialize and return the Paddle.js instance.
 * Reuses the same promise/instance across calls.
 */
export async function getPaddle(): Promise<Paddle | undefined> {
	if (paddleInstance) return paddleInstance;

	if (!paddlePromise) {
		paddlePromise = initializePaddle({
			environment:
				(import.meta.env.VITE_PADDLE_ENVIRONMENT as "sandbox" | "production") ??
				"sandbox",
			token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
		});
	}

	const instance = await paddlePromise;
	if (instance) paddleInstance = instance;
	return instance;
}

/**
 * Open a Paddle overlay checkout for a given price.
 *
 * @param priceId - Paddle price ID (e.g., "pri_01abc...")
 * @param userId  - Your app's user ID, passed as customData so webhooks can link the subscription
 * @param email   - Optional customer email to prefill checkout
 * @param onSuccess - Optional callback fired on checkout.completed
 */
export async function openCheckout(options: {
	priceId: string;
	userId: string;
	email?: string;
	onSuccess?: (data: CheckoutEventsData) => void;
}) {
	const paddle = await getPaddle();
	if (!paddle) {
		console.error("[Paddle] Failed to initialize Paddle.js");
		return;
	}

	paddle.Checkout.open({
		items: [{ priceId: options.priceId, quantity: 1 }],
		customData: { userId: options.userId },
		...(options.email ? { customer: { email: options.email } } : {}),
		settings: {
			displayMode: "overlay",
			theme: "light",
			successUrl: `${window.location.origin}/home?paddle=true`,
		},
	});
}
