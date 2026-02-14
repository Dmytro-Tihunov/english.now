import { cn } from "@/lib/utils";

const mockWeekData = [
	{ day: "Mon", date: 20, minutes: 12, isToday: false },
	{ day: "Tue", date: 21, minutes: 25, isToday: false },
	{ day: "Wed", date: 22, minutes: 8, isToday: false },
	{ day: "Thu", date: 23, minutes: 30, isToday: false },
	{ day: "Fri", date: 24, minutes: 0, isToday: false },
	{ day: "Sat", date: 25, minutes: 15, isToday: false },
	{ day: "Sun", date: 26, minutes: 5, isToday: true },
];

export default function DailyPracticeTime() {
	const dailyGoal = 30; // minutes
	const totalSpent = mockWeekData.reduce((acc, d) => acc + d.minutes, 0);
	const dailyAverage = Math.round(totalSpent / 7);
	const maxMinutes = Math.max(dailyGoal, ...mockWeekData.map((d) => d.minutes));

	return (
		<div
			className="overflow-hidden rounded-3xl bg-white p-2.5"
			style={{
				boxShadow:
					"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
			}}
		>
			<div className="mt-1 mb-2 flex items-center justify-between gap-2 pl-1.5 font-medium">
				<div className="font-bold font-lyon text-xl">Practice Time</div>
			</div>

			<div className="rounded-xl border border-border/50 p-2.5">
				{/* Bar Chart */}
				<div className="relative mt-10 mb-6">
					{/* Goal line */}
					<div
						className="absolute right-0 left-0 border-orange-400 border-t-2 border-dashed"
						style={{ bottom: `${(dailyGoal / maxMinutes) * 100}%` }}
					>
						<span className="-top-5 absolute left-0 rounded bg-orange-100 px-1.5 py-0.5 font-medium text-orange-600 text-xs">
							{dailyGoal} min
						</span>
					</div>

					{/* Bars */}
					<div className="flex h-11 items-end justify-between gap-2">
						{mockWeekData.map((day) => (
							<div key={day.day} className="flex flex-1 flex-col items-center">
								<div
									className={cn(
										"w-full rounded-t-sm transition-all",
										day.minutes > 0
											? day.minutes >= dailyGoal
												? "bg-lime-400"
												: "bg-orange-400"
											: "bg-neutral-100",
									)}
									style={{
										height: `${Math.max((day.minutes / maxMinutes) * 100, 4)}%`,
									}}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Helper text */}
				{/* <p className="mb-4 text-center text-muted-foreground text-sm">
					Each and every record contributes to your overall speaking time tally.
				</p> */}

				{/* Week Calendar */}
				<div className="flex justify-between rounded-xl bg-neutral-50 p-2">
					{mockWeekData.map((day) => (
						<button
							type="button"
							key={day.day}
							className={cn(
								"flex flex-col items-center rounded-xl p-2 transition-colors",
								day.isToday ? "bg-white shadow-sm" : "hover:bg-white/50",
							)}
						>
							<span className="text-muted-foreground text-xs">{day.day}</span>
							<span
								className={cn(
									"font-semibold",
									day.isToday ? "text-slate-900" : "text-slate-600",
								)}
							>
								{day.date}
							</span>
							{day.minutes > 0 && (
								<div
									className={cn(
										"mt-0.5 size-1.5 rounded-full",
										day.minutes >= dailyGoal ? "bg-lime-500" : "bg-orange-400",
									)}
								/>
							)}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
