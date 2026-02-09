import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GrammarIcon } from "../icons/grammar";
import { SpeakingIcon } from "../icons/speaking";
import { VocabularyIcon } from "../icons/vocabulary";

// Practice Demo - Interactive exercise with typing animation
function PracticeDemo() {
	const [step, setStep] = useState(0);
	const [typedAnswer, setTypedAnswer] = useState("");
	const [showResult, setShowResult] = useState(false);

	const exercise = {
		sentence: "She ___ to the store yesterday.",
		options: ["go", "went", "goes", "going"],
		correctAnswer: "went",
		explanation: "Use past tense for completed actions",
	};

	useEffect(() => {
		const cycle = () => {
			setStep(0);
			setTypedAnswer("");
			setShowResult(false);

			// Show options appearing
			setTimeout(() => setStep(1), 500);

			// Start typing animation
			setTimeout(() => {
				const answer = exercise.correctAnswer;
				let i = 0;
				const typeInterval = setInterval(() => {
					if (i <= answer.length) {
						setTypedAnswer(answer.slice(0, i));
						i++;
					} else {
						clearInterval(typeInterval);
					}
				}, 120);
			}, 1500);

			// Show result
			setTimeout(() => {
				setShowResult(true);
				setStep(2);
			}, 2500);
		};

		cycle();
		const interval = setInterval(cycle, 6000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="">
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="relative z-10 flex h-full flex-col"
			>
				{/* Question */}
				<div className="mb-3">
					<p className="font-medium text-neutral-800">
						She{" "}
						<span className="inline-flex min-w-[60px] items-center justify-center rounded-lg border-2 border-[#C6F64D] border-dashed bg-[#F5FFE0] px-2 py-0.5">
							<motion.span
								className="font-semibold text-[#5a8a00]"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								{typedAnswer || "_____"}
							</motion.span>
							{typedAnswer && typedAnswer !== exercise.correctAnswer && (
								<motion.span
									className="ml-0.5 inline-block h-4 w-0.5 bg-[#5a8a00]"
									animate={{ opacity: [1, 0] }}
									transition={{
										duration: 0.5,
										repeat: Number.POSITIVE_INFINITY,
									}}
								/>
							)}
						</span>{" "}
						to the store yesterday.
					</p>
				</div>

				{/* Options */}
				<div className="mb-3 grid grid-cols-2 gap-2">
					{exercise.options.map((option, i) => (
						<motion.button
							key={option}
							type="button"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{
								scale: step >= 1 ? 1 : 0.8,
								opacity: step >= 1 ? 1 : 0,
							}}
							transition={{ delay: i * 0.1, duration: 0.3, type: "spring" }}
							className={`rounded-lg px-3 py-2 font-medium text-sm transition-all ${
								showResult && option === exercise.correctAnswer
									? "bg-[#C6F64D] text-[#2d4a00] ring-2 ring-[#C6F64D]/50"
									: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
							}`}
						>
							{option}
						</motion.button>
					))}
				</div>

				{/* Result */}
				<AnimatePresence>
					{showResult && (
						<motion.div
							initial={{ y: 10, opacity: 0, height: 0 }}
							animate={{ y: 0, opacity: 1, height: "auto" }}
							exit={{ y: -10, opacity: 0, height: 0 }}
							transition={{ duration: 0.4, type: "spring" }}
							className="flex items-center gap-2 rounded-lg bg-[#F5FFE0] px-3 py-2"
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
								className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C6F64D]"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#2d4a00"
									strokeWidth="3"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</motion.div>
							<span className="text-[#2d4a00] text-sm">
								{exercise.explanation}
							</span>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}

// Review Mistakes Demo - Shows mistakes being highlighted and corrected
function ReviewMistakesDemo() {
	const [step, setStep] = useState(0);

	const mistakes = [
		{
			id: "mistake1",
			original: "I goed to school",
			corrected: "I went to school",
			errorWord: "goed",
			correctWord: "went",
			type: "Past tense",
		},
		{
			id: "mistake2",
			original: "She don't like it",
			corrected: "She doesn't like it",
			errorWord: "don't",
			correctWord: "doesn't",
			type: "Subject-verb",
		},
	];

	useEffect(() => {
		const cycle = () => {
			setStep(0);
			setTimeout(() => setStep(1), 600);
			setTimeout(() => setStep(2), 1500);
			setTimeout(() => setStep(3), 2500);
			setTimeout(() => setStep(4), 3500);
		};

		cycle();
		const interval = setInterval(cycle, 6000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="">
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="relative z-10 flex h-full flex-col"
			>
				{/* Mistake cards */}
				<div className="flex flex-1 flex-col gap-2">
					{mistakes.map((mistake, i) => (
						<motion.div
							key={mistake.id}
							initial={{ x: -20, opacity: 0 }}
							animate={{
								x: step >= i + 1 ? 0 : -20,
								opacity: step >= i + 1 ? 1 : 0,
							}}
							transition={{ duration: 0.4, type: "spring" }}
							className="relative rounded-lg border border-neutral-100 bg-white p-3"
							style={{
								boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
							}}
						>
							{/* Error type badge */}
							<motion.span
								initial={{ opacity: 0, y: -5 }}
								animate={{
									opacity: step >= i + 2 ? 1 : 0,
									y: step >= i + 2 ? 0 : -5,
								}}
								className="mb-1 inline-block rounded bg-red-100 px-1.5 py-0.5 font-medium text-[10px] text-red-600"
							>
								{mistake.type}
							</motion.span>

							{/* Original with strikethrough */}
							<div className="flex items-center gap-2 text-sm">
								<motion.span
									className="text-neutral-400 line-through"
									animate={{
										opacity: step >= i + 3 ? 0.5 : 1,
									}}
								>
									{mistake.original}
								</motion.span>

								{/* Arrow */}
								<AnimatePresence>
									{step >= i + 3 && (
										<motion.svg
											initial={{ width: 0, opacity: 0 }}
											animate={{ width: 20, opacity: 1 }}
											transition={{ duration: 0.3 }}
											height="12"
											viewBox="0 0 20 12"
											fill="none"
											className="text-[#C6F64D]"
											aria-hidden="true"
										>
											<motion.path
												d="M0 6h16M12 1l5 5-5 5"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												initial={{ pathLength: 0 }}
												animate={{ pathLength: 1 }}
												transition={{ duration: 0.4 }}
											/>
										</motion.svg>
									)}
								</AnimatePresence>

								{/* Corrected */}
								<AnimatePresence>
									{step >= i + 3 && (
										<motion.span
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: 0.2 }}
											className="font-medium text-[#5a8a00]"
										>
											{mistake.corrected}
										</motion.span>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
}

// Get Feedback Demo - Shows AI feedback with arrows pointing to issues
function GetFeedbackDemo() {
	const [step, setStep] = useState(0);

	useEffect(() => {
		const cycle = () => {
			setStep(0);
			setTimeout(() => setStep(1), 500); // Show text
			setTimeout(() => setStep(2), 1200); // Highlight error
			setTimeout(() => setStep(3), 1800); // Show arrow
			setTimeout(() => setStep(4), 2400); // Show suggestion card
			setTimeout(() => setStep(5), 3500); // Apply fix
		};

		cycle();
		const interval = setInterval(cycle, 6500);
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="relative z-10 flex h-full flex-col"
			>
				{/* User text with highlighted error */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: step >= 1 ? 1 : 0 }}
					className="relative mb-4 rounded-lg bg-neutral-50 p-3"
				>
					<p className="text-neutral-700 text-sm leading-relaxed">
						I am very{" "}
						<motion.span
							className="relative inline-block"
							animate={{
								backgroundColor:
									step >= 2 && step < 5
										? "rgba(239, 68, 68, 0.15)"
										: step >= 5
											? "rgba(198, 246, 77, 0.3)"
											: "transparent",
							}}
							style={{ padding: "0 2px", borderRadius: "4px" }}
						>
							<AnimatePresence mode="wait">
								{step < 5 ? (
									<motion.span
										key="wrong"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0, y: -10 }}
										className={step >= 2 && step < 5 ? "text-red-500" : ""}
									>
										exciting
									</motion.span>
								) : (
									<motion.span
										key="correct"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className="font-medium text-[#5a8a00]"
									>
										excited
									</motion.span>
								)}
							</AnimatePresence>

							{/* Underline animation */}
							{step >= 2 && step < 5 && (
								<motion.div
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-red-400"
									style={{ borderRadius: "2px" }}
								/>
							)}
						</motion.span>{" "}
						about this.
					</p>

					{/* Animated arrow pointing to error */}
					<AnimatePresence>
						{step >= 3 && step < 5 && (
							<motion.div
								initial={{ opacity: 0, scale: 0.5 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.5 }}
								transition={{ type: "spring", stiffness: 300 }}
								className="absolute"
								style={{ top: "50%", right: "-8px" }}
							>
								<svg
									width="60"
									height="40"
									viewBox="0 0 60 40"
									fill="none"
									className="overflow-visible"
									aria-hidden="true"
								>
									{/* Curved arrow path */}
									<motion.path
										d="M 55 20 Q 30 5 10 15"
										stroke="#C6F64D"
										strokeWidth="2"
										strokeLinecap="round"
										fill="none"
										initial={{ pathLength: 0 }}
										animate={{ pathLength: 1 }}
										transition={{ duration: 0.5 }}
									/>
									{/* Arrow head */}
									<motion.path
										d="M 15 10 L 10 15 L 17 18"
										stroke="#C6F64D"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										fill="none"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.4 }}
									/>
								</svg>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Suggestion card */}
				<AnimatePresence>
					{step >= 4 && (
						<motion.div
							initial={{ y: 20, opacity: 0, scale: 0.95 }}
							animate={{ y: 0, opacity: 1, scale: 1 }}
							exit={{ y: -10, opacity: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 25 }}
							className="flex items-start gap-3 rounded-lg border bg-white p-3"
							style={{
								boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
							}}
						>
							<motion.div
								initial={{ rotate: -180, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								transition={{ delay: 0.2, type: "spring" }}
								className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C6F64D]"
							>
								<svg
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#2d4a00"
									strokeWidth="3"
									aria-hidden="true"
								>
									<path d="M12 5v14M5 12h14" />
								</svg>
							</motion.div>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<span className="text-red-400 text-sm line-through">
										exciting
									</span>
									<motion.svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										initial={{ x: -5, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.3 }}
										aria-hidden="true"
									>
										<path
											d="M5 12h14M12 5l7 7-7 7"
											stroke="#5a8a00"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</motion.svg>
									<motion.span
										initial={{ x: -5, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.4 }}
										className="font-semibold text-[#5a8a00] text-sm"
									>
										excited
									</motion.span>
								</div>
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
									className="mt-1 text-[#5a8a00]/70 text-xs"
								>
									Use 'excited' to describe how you feel
								</motion.p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}

export function Features() {
	const _features = [
		{
			id: "grammar",
			icon: SpeakingIcon,
			title: "Practice speaking",
			description:
				"Master rules with interactive exercises and instant feedback",
			demo: PracticeDemo,
		},
		{
			id: "feedback",
			icon: VocabularyIcon,
			title: "Get feedback",
			description: "Get AI-powered corrections with detailed explanations",
			demo: GetFeedbackDemo,
		},
		{
			id: "mistakes",
			icon: GrammarIcon,
			title: "Review mistakes",
			description: "Track and learn from your errors to improve faster",
			demo: ReviewMistakesDemo,
		},
	];

	return (
		<div className="relative mx-auto md:mt-24">
			<div
				className="rounded-3xl border border-border/50 bg-neutral-50 px-6 pt-8 pb-6"
				style={{
					boxShadow:
						"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
				}}
			>
				<h1 className="mb-10 text-left font-bold font-lyon text-4xl tracking-tight md:text-5xl">
					English learning is broken.
					<br />
					We are here to fix it for you
				</h1>
				<div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
					{_features.map((feature, _i) => (
						<div key={feature.id}>
							<div className={cn("z-10 mb-4 flex items-center gap-2")}>
								<feature.icon />
								<h2 className="font-bold font-lyon text-2xl">
									{feature.title}
								</h2>
							</div>
							<div
								key={feature.id}
								className="relative flex min-h-[240px] items-end"
								// style={{
								// 	boxShadow:
								// 		"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
								// }}
							>
								<div
									className="pointer-events-none absolute top-0 right-0 left-0 z-20 bg-linear-to-b from-10% from-neutral-50/85 to-90% to-neutral-50/5"
									style={{
										height: "200px",
									}}
								/>
								<feature.demo />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
