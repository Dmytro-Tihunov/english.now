import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/features")({
	component: RouteComponent,
});

const features = [
	{
		id: "conversations",
		title: "AI Conversations",
		description:
			"Practice speaking with our AI tutor in real-life scenarios. Get instant feedback on your pronunciation and grammar.",
		video: "/features/conversations.gif", // Replace with your Screen Studio GIF
		badge: "Speaking",
	},
	{
		id: "feedback",
		title: "Instant Feedback",
		description:
			"Receive detailed corrections and explanations for every mistake. Learn why something is wrong, not just that it's wrong.",
		video: "/features/feedback.gif", // Replace with your Screen Studio GIF
		badge: "AI-Powered",
	},
	{
		id: "vocabulary",
		title: "Smart Vocabulary",
		description:
			"Build your vocabulary with spaced repetition. Words are introduced in context and reviewed at optimal intervals.",
		video: "/features/vocabulary.gif", // Replace with your Screen Studio GIF
		badge: "Learning",
	},
	{
		id: "progress",
		title: "Track Progress",
		description:
			"See your improvement over time with detailed analytics. Track streaks, accuracy, and areas that need work.",
		video: "/features/progress.gif", // Replace with your Screen Studio GIF
		badge: "Analytics",
	},
	{
		id: "pronunciation",
		title: "Pronunciation Coach",
		description:
			"Perfect your accent with our speech recognition technology. Get word-by-word feedback on how to sound more natural.",
		video: "/features/pronunciation.gif", // Replace with your Screen Studio GIF
		badge: "Speaking",
	},
	{
		id: "lessons",
		title: "Personalized Lessons",
		description:
			"Lessons adapt to your level and goals. Whether you're preparing for a job interview or casual conversation.",
		video: "/features/lessons.gif", // Replace with your Screen Studio GIF
		badge: "Adaptive",
	},
];

function FeatureBlock({
	feature,
	reverse = false,
}: {
	feature: (typeof features)[0];
	reverse?: boolean;
}) {
	return (
		<div
			className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${reverse ? "lg:flex-row-reverse" : ""}`}
		>
			{/* Video/GIF Container */}
			<div className="flex-1">
				<div
					className="relative aspect-video overflow-hidden rounded-2xl border border-border/50 bg-neutral-100"
					style={{
						boxShadow:
							"0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.04), 0 12px 24px rgba(0,0,0,.06)",
					}}
				>
					{/* Placeholder - replace src with your Screen Studio GIF */}
					<img
						src={feature.video}
						alt={`${feature.title} demo video`}
						className="h-full w-full object-cover"
						loading="lazy"
					/>
					{/* Fallback placeholder if no video yet */}
					<div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-neutral-50 to-neutral-100">
						<div className="text-center">
							<div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]">
								<svg
									className="size-8 text-lime-700"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
									/>
								</svg>
							</div>
							<p className="text-neutral-400 text-sm">GIF Preview</p>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 lg:max-w-md">
				<span className="mb-3 inline-block rounded-full bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] px-3 py-1 font-medium text-lime-800 text-xs">
					{feature.badge}
				</span>
				<h2 className="mb-4 font-bold font-lyon text-3xl tracking-tight md:text-4xl">
					{feature.title}
				</h2>
				<p className="text-lg text-muted-foreground leading-relaxed">
					{feature.description}
				</p>
			</div>
		</div>
	);
}

function RouteComponent() {
	return (
		<div className="container relative z-10 mx-auto max-w-5xl px-4 py-2 pt-18">
			<div className="mb-20 flex flex-col items-center text-center">
				<h1 className="mb-6 font-bold font-lyon text-5xl tracking-tight md:text-6xl">
					Everything you need to master English
				</h1>
			</div>

			{/* Features Grid */}
			<div className="space-y-24 pb-20 md:space-y-32">
				{features.map((feature, index) => (
					<FeatureBlock
						key={feature.id}
						feature={feature}
						reverse={index % 2 === 1}
					/>
				))}
			</div>

			{/* CTA Section */}
			<div
				className="mb-20 rounded-3xl border border-border/50 bg-neutral-50 p-8 text-center md:p-16"
				style={{
					boxShadow:
						"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
				}}
			>
				<h2 className="mb-4 font-bold font-lyon text-3xl tracking-tight md:text-4xl">
					Ready to start learning?
				</h2>
				<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
					Join thousands of learners who are already improving their English
					with our AI-powered platform.
				</p>
				<a
					href="/login"
					className="inline-flex h-12 items-center justify-center rounded-2xl bg-linear-to-t from-[#202020] to-[#2F2F2F] px-8 font-medium text-base text-white shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.4)] transition-all hover:opacity-90"
				>
					Get started for free
				</a>
			</div>
		</div>
	);
}
