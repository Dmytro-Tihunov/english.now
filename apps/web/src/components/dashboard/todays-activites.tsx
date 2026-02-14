import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ActivityType = "chat" | "readAloud" | "speak";

interface Activity {
	id: number;
	emoji: string;
	title: string;
	duration: number;
	type: ActivityType;
	typeLabel: string;
}

// Pool of activities — rotated daily for a personalized feel
const activityPool: Activity[] = [
	{
		id: 1,
		emoji: "📱",
		title: "Describe Your Favorite Social App",
		duration: 1,
		type: "chat",
		typeLabel: "Chat",
	},
	{
		id: 2,
		emoji: "🤔",
		title: "Common Causes of Miscommunication",
		duration: 4,
		type: "readAloud",
		typeLabel: "Read Aloud",
	},
	{
		id: 3,
		emoji: "🔄",
		title: "Talk About a Big Life Shift",
		duration: 5,
		type: "speak",
		typeLabel: "Speak",
	},
	{
		id: 4,
		emoji: "👓",
		title: "Help Choose New Glasses",
		duration: 4,
		type: "chat",
		typeLabel: "Chat",
	},
	{
		id: 5,
		emoji: "🏛️",
		title: "How Elections Shape Our Lives",
		duration: 2,
		type: "readAloud",
		typeLabel: "Read Aloud",
	},
	{
		id: 6,
		emoji: "⚡",
		title: "Explain Why Passwords Matter",
		duration: 3,
		type: "speak",
		typeLabel: "Speak",
	},
	{
		id: 7,
		emoji: "🐕",
		title: "Share a Memorable Dog Story",
		duration: 3,
		type: "chat",
		typeLabel: "Chat",
	},
	{
		id: 8,
		emoji: "🌍",
		title: "How Music Connects Us",
		duration: 1,
		type: "readAloud",
		typeLabel: "Read Aloud",
	},
	{
		id: 9,
		emoji: "😅",
		title: "Describe an Awkward Mix-up",
		duration: 1,
		type: "speak",
		typeLabel: "Speak",
	},
	{
		id: 10,
		emoji: "🎬",
		title: "Review Your Favorite Movie",
		duration: 3,
		type: "chat",
		typeLabel: "Chat",
	},
	{
		id: 11,
		emoji: "🍳",
		title: "Explain a Recipe Step by Step",
		duration: 4,
		type: "readAloud",
		typeLabel: "Read Aloud",
	},
	{
		id: 12,
		emoji: "🚀",
		title: "Pitch a Startup Idea",
		duration: 5,
		type: "speak",
		typeLabel: "Speak",
	},
	{
		id: 13,
		emoji: "🎵",
		title: "Describe a Song That Moves You",
		duration: 2,
		type: "chat",
		typeLabel: "Chat",
	},
	{
		id: 14,
		emoji: "📖",
		title: "Summarize a News Article",
		duration: 3,
		type: "readAloud",
		typeLabel: "Read Aloud",
	},
	{
		id: 15,
		emoji: "🏔️",
		title: "Talk About a Dream Destination",
		duration: 2,
		type: "speak",
		typeLabel: "Speak",
	},
	{
		id: 16,
		emoji: "💡",
		title: "Explain a Concept You Love",
		duration: 3,
		type: "chat",
		typeLabel: "Chat",
	},
	{
		id: 17,
		emoji: "🎭",
		title: "Act Out a Dialogue Scene",
		duration: 4,
		type: "readAloud",
		typeLabel: "Read Aloud",
	},
	{
		id: 18,
		emoji: "🌱",
		title: "Share Your Morning Routine",
		duration: 2,
		type: "speak",
		typeLabel: "Speak",
	},
];

export default function TodaysActivities() {
	/** Deterministic daily shuffle — same activities every time you reload on a given day */
	function getDailyActivities(count = 9): Activity[] {
		const today = new Date();
		const seed =
			today.getFullYear() * 10000 +
			(today.getMonth() + 1) * 100 +
			today.getDate();

		const shuffled = [...activityPool];
		let m = shuffled.length;
		let s = seed;
		while (m) {
			s = (s * 1103515245 + 12345) & 0x7fffffff;
			const i = s % m--;
			[shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
		}

		return shuffled.slice(0, count);
	}

	const dailyActivities = getDailyActivities(9);

	return (
		<div
			className="relative overflow-hidden rounded-3xl bg-white p-2.5"
			// style={{
			// 	boxShadow:
			// 		"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
			// }}
			style={{
				boxShadow:
					"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
			}}
		>
			<div className="mt-1 mb-3 flex items-center justify-between gap-2 px-2 font-medium">
				<div className="flex w-full items-center justify-between gap-2">
					<h1 className="font-bold font-lyon text-xl">Today's Activities</h1>
					{/* <Button
									type="button"
									variant="outline"
									className="group flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-xl border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] px-2.5 py-1.5 font-medium text-lime-900 text-sm italic shadow-none transition duration-150 ease-in-out will-change-transform hover:bg-lime-700/10 hover:brightness-95 focus:shadow-none focus:outline-none focus-visible:shadow-none"
								>
									Practice
									<span className="-top-px relative font-lyon text-lg text-lime-900/80 italic group-hover:text-lime-900">
										all
									</span>
								</Button> */}
				</div>
			</div>

			{/* Personalized Daily Activities */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{dailyActivities.map((activity) => (
					<button
						key={activity.id}
						type="button"
						className={cn(
							"group hover:-translate-y-0.5 relative flex min-h-48 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-white p-4 text-left transition-all hover:shadow-md",
						)}
					>
						<div>
							<Badge
								variant="outline"
								className="mb-4 rounded-lg border-neutral-200 bg-white px-2 py-0.5 font-normal text-xs"
							>
								{activity.duration}{" "}
								{activity.duration === 1 ? "minute" : "minutes"}
							</Badge>
							<div className="mb-2 text-2xl xl:text-4xl">{activity.emoji}</div>
							<h3 className="mb-3 font-semibold text-sm leading-snug">
								{activity.title}
							</h3>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex justify-end">
								<span
									className={cn(
										"rounded-lg border px-4 py-1.5 font-medium text-xs",
									)}
								>
									{activity.typeLabel}
								</span>
							</div>
							<ArrowRightIcon
								className="size-4"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							/>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
