import { FlameIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface StreakProps {
	currentStreak: number;
	longestStreak: number;
	lastActivityAt: Date | null;
}

const WEEK_DAYS = [
	{ key: "mon", label: "M" },
	{ key: "tue", label: "T" },
	{ key: "wed", label: "W" },
	{ key: "thu", label: "T" },
	{ key: "fri", label: "F" },
	{ key: "sat", label: "S" },
	{ key: "sun", label: "S" },
] as const;

function getDateInTimezone(date: Date, timezone: string): string {
	return date.toLocaleDateString("en-CA", { timeZone: timezone }); // "YYYY-MM-DD"
}

function isYesterday(lastDate: string, today: string): boolean {
	const last = new Date(lastDate);
	const curr = new Date(today);
	const diffTime = curr.getTime() - last.getTime();
	const diffDays = diffTime / (1000 * 60 * 60 * 24);
	return diffDays === 1;
}

export default function Streak({
	currentStreak,
	longestStreak,
	lastActivityDate,
}: StreakProps) {
	const today = new Date().getDay();
	// Convert: Sunday=0 -> index 1, Saturday=6 -> index 0, others shift by +1
	const todayIndex = today === 0 ? 1 : today === 6 ? 0 : today + 1;

	// Mock data - in real app this would come from props/API
	const streak = currentStreak ?? 0;
	const completedDays: string[] = []; // keys of completed days
	return (
		<div
			className="overflow-hidden rounded-3xl bg-white p-2.5"
			style={{
				boxShadow:
					"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
			}}
		>
			<div className="mb-2.5 flex gap-2 pl-1.5 font-medium">
				<div>
					<h3 className="flex items-center gap-2 font-lyon font-semibold text-xl">
						{streak} day streak
						<Tooltip>
							<TooltipTrigger>
								<InfoIcon className="size-4 text-neutral-400" strokeWidth={2} />
							</TooltipTrigger>
							<TooltipContent>
								<p>
									Your current streak is {streak} days.
									<br />
									Your longest streak is {longestStreak} days.
								</p>
							</TooltipContent>
						</Tooltip>
					</h3>
					<p className="text-muted-foreground text-sm">
						Time to start your first lesson!
					</p>
				</div>
			</div>

			<div className="rounded-[1.2rem] border border-border/50 p-3">
				{/* Week Progress */}
				<div className="flex items-center justify-between">
					{WEEK_DAYS.map((day, index) => {
						const isToday = index === todayIndex;
						const isCompleted = completedDays.includes(day.key);

						return (
							<div key={day.key} className="flex flex-col items-center gap-2">
								<span className="font-medium text-neutral-500 text-xs">
									{day.label}
								</span>
								<div
									className={cn(
										"flex size-8.5 items-center justify-center rounded-full transition-all",
										isCompleted
											? "bg-[#EA580C]"
											: isToday
												? "border-2 border-orange-400 bg-transparent"
												: "bg-neutral-100",
									)}
								>
									{isCompleted && (
										<FlameIcon className="size-4 text-white" fill="white" />
									)}
								</div>
							</div>
						);
					})}
				</div>
				{/* <div className="grid grid-cols-2 gap-4 pb-0">
					<div className="flex flex-col">
						<div className="mb-1 flex items-center font-medium text-muted-foreground text-xs">
							Current Streak
						</div>
						<span className="font-semibold">{currentStreak} days</span>
					</div>

					<div className="flex flex-col">
						<div className="mb-1 flex items-center font-medium text-muted-foreground text-xs">
							Longest Streak
						</div>
						<span className="font-semibold">{longestStreak} days</span>
					</div>
				</div> */}
			</div>
		</div>
	);
}
