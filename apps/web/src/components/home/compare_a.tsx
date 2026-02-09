import { Check, X } from "lucide-react";

const comparisons = [
	{ feature: "AI tutor that adapts to your level", us: true, them: false },
	{ feature: "Speaking practice with instant feedback", us: true, them: false },
	{
		feature: "Grammar, vocabulary & fluency in one place",
		us: true,
		them: false,
	},
	{ feature: "Real conversations, not just flashcards", us: true, them: false },
	{ feature: "Progress that transfers to real life", us: true, them: false },
	{ feature: "No endless streak anxiety", us: true, them: false },
	{ feature: "Built for adults, not gamified for kids", us: true, them: false },
];

export function Compare() {
	return (
		<div className="group mx-auto sm:mt-24">
			<div className="mb-10 text-center">
				<h2 className="mb-4 font-bold font-lyon text-4xl tracking-tight md:text-5xl">
					Why does this beat Duolingo
					<br className="hidden md:block" />
					and other language apps?
				</h2>
				<p className="text-balance text-center text-muted-foreground text-sm md:mx-auto md:max-w-boundary-sm md:text-lg">
					Ok but... other english learning apps?
				</p>
			</div>

			<div className="overflow-hidden">
				<div className="mb-2 grid grid-cols-[1fr_140px_140px] items-center px-6 pb-4">
					<div />
					<div className="mx-auto">
						<div className="relative size-8 overflow-hidden rounded-[0.8rem] border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]">
							<img
								className="absolute bottom-[-5px] h-full w-full object-contain"
								src="/logo.svg"
								alt="English Now Logo"
								width={62}
								height={62}
							/>
						</div>
					</div>
					<div className="text-center text-muted-foreground">Other Apps</div>
				</div>
				<div className="flex flex-col gap-1">
					{comparisons.map((row, i) => (
						<div
							key={row.feature}
							className={`grid grid-cols-[1fr_140px_140px] items-center rounded-xl px-6 py-4 ${
								i % 2 === 0 ? "bg-neutral-100" : "bg-white"
							}`}
						>
							<span className="font-medium">{row.feature}</span>
							<div className="flex justify-center">
								{row.us ? (
									<div className="flex items-center justify-center rounded-full border border-lime-300 bg-lime-200 p-1 text-lime-600">
										<Check className="size-3.5" strokeWidth={2} />
									</div>
								) : (
									//   <svg
									//     width="20"
									//     height="20"
									//     viewBox="0 0 20 20"
									//     fill="none"
									//     aria-hidden="true"
									//     xmlns="http://www.w3.org/2000/svg"
									//   >
									//     <rect
									//       x="1"
									//       y="1"
									//       width="18"
									//       height="18"
									//       rx="9"
									//       fill="rgb(var(--gray-00))"
									//     />
									//     <path
									//       d="M8.4773 2.80234C9.21702 1.73255 10.7828 1.73255 11.5225 2.80234C11.9706 3.45043 12.7717 3.74544 13.5267 3.54042C14.773 3.20199 15.9725 4.22029 15.8595 5.52087C15.791 6.30877 16.2173 7.05577 16.9259 7.38975C18.0957 7.94104 18.3675 9.50115 17.4547 10.424C16.9017 10.983 16.7537 11.8325 17.0844 12.5492C17.6302 13.7322 16.8473 15.1042 15.5618 15.2174C14.783 15.286 14.1299 15.8405 13.9279 16.6046C13.5944 17.8658 12.1231 18.4076 11.0663 17.6583C10.4262 17.2044 9.57363 17.2044 8.93345 17.6583C7.87671 18.4076 6.40539 17.8658 6.07192 16.6046C5.86989 15.8405 5.21682 15.286 4.43803 15.2174C3.15249 15.1042 2.36961 13.7322 2.91544 12.5492C3.24611 11.8325 3.09807 10.983 2.54507 10.424C1.63224 9.50115 1.90413 7.94104 3.07386 7.38975C3.78249 7.05577 4.20875 6.30877 4.1403 5.52087C4.02731 4.22029 5.22675 3.20199 6.47304 3.54042C7.22807 3.74544 8.02918 3.45043 8.4773 2.80234Z"
									//       fill="url(#1767477303125)"
									//     ></path>
									//     <path
									//       d="M6.66667 10.254L8.66667 12.1112L13.3333 7.77783"
									//       stroke="#fff"
									//       stroke-width="1.2"
									//       stroke-linecap="round"
									//       stroke-linejoin="round"
									//     />
									//     <rect
									//       x="1"
									//       y="1"
									//       width="18"
									//       height="18"
									//       rx="9"
									//       stroke="rgb(var(--gray-00))"
									//       stroke-width="2"
									//     />
									//     <defs>
									//       <linearGradient
									//         id="1767477303125"
									//         x1="9.9999"
									//         y1="2"
									//         x2="9.9999"
									//         y2="18"
									//         gradientUnits="userSpaceOnUse"
									//       >
									//         <stop stop-color="#27AE60" />
									//         <stop offset="1" stop-color="#1E874B" />
									//       </linearGradient>
									//     </defs>
									//   </svg>
									<div className="flex items-center justify-center rounded-full border border-rose-300 bg-rose-200 p-1 text-rose-600">
										<X className="size-3.5" strokeWidth={2} />
									</div>
								)}
							</div>
							<div className="flex justify-center">
								{row.them ? (
									<Check className="size-6 text-[#00A63E]" strokeWidth={2.5} />
								) : (
									<div className="flex items-center justify-center rounded-full border border-rose-300 bg-rose-200 p-1 text-rose-600">
										<X className="size-3.5" strokeWidth={2} />
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
