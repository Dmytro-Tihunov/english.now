import { Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { CoursesIcon } from "../icons/courses";
import { GrammarIcon } from "../icons/grammar";
import { SpeakingIcon } from "../icons/speaking";
import { VocabularyIcon } from "../icons/vocabulary";

// AI Chat Demo Component
// function _AIChatDemo() {
//   const [messages, setMessages] = useState<
//     { role: "user" | "ai"; text: string; typing?: boolean }[]
//   >([]);

//   const conversation = [
//     { role: "user" as const, text: "How do I use 'would have'?" },
//     {
//       role: "ai" as const,
//       text: "Great question! 'Would have' expresses unreal past situations. For example: 'I would have called if I had known.'",
//     },
//   ];

//   useEffect(() => {
//     const timers: NodeJS.Timeout[] = [];

//     const runConversation = () => {
//       setMessages([]);

//       // User message
//       timers.push(
//         setTimeout(() => {
//           setMessages([conversation[0]]);
//         }, 800)
//       );

//       // AI typing indicator
//       timers.push(
//         setTimeout(() => {
//           setMessages([
//             conversation[0],
//             { role: "ai", text: "", typing: true },
//           ]);
//         }, 1500)
//       );

//       // AI response
//       timers.push(
//         setTimeout(() => {
//           setMessages([conversation[0], conversation[1]]);
//         }, 2800)
//       );
//     };

//     runConversation();
//     const interval = setInterval(runConversation, 7000);

//     return () => {
//       timers.forEach(clearTimeout);
//       clearInterval(interval);
//     };
//   }, [conversation[1], conversation[0]]);

//   return (
//     <div className="flex h-full flex-col">
//       <div className="flex flex-1 flex-col gap-2.5 overflow-hidden">
//         {messages.map((msg) => (
//           <div
//             key={`${msg.role}-${msg.text.slice(0, 10)}`}
//             className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm transition-all duration-300 ${
//                 msg.role === "user"
//                   ? "bg-foreground text-background"
//                   : "bg-muted text-foreground"
//               }`}
//               style={{
//                 animation: "fadeSlideIn 0.3s ease-out",
//               }}
//             >
//               {msg.typing ? (
//                 <div className="flex gap-1 py-1">
//                   <span className="size-1.5 animate-bounce rounded-full bg-current opacity-60" />
//                   <span
//                     className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
//                     style={{ animationDelay: "0.1s" }}
//                   />
//                   <span
//                     className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
//                     style={{ animationDelay: "0.2s" }}
//                   />
//                 </div>
//               ) : (
//                 msg.text
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// Speaking Wave Animation
const WAVE_IDS = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"] as const;

function SpeakingDemo() {
	const [isActive, setIsActive] = useState(false);
	const [waves, setWaves] = useState<number[]>(Array(8).fill(0.3));

	useEffect(() => {
		const cycle = () => {
			setIsActive(true);
			const waveInterval = setInterval(() => {
				setWaves(
					Array(8)
						.fill(0)
						.map(() => 0.2 + Math.random() * 0.8),
				);
			}, 80);

			setTimeout(() => {
				clearInterval(waveInterval);
				setWaves(Array(8).fill(0.3));
				setIsActive(false);
			}, 2500);
		};

		cycle();
		const interval = setInterval(cycle, 4500);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative z-10 flex h-full flex-col items-center justify-center rounded-xl border bg-white shadow-xl">
			<div className="mb-4 text-center">
				<div className="font-bold font-lyon text-lg">"Entrepreneur"</div>
				<div className="text-muted-foreground text-xs">/ˌɒntrəprəˈnɜːr/</div>
			</div>

			<div className="flex h-12 items-center justify-center gap-1">
				{waves.map((amp, i) => (
					<div
						key={WAVE_IDS[i]}
						className="w-1.5 rounded-full transition-all duration-100"
						style={{
							height: `${amp * 100}%`,
							backgroundColor: isActive
								? "#C6F64D"
								: "var(--color-muted-foreground)",
							opacity: isActive ? 1 : 0.3,
						}}
					/>
				))}
			</div>

			<div className="mt-4 flex items-center gap-2">
				<div
					className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
						isActive ? "bg-[#C6F64D] shadow-[#C6F64D]/30 shadow-lg" : "bg-muted"
					}`}
				>
					<Mic
						className={`size-5 transition-colors ${isActive ? "text-black" : "text-muted-foreground"}`}
					/>
				</div>
			</div>

			{isActive && (
				<div className="fade-in mt-3 animate-in text-muted-foreground text-xs">
					Listening...
				</div>
			)}
		</div>
	);
}

// Vocabulary Progress Demo
function VocabularyDemo() {
	const words = [
		{ word: "Resilient", learned: true },
		{ word: "Ephemeral", learned: true },
		{ word: "Ubiquitous", learned: true },
		{ word: "Eloquent", learned: false },
	];

	return (
		<div className="relative z-10 flex h-full flex-col rounded-xl border bg-white p-4 shadow-xl">
			<div className="mb-3 flex items-center justify-between">
				<span className="font-medium text-sm">Today's Words</span>
				<span className="text-muted-foreground text-xs">3/5 learned</span>
			</div>

			<div className="flex flex-col gap-2">
				{words.map((w, i) => (
					<div
						key={w.word}
						className={`flex items-center justify-between rounded-xl px-3 py-2 transition-all duration-300 ${
							w.learned ? "bg-[#F5FFE0] dark:bg-[#C6F64D]/10" : "bg-muted/50"
						}`}
						style={{
							animationDelay: `${i * 100}ms`,
						}}
					>
						<span
							className={`text-sm ${w.learned ? "text-[#5A7D00] dark:text-[#C6F64D]" : "text-muted-foreground"}`}
						>
							{w.word}
						</span>
						{w.learned && (
							<svg
								className="size-4 text-[#7CB518]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<title>Learned</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2.5}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

// Course Progress Demo
function CoursesDemo() {
	const courses = [
		{
			name: "Business English",
			progress: 72,
			color: "from-[#B13781] to-[#B13781]",
		},
		{
			name: "Grammar Mastery",
			progress: 45,
			color: "from-[#0D4B6C] to-[#0D4B6C]",
		},
		{
			name: "Daily Conversations",
			progress: 88,
			color: "from-[#594700] to-[#594700]",
		},
	];

	return (
		<div className="relative z-10 flex h-full flex-col rounded-xl border bg-white p-4 shadow-xl">
			<div className="mb-3 flex items-center justify-between">
				<span className="font-medium text-sm">Your Courses</span>
				<span className="text-muted-foreground text-xs">3 active</span>
			</div>

			<div className="flex flex-col gap-3">
				{courses.map((course) => (
					<div key={course.name} className="group">
						<div className="mb-1.5 flex items-center justify-between">
							<span className="text-sm">{course.name}</span>
							<span className="text-muted-foreground text-xs">
								{course.progress}%
							</span>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-muted">
							<div
								className={`h-full rounded-full bg-linear-to-r transition-all duration-500 ${course.color}`}
								style={{ width: `${course.progress}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Grammar Quiz Demo
function GrammarDemo() {
	const [selected, setSelected] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);

	useEffect(() => {
		const cycle = () => {
			setSelected(null);
			setShowResult(false);

			setTimeout(() => {
				setSelected(1);
			}, 1200);

			setTimeout(() => {
				setShowResult(true);
			}, 1800);
		};

		cycle();
		const interval = setInterval(cycle, 5000);
		return () => clearInterval(interval);
	}, []);

	const options = ["has been", "had been", "have been", "was being"];

	return (
		<div className="relative z-10 flex h-full flex-col rounded-xl border bg-white p-4 shadow-xl">
			<div className="mb-3 rounded-lg bg-muted/50 p-2.5">
				<span className="text-muted-foreground text-xs">
					Fill in the blank:
				</span>
				<p className="mt-1 text-sm">
					She <span className="font-semibold text-[#7CB518]">___</span> waiting
					for two hours when he arrived.
				</p>
			</div>

			<div className="grid grid-cols-2 gap-2">
				{options.map((opt, i) => (
					<button
						key={opt}
						type="button"
						className={`rounded-xl border px-3 py-2 text-left text-sm transition-all duration-200 ${
							selected === i
								? showResult
									? i === 1
										? "border-[#7CB518] bg-[#F5FFE0] text-[#5A7D00] dark:bg-[#C6F64D]/10 dark:text-[#C6F64D]"
										: "border-red-300 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
									: "border-foreground/20 bg-foreground/5"
								: "border-border hover:border-foreground/20"
						}`}
					>
						{opt}
					</button>
				))}
			</div>

			<div className="h-10">
				{showResult && selected === 1 && (
					<div className="fade-in mt-3 animate-in text-[#7CB518] text-xs">
						✓ Correct! Past perfect continuous.
					</div>
				)}
			</div>
		</div>
	);
}

export function Features() {
	const _features = [
		{
			id: "courses",
			icon: CoursesIcon,
			title: "Courses",
			description: "Follow curated learning paths from beginner to advanced",
			demo: CoursesDemo,
		},
		{
			id: "grammar",
			icon: GrammarIcon,
			title: "Grammar",
			description:
				"Master rules with interactive exercises and instant feedback",
			demo: GrammarDemo,
		},
		{
			id: "vocabulary",
			icon: VocabularyIcon,
			title: "Vocabulary",
			description: "Expand your word power with spaced repetition",
			demo: VocabularyDemo,
		},
		{
			id: "speaking",
			icon: SpeakingIcon,
			title: "Speaking",
			description: "Perfect your pronunciation with AI-powered feedback",
			demo: SpeakingDemo,
		},
	];

	return (
		<div className="relative mx-auto mt-24">
			{/* <svg
        className="-top-28 absolute right-0 left-0 mx-auto w-14"
        viewBox="0 0 30 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M19.6444 50.6933C19.8559 51.2035 20.4409 51.4456 20.9511 51.2342L29.2651 47.7877C29.7753 47.5762 30.0174 46.9912 29.8059 46.481C29.5944 45.9708 29.0094 45.7287 28.4992 45.9402L21.109 49.0037L18.0455 41.6135C17.834 41.1033 17.249 40.8612 16.7388 41.0726C16.2286 41.2841 15.9865 41.8692 16.198 42.3794L19.6444 50.6933ZM1.30404 23.5419L0.348997 23.8384L1.30404 23.5419ZM20.5803 0.445423C20.2739 -0.0141062 19.6531 -0.138281 19.1935 0.168071C18.734 0.474423 18.6098 1.09529 18.9162 1.55482L19.7482 1.00012L20.5803 0.445423ZM12.3558 13.5629L12.1726 14.546C13.7242 14.8351 15.4244 16.0462 17.017 18.1557C18.5941 20.2446 19.983 23.1101 20.9403 26.4777C22.8553 33.214 23.0029 41.8129 19.6442 49.928L20.5682 50.3104L21.4922 50.6928C25.0461 42.1062 24.8848 33.039 22.8641 25.9308C21.8536 22.3762 20.368 19.2749 18.6132 16.9506C16.8739 14.6468 14.7848 12.9984 12.539 12.5798L12.3558 13.5629ZM12.3558 13.5629L12.539 12.5798C4.34748 11.0532 -1.52017 17.8172 0.348997 23.8384L1.30404 23.5419L2.25908 23.2454C0.919819 18.9312 5.17494 13.2419 12.1726 14.546L12.3558 13.5629ZM1.30404 23.5419L0.348997 23.8384C1.41524 27.2731 4.78137 29.8174 8.5732 30.4981C12.4262 31.1899 16.8186 29.9881 19.9993 25.8436L19.206 25.2347L18.4127 24.6259C15.7147 28.1415 12.0887 29.0973 8.92662 28.5296C5.70343 27.9509 3.05793 25.8188 2.25908 23.2454L1.30404 23.5419ZM19.206 25.2347L19.9993 25.8436C26.1804 17.7894 25.2321 7.42321 20.5803 0.445423L19.7482 1.00012L18.9162 1.55482C23.1741 7.94177 23.9889 17.3599 18.4127 24.6259L19.206 25.2347Z"
          fill="currentColor"
          className="opacity-10"
        />
      </svg> */}
			<h1 className="mb-10 text-center font-bold font-lyon text-3xl tracking-tight md:text-5xl">
				English learning is broken.
				<br />
				<span className="">Speaking </span> stress 😫 Grammar overload 🤷‍♀️{" "}
				<br />
				Missed opportunities⌛ Vocabulary traps 🪤
			</h1>
			{/* <p className="text-center text-muted-foreground">
        We're here to help you learn English better and easier.
      </p> */}

			<div className="grid gap-6 sm:grid-cols-2">
				{_features.map((feature, _i) => (
					<div
						key={feature.id}
						className="relative overflow-hidden rounded-3xl border bg-white p-6 text-sm"
					>
						{/* <div
              className="pointer-events-none absolute right-0 bottom-0 left-0"
              style={{
                height: "200px",
                backgroundImage:
                  "linear-gradient(to top, #C6F64D 0%, #FFFFFF 100%)",
              }}
            /> */}
						<div
							className="pointer-events-none absolute inset-0 rounded-3xl"
							style={{
								boxShadow:
									"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
							}}
						/>
						<div className="mb-4">
							<feature.icon />
							<h2 className="mt-2 font-bold font-lyon text-2xl">
								{feature.title}
							</h2>
						</div>
						<feature.demo />
					</div>
				))}
				{/* <div className="col-span-2 rounded-3xl border bg-[#FAFAFA] p-6 text-sm dark:bg-secondary_dark">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1690_397)">
              <path
                d="M17.049 1.3275C17.491 -0.4425 20.008 -0.4425 20.451 1.3275L20.655 2.1435C20.7276 2.43345 20.8775 2.69825 21.0889 2.9096C21.3003 3.12095 21.565 3.27093 21.855 3.3435L22.671 3.5485C24.442 3.9915 24.442 6.5085 22.671 6.9505L21.855 7.1555C21.609 7.2165 21.385 7.3335 21.197 7.4915C22.055 9.11115 22.5024 10.9166 22.5 12.7495C22.5 18.9625 17.463 23.9995 11.25 23.9995C5.037 23.9995 0 18.9625 0 12.7495C0 6.5365 5.037 1.4995 11.25 1.4995C13.15 1.4995 14.939 1.9705 16.508 2.8025C16.666 2.6145 16.782 2.3905 16.844 2.1435L17.049 1.3275Z"
                fill="black"
              />
              <path
                d="M10.4966 7.44696C10.1732 7.91776 9.80265 8.37664 8.92632 9.36591C7.86767 10.5638 7.43245 11.2849 7.30306 12.0298L7.23248 12.435L7.07956 12.1311C6.99723 11.9583 6.77373 11.6603 6.57965 11.4636C6.16795 11.0286 6.20324 11.0048 5.80919 11.9523C4.89757 14.1454 4.74466 16.4756 5.40925 18.1561C6.17383 20.093 7.70887 21.3981 9.83205 21.9225C10.032 21.9702 10.4966 22 11.0377 22C11.8082 21.994 11.9905 21.9762 12.5081 21.8331C14.7548 21.2074 16.4016 19.4672 16.9015 17.1847C17.0015 16.708 17.0132 16.4934 16.9897 15.5936C16.9426 14.0262 16.6545 12.8403 15.9487 11.3862C15.6017 10.6591 14.8489 9.4553 14.4607 9.00834L14.2607 8.77592L14.002 8.94875C13.5726 9.2348 13.0727 9.78308 12.9021 10.1526L12.7433 10.4982L12.7081 10.1108C12.661 9.65793 12.5904 9.44339 12.3199 8.95471C12.1317 8.62098 11.5612 7.87008 11.026 7.26222L10.8025 7L10.4966 7.44696ZM8.51462 16.4934C9.14393 16.8629 9.65561 17.1788 9.65561 17.2026C9.65561 17.2265 9.57915 17.3516 9.48505 17.4827C9.2792 17.7747 8.99102 17.9178 8.61461 17.9178C8.09116 17.9118 7.69711 17.6377 7.40892 17.0596C7.23248 16.708 7.17955 15.8319 7.33835 15.8319C7.36187 15.8319 7.8912 16.1299 8.51462 16.4934ZM14.7607 16.2133C14.8195 17.3754 13.8138 18.2515 12.9198 17.8224C12.7316 17.733 12.361 17.3218 12.361 17.2026C12.361 17.143 14.6195 15.8319 14.6842 15.8498C14.7195 15.8617 14.7489 16.0226 14.7607 16.2133Z"
                fill="#DCFF6F"
              />
              <path
                d="M11.25 3C12.039 3 12.806 3.094 13.54 3.271C13.921 3.363 13.966 3.981 13.763 4.315C13.743 4.348 13.725 4.381 13.707 4.415C13.597 4.628 13.361 4.771 13.127 4.716C11.3807 4.30806 9.54907 4.48023 7.9094 5.20644C6.26972 5.93265 4.91132 7.17334 4.03988 8.74067C3.16843 10.308 2.83141 12.1166 3.07984 13.8926C3.32826 15.6686 4.14861 17.3153 5.41666 18.5833C6.68471 19.8514 8.33141 20.6717 10.1074 20.9202C11.8834 21.1686 13.692 20.8316 15.2593 19.9601C16.8267 19.0887 18.0674 17.7303 18.7936 16.0906C19.5198 14.4509 19.6919 12.6193 19.284 10.873C19.229 10.639 19.372 10.403 19.585 10.293C19.619 10.2755 19.6523 10.2568 19.685 10.237C20.019 10.033 20.635 10.077 20.728 10.458C20.905 11.193 21 11.96 21 12.75C21 18.135 16.635 22.5 11.25 22.5C5.865 22.5 1.5 18.135 1.5 12.75C1.5 7.365 5.865 3 11.25 3Z"
                fill="#DCFF6F"
              />
              <path
                d="M18.3957 8.83467C18.4877 9.20267 19.0117 9.20267 19.1037 8.83467L19.3077 8.01867C19.4412 7.4845 19.7173 6.99664 20.1066 6.60722C20.4958 6.21779 20.9836 5.94144 21.5177 5.80767L22.3347 5.60367C22.7027 5.51167 22.7027 4.98767 22.3347 4.89567L21.5187 4.69167C20.9845 4.55815 20.4966 4.28201 20.1072 3.89277C19.7178 3.50352 19.4414 3.01578 19.3077 2.48167L19.1037 1.66467C19.0117 1.29667 18.4877 1.29667 18.3957 1.66467L18.1917 2.48067C18.0581 3.01497 17.7818 3.50291 17.3923 3.89235C17.0029 4.28178 16.515 4.55807 15.9807 4.69167L15.1647 4.89567C14.7967 4.98767 14.7967 5.51167 15.1647 5.60367L15.9807 5.80767C16.5148 5.94119 17.0027 6.21733 17.3921 6.60658C17.7816 6.99583 18.0579 7.48356 18.1917 8.01767L18.3957 8.83467Z"
                fill="#DCFF6F"
              />
            </g>
            <defs>
              <clipPath id="clip0_1690_397">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h2 className="mt-2 mb-2 flex items-center gap-2 font-bold font-lyon text-2xl">
            AI Chat<Badge>beta</Badge>
          </h2>
          <p className="text-muted-foreground">
            Chat with our AI assistant to get help with your English learning.
          </p>
          <div className="w-full max-w-xl rounded-3xl border border-border bg-background">
            <div className="p-3 px-4 text-lg text-muted-foreground">
              What are you thinking?
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 items-center justify-center rounded-full bg-muted px-5">
                  <svg
                    width="828"
                    height="686"
                    viewBox="0 0 828 686"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path
                      d="M293.093 0.414062L242.713 101.174H71.4198C32.3465 101.174 0.88916 132.633 0.88916 171.705V615.065C0.88916 654.138 32.3478 685.595 71.4198 685.595H756.607C795.68 685.595 827.137 654.137 827.137 615.065V171.705C827.137 132.626 795.679 101.174 756.607 101.174H585.313L534.933 0.414062H293.093ZM414.011 212.014C514.183 212.014 595.384 293.217 595.384 393.387C595.384 493.558 514.181 574.761 414.011 574.761C313.84 574.761 232.637 493.558 232.637 393.387C232.637 293.217 313.84 212.014 414.011 212.014Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 items-center justify-center rounded-full bg-muted px-5">
                  <svg
                    width="1321"
                    height="1034"
                    viewBox="0 0 1321 1034"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="size-6"
                  >
                    <path
                      d="M658.627 0.453125C711.121 0.453125 753.679 43.0051 753.679 95.4998V938.527C753.679 991.021 711.121 1033.57 658.627 1033.57C606.132 1033.57 563.58 991.021 563.58 938.527V95.4998C563.58 43.0051 606.132 0.453125 658.627 0.453125Z"
                      fill="currentColor"
                    />
                    <path
                      d="M95.9065 328.934C148.401 328.934 190.953 371.491 190.953 423.986V610.039C190.953 662.534 148.401 705.086 95.9065 705.086C43.4118 705.086 0.854492 662.534 0.854492 610.039V423.986C0.854492 371.491 43.4118 328.934 95.9065 328.934Z"
                      fill="currentColor"
                    />
                    <path
                      d="M1321 423.974C1321 371.479 1278.45 328.922 1225.95 328.922C1173.46 328.922 1130.9 371.479 1130.9 423.974V610.027C1130.9 662.522 1173.46 705.074 1225.95 705.074C1278.45 705.074 1321 662.522 1321 610.027V423.974Z"
                      fill="currentColor"
                    />
                    <path
                      d="M942.28 200.293C994.78 200.293 1037.33 242.85 1037.33 295.345V738.652C1037.33 791.146 994.78 833.704 942.28 833.704C889.791 833.704 847.233 791.146 847.233 738.652V295.345C847.233 242.85 889.791 200.293 942.28 200.293Z"
                      fill="currentColor"
                    />
                    <path
                      d="M472.307 295.347C472.307 242.852 429.749 200.295 377.26 200.295C324.76 200.295 282.208 242.852 282.208 295.347V738.654C282.208 791.148 324.76 833.706 377.26 833.706C429.749 833.706 472.307 791.148 472.307 738.654V295.347Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-down"
                  >
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 animate-pulse rounded-3xl bg-black/10 px-4 py-1.5 font-mono text-sm">
            gpt-5 is out! should we switch you to it?
          </div>
          <div className="w-full max-w-2xl rounded-t-3xl border border-black/20 border-b-0 border-dashed p-3 px-4">
            <div className="flex">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full" />
                  Nova is working
                </div>
                <div className="flex flex-col gap-2 text-lg text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check size-4 stroke-3 text-white"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      Nova is scanning{" "}
                      <span className="inline-flex items-center gap-1 rounded-xl bg-white px-1.5 py-0.1 text-foreground shadow-xs">
                        <span>132</span>recent entries
                      </span>{" "}
                      to understand your context and checking{" "}
                      <span className="inline-flex items-center gap-1 rounded-xl bg-black/10 px-1.5 py-0.1 text-foreground">
                        <span>8</span> lists
                      </span>{" "}
                      for relevant topics.
                      <div className="mt-2 mb-2 max-w-md text-sm opacity-65">
                        Found mentions of ChatGPT in your vault for additional
                        context. Distill is using AI to analyze patterns and
                        suggest relevant connectio_AI.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check size-4 stroke-3 text-white"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    Added entry to{" "}
                    <span className="inline-flex items-center gap-1 rounded-xl bg-purple-500 px-1.5 py-0.1 text-white shadow-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-list"
                      >
                        <path d="M3 12h.01" />
                        <path d="M3 18h.01" />
                        <path d="M3 6h.01" />
                        <path d="M8 12h13" />
                        <path d="M8 18h13" />
                        <path d="M8 6h13" />
                      </svg>{" "}
                      ideas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-loader-circle animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Searching the web for{" "}
                    <span className="inline-flex items-center gap-1 rounded-xl bg-white px-1.5 py-0.1 text-blue-600 shadow-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-search size-5"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>{" "}
                      openai gpt-5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
			</div>
		</div>
	);
}
