import { createFileRoute, Link } from "@tanstack/react-router";
import { HistoryIcon } from "lucide-react";
import Streak from "@/components/dashboard/streak";
import Conversation from "@/components/practice/convesation";
import Pronunciation from "@/components/practice/pronunciation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dashboard/home")({
	component: RouteComponent,
});

// Example mock data - replace with real data from API
const mockWeekData = [
	{ day: "Mon", date: 20, minutes: 12, isToday: false },
	{ day: "Tue", date: 21, minutes: 25, isToday: false },
	{ day: "Wed", date: 22, minutes: 8, isToday: false },
	{ day: "Thu", date: 23, minutes: 30, isToday: false },
	{ day: "Fri", date: 24, minutes: 0, isToday: false },
	{ day: "Sat", date: 25, minutes: 15, isToday: false },
	{ day: "Sun", date: 26, minutes: 5, isToday: true },
];

const dailyGoal = 30; // minutes
const totalSpent = mockWeekData.reduce((acc, d) => acc + d.minutes, 0);
const dailyAverage = Math.round(totalSpent / 7);

function DailyPracticeTime() {
	const maxMinutes = Math.max(dailyGoal, ...mockWeekData.map((d) => d.minutes));

	return (
		<div
			className="overflow-hidden rounded-3xl bg-white p-2.5"
			style={{
				boxShadow:
					"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
			}}
		>
			{/* Header */}
			<div className="mt-1 mb-2 flex items-center justify-between gap-2 pl-2 font-medium">
				<span className="font-bold font-lyon text-xl">Daily Practice Time</span>
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
					<div className="flex h-14 items-end justify-between gap-2">
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

function RouteComponent() {
	const { session, profile } = Route.useRouteContext();
	const firstName = session?.user.name?.split(" ")[0] || "Learner";

	const _plan = [
		{
			id: 1,
			name: "Morning",
			isCompleted: true,
		},
		{
			id: 2,
			name: "Afternoon",
			isCompleted: false,
		},
		{
			id: 3,
			name: "Evening",
			isCompleted: false,
		},
		{
			id: 4,
			name: "Evening",
			isCompleted: false,
		},
	];

	return (
		<div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
			<div className="mb-8 flex flex-col gap-1">
				<div className="flex items-center gap-3">
					<h1 className="font-bold font-lyon text-3xl tracking-tight">
						Welcome back, {firstName}
					</h1>
				</div>
				<p className="text-muted-foreground">
					Keep up the great work! You're making excellent progress.
				</p>
			</div>

			<div className="grid gap-5 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<div className="relative">
						<div className="grid gap-3 md:grid-cols-2">
							<Conversation />
							<Pronunciation />
						</div>
					</div>
					{/* Course Accelerator */}
					<div
						className="overflow-hidden rounded-3xl bg-white"
						style={{
							boxShadow:
								"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
						}}
					>
						<div className="p-5">
							{/* Header */}
							<div className="mb-4">
								<h2 className="font-bold text-xl">Lessons Overview</h2>
								<div className="mt-1 flex items-center justify-between">
									<span className="text-muted-foreground text-sm">
										Week 1 of 4 • Grammar Foundations
									</span>
									<span className="font-medium text-sm">18% Complete</span>
								</div>
							</div>

							{/* Progress Bar Segments */}
							<div className="mb-6 flex gap-1.5">
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
									<div className="h-full w-[72%] rounded-full bg-amber-500" />
								</div>
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
									<div className="h-full w-0 rounded-full bg-neutral-300" />
								</div>
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
									<div className="h-full w-0 rounded-full bg-neutral-300" />
								</div>
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
									<div className="h-full w-0 rounded-full bg-slate-300" />
								</div>
							</div>

							{/* Current Week Module */}
							<div className="mb-4 rounded-xl border border-neutral-100 bg-white p-4">
								<div className="mb-4 flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-full border-2 border-amber-500 text-amber-600">
											<svg
												className="size-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
										<div>
											<h3 className="font-semibold">
												Week 1: Grammar Foundations
											</h3>
											<p className="text-muted-foreground text-sm">
												Current Module
											</p>
										</div>
									</div>
								</div>

								{/* Current Lesson */}
								<div className="flex items-center gap-4 rounded-lg border border-neutral-100 bg-neutral-100 p-3">
									<div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-violet-100 to-purple-100">
										<span className="text-3xl">📚</span>
									</div>
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-center gap-2">
											<Badge
												variant="outline"
												className="border-slate-300 text-slate-600"
											>
												○ 77% Done
											</Badge>
										</div>
										<h4 className="font-semibold">Past Perfect Tense</h4>
										<p className="text-muted-foreground text-sm">
											Video • 12m remaining
										</p>
									</div>
									<Button className="shrink-0 bg-slate-900 hover:bg-slate-800">
										Resume
									</Button>
								</div>
							</div>

							{/* Locked Week */}
							<div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-neutral-100 p-4 opacity-60">
								<div className="flex size-10 items-center justify-center rounded-full border-2 border-neutral-300 text-neutral-400">
									<svg
										className="size-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<div>
									<h4 className="font-medium text-slate-500">
										Week 2: Vocabulary Mastery
									</h4>
									<p className="text-muted-foreground text-sm">
										Unlocks in 6 days
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Sidebar */}
				<div className="space-y-6">
					{/* <div
            className="relative overflow-hidden rounded-3xl bg-black p-2"
            style={{
              boxShadow:
                "0 0 0 1px #000,0 1px 1px 0 #0003,0 1px 0 0 #fff inset,0 -1px 1px 0 #fff inset,0 1px 4px 1px #fff inset,0 -2px 1px 1px #fff inset,0 20px 20px 0 #000 inset",
            }}
          >
            <div
              className="relative h-[225px] w-full overflow-hidden rounded-2xl border border-[#e5e7eb]"
              style={{
                backgroundImage: "url(/pattern3.svg)",
                backgroundSize: "40px auto",
                backgroundPosition: "left top",
                backgroundRepeat: "repeat",
              }}
            >
              <div className="-bottom-10 absolute right-0 mx-auto">
                <svg
                  className="size-58"
                  viewBox="0 0 147 182"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M67.334 5.42313C63.3714 11.1355 58.8324 16.7032 48.0974 28.7064C35.129 43.2404 29.7975 51.9897 28.2125 61.0282L27.3479 65.9452L25.4747 62.2575C24.466 60.1605 21.7282 56.5451 19.3507 54.1589C14.3074 48.8804 14.7397 48.5912 9.91253 60.0882C-1.25475 86.6977 -3.12797 114.97 5.01333 135.361C14.3794 158.861 33.1837 174.697 59.1927 181.06C61.6422 181.638 67.334 182 73.9623 182C83.4004 181.928 85.6339 181.711 91.974 179.975C119.496 172.383 139.669 151.269 145.793 123.575C147.018 117.79 147.162 115.187 146.874 104.269C146.297 85.2515 142.767 70.8621 134.121 53.2189C129.871 44.3973 120.649 29.791 115.894 24.3679L113.444 21.5479L110.274 23.6448C105.015 27.1156 98.8905 33.768 96.8012 38.2511L94.8559 42.445L94.4236 37.7449C93.8472 32.2495 92.9827 29.6464 89.6685 23.7171C87.363 19.6679 80.3745 10.557 73.8182 3.18157L71.0804 4.05312e-06L67.334 5.42313ZM43.0541 115.187C50.7632 119.67 57.0312 123.503 57.0312 123.792C57.0312 124.081 56.0946 125.6 54.9419 127.19C52.4202 130.733 48.8899 132.469 44.2789 132.469C37.8667 132.397 33.0396 129.07 29.5093 122.056C27.3479 117.79 26.6995 107.161 28.6447 107.161C28.9329 107.161 35.4172 110.776 43.0541 115.187ZM119.568 111.789C120.288 125.889 107.968 136.518 97.0173 131.312C94.7118 130.227 90.1728 125.238 90.1728 123.792C90.1728 123.069 117.839 107.161 118.631 107.378C119.064 107.522 119.424 109.475 119.568 111.789Z"
                    fill="#000"
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                </svg>
              </div>
            </div>
            <div className="mt-1 mb-1 flex w-full flex-row items-center justify-between px-1">
              <div className="top-0 left-0 items-center gap-2">
                <span className="mr-1 font-bold font-lyon text-white text-xl">
                  AI Tutor
                </span>
                <span className="border border-white text-muted-foreground text-sm">
                  beta
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="mt-1 rounded-full bg-white p-2 text-black"
              >
                <PhoneIcon className="size-4" />
              </Button>
            </div>
          </div> */}

					<Streak
						currentStreak={profile?.currentStreak}
						longestStreak={profile?.longestStreak}
						lastActivityAt={profile?.lastActivityAt}
					/>
					{/* <div className="overflow-hidden rounded-3xl border p-2.5">
						<div className="flex gap-2 font-medium"> */}
					{/* <div className="mt-1 mb-2 flex items-center justify-between gap-2 pl-2 font-medium">
								<span className="font-bold font-lyon text-xl">Daily Plan</span>
							</div> */}
					{/* <div className="font-medium text-gray-500 text-sm">0/4</div> */}
					{/* </div> */}

					{/* <div
							className="flex flex-col divide-y divide-dashed divide-black/10 overflow-hidden rounded-2xl bg-white"
							style={{
								boxShadow:
									"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
							}}
						>
							{_plan.map((item) => (
								<div
									className={cn(
										"flex items-center justify-between gap-2 px-3 py-3",
										item.isCompleted ? "bg-neutral-50 opacity-60" : "",
									)}
									key={item.id}
								>
									<div className="flex items-center gap-2">
										<div
											className={cn(
												"flex size-6 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100",
												item.isCompleted
													? "border-lime-500 bg-lime-400 text-white"
													: "",
											)}
										>
											{item.isCompleted ? (
												<Check className="size-3.5" strokeWidth={2.5} />
											) : (
												<span className="-top-[1px] relative text-neutral-500 text-sm">
													{item.id}
												</span>
											)}
										</div>
										<span
											className={cn(
												"font-medium text-sm",
												item.isCompleted
													? "text-muted-foreground line-through"
													: "",
											)}
										>
											{item.name}
										</span>
									</div>

									<button type="button">
										<ChevronRightIcon className="size-4 text-muted-foreground" />
									</button>
								</div>
							))}
						</div> */}
					{/* </div> */}
					<DailyPracticeTime />
				</div>
			</div>
		</div>
	);
}
