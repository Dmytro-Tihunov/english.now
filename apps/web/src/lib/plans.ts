const PADDLE_PRICE_IDS = {
	monthly: import.meta.env.VITE_PADDLE_PRICE_MONTHLY ?? "",
	yearly: import.meta.env.VITE_PADDLE_PRICE_YEARLY ?? "",
} as const;

const _plans = [
	{
		name: "Free",
		description: "Great for beginners.",
		price: 0,
		isPopular: false,
		duration: "forever",
		paddlePriceId: null as string | null,
		features: [
			"1 AI conversations per day",
			"Basic grammar lessons",
			"Limited vocabulary exercises",
			"Progress tracking",
		],
	},
	{
		name: "Monthly",
		description: "Great for intermediate learners.",
		price: 12,
		isPopular: true,
		duration: "month",
		paddlePriceId: PADDLE_PRICE_IDS.monthly,
		features: [
			"Unlimited AI conversations",
			"Advanced AI feedback",
			"Full vocabulary library",
			"Personalized learning path",
			"Progress tracking and analytics",
		],
	},
	{
		name: "Yearly",
		description: "Great for advanced learners.",
		price: 100,
		isPopular: false,
		duration: "year",
		paddlePriceId: PADDLE_PRICE_IDS.yearly,
		features: [
			"Unlimited AI conversations",
			"Advanced AI feedback",
			"Full vocabulary library",
			"Personalized learning path",
			"Progress tracking and analytics",
		],
	},
];

export default _plans;
