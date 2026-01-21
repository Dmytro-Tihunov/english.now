export const Letter = () => {
	return (
		<div className="container mx-auto max-w-5xl pt-24">
			<div className="mb-14 text-center">
				<h2 className="mb-2 font-bold font-lyon text-4xl tracking-tight md:text-5xl">
					The story behind English Now
				</h2>
				<p className="text-balance text-center text-muted-foreground text-sm md:mx-auto md:max-w-boundary-sm md:text-lg">
					A letter from the founder.
				</p>
			</div>
			<div className="flex justify-center lg:gap-20">
				<div className="-mt-1.5 w-full shrink-0 lg:w-[64%]">
					<div className="relative size-full">
						{/* <svg
							className="-ml-1 size-10 text-muted-foreground/50 md:size-16 dark:text-muted-foreground/50"
							viewBox="0 0 66 66"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								d="M16.8583 30.7962C15.6157 30.8178 14.502 30.8951 13.5069 31.0219C14.8679 25.0039 18.0844 21.7824 22.7755 19.2888C23.866 18.7102 24.3177 17.3829 23.8026 16.2624L22.5062 13.4418C21.9503 12.2312 20.4901 11.7343 19.3116 12.3557C14.7897 14.7286 11.6797 17.428 9.39291 20.9182C6.32372 25.6012 4.89834 31.7152 5.03608 39.6067L5.0956 43.0167C5.21072 49.6118 5.3266 54.9495 17.2763 54.7409C29.2486 54.5319 29.1551 49.1712 29.0397 42.5595C28.9243 35.9479 28.9091 30.5858 16.8583 30.7962ZM48.2342 30.2485C46.9915 30.2702 45.8779 30.3474 44.8828 30.4742C46.2438 24.4563 49.4603 21.2347 54.1514 18.7411C55.2419 18.1625 55.6936 16.8352 55.1785 15.7148L53.8821 12.8941C53.3262 11.6835 51.8659 11.1866 50.6874 11.808C46.1656 14.181 43.0556 16.8803 40.7688 20.3706C37.6996 25.0535 36.2742 31.1676 36.4119 39.059L36.4715 42.4691C36.5866 49.0642 36.7025 54.4018 48.6521 54.1932C60.6245 53.9842 60.5309 48.6235 60.4155 42.0119C60.3001 35.4002 60.285 30.0381 48.2342 30.2485Z"
								fill="currentColor"
							/>
						</svg> */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							width={44}
							height={44}
							aria-hidden="true"
							className="text-muted-foreground/40 dark:text-muted-foreground/70"
						>
							<path
								fill="currentColor"
								d="M30.632 33.25c4.345 0 7.868-3.526 7.868-7.875 0-4.35-3.523-7.875-7.868-7.875-1.085 0-2.12.22-3.06.618.187-.343.39-.666.608-.974 1.374-1.945 3.406-3.427 6.044-5.188a1.751 1.751 0 0 0 .485-2.427 1.747 1.747 0 0 0-2.424-.485c-2.606 1.74-5.164 3.538-6.96 6.078-1.845 2.611-2.787 5.85-2.56 10.301.026 4.327 3.538 7.827 7.867 7.827ZM11.4 33.25c4.346 0 7.868-3.526 7.868-7.875 0-4.35-3.522-7.875-7.867-7.875-1.086 0-2.12.22-3.061.618.187-.343.391-.666.609-.974 1.374-1.945 3.405-3.427 6.044-5.188a1.751 1.751 0 0 0 .485-2.427 1.747 1.747 0 0 0-2.425-.485c-2.606 1.74-5.164 3.538-6.959 6.078-1.845 2.611-2.788 5.85-2.56 10.301.025 4.327 3.538 7.827 7.867 7.827Z"
							/>
						</svg>
						<p className="mt-5 text-base text-muted-foreground leading-relaxed md:mt-5 md:mb-6 md:text-lg">
							Hi, I'm Dmytro. I grew up in Ukraine where learning English felt
							like an impossible mountain to climb. Traditional classes were
							boring, textbooks were outdated, and apps felt more like games
							than real learning tools.{" "}
							<span className="rounded-sm bg-[#D8FF76]/50 px-1 font-medium text-lime-700">
								the best way to learn a language is by actually using it.
							</span>{" "}
							Not by memorizing vocabulary lists or completing gamified lessons
							that give you points but don't prepare you for real-world
							conversations.
						</p>
						<div className="flex items-center gap-6">
							<p className="flex flex-col gap-1 font-medium text-sm md:text-base">
								<span className="flex items-center gap-2 font-medium">
									Dmytro Tihunov{" "}
									<a
										href="https://x.com/tihunov"
										target="_blank"
										rel="noopener"
										aria-label="X (Twitter)"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="size-4.5"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fill="currentColor"
												d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
											/>
										</svg>
									</a>
								</span>
								<span className="hidden text-muted-foreground text-sm md:inline">
									Founder, English Now
								</span>
							</p>
						</div>
					</div>
				</div>
				<div className="relative flex w-full flex-col justify-between gap-4">
					<div className="relative size-full overflow-hidden rounded-3xl">
						<img
							alt="Dmytro Tihunov, Founder, English Now"
							className="absolute inset-0 aspect-4/3 h-full object-cover saturate-0 dark:brightness-[0.9]"
							src="https://files.helploom.com/hl/images/clients/joanna-shruti-sundharam-at-wisdomcircle.webp"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
