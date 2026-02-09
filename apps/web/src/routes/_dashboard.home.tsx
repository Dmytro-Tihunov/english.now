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
					<div
						className="relative overflow-hidden rounded-3xl border bg-neutral-50 p-2.5"
						style={{
							boxShadow:
								"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
						}}
					>
						<div className="mt-1 mb-2.5 flex items-center justify-between gap-2 px-2 font-medium">
							<div className="flex items-center gap-2">
								{/* <svg
									className="w-6"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<g>
										<path
											d="M6.79768 5.3506C7.13839 5.10632 7.44054 4.73989 7.58411 4.34346C7.74054 3.9106 7.80911 3.43703 7.84768 2.97846C7.88625 2.49203 7.83054 2.00774 7.50911 1.61989C7.20697 1.25346 6.69054 1.11632 6.23411 1.12489C5.79697 1.13774 5.33625 1.24274 4.96982 1.49132C4.59911 1.74417 4.36982 2.11274 4.20054 2.52203C3.86839 3.32775 3.84268 4.44846 4.41482 5.16203C4.97625 5.86274 6.10768 5.84346 6.79768 5.35275V5.3506Z"
											fill="#DCFF6F"
										/>
										<path
											d="M6.79768 5.3506C7.13839 5.10632 7.44054 4.73989 7.58411 4.34346C7.74054 3.9106 7.80911 3.43703 7.84768 2.97846C7.88625 2.49203 7.83054 2.00774 7.50911 1.61989C7.20697 1.25346 6.69054 1.11632 6.23411 1.12489C5.79697 1.13774 5.33625 1.24274 4.96982 1.49132C4.59911 1.74417 4.36982 2.11274 4.20054 2.52203C3.86839 3.32775 3.84268 4.44846 4.41482 5.16203C4.97625 5.86274 6.10768 5.84346 6.79768 5.35275V5.3506ZM4.70197 3.03203C4.79839 2.69346 4.95482 2.33346 5.22697 2.09989C5.49911 1.86846 5.88268 1.77846 6.23197 1.76775C6.49982 1.76346 6.81911 1.81274 7.00768 2.02274C7.19839 2.23274 7.23054 2.53274 7.21554 2.80489C7.17697 3.45203 7.09339 4.1656 6.62625 4.65203C6.23411 5.06132 5.46482 5.25203 4.99768 4.84703C4.77054 4.64989 4.68268 4.30703 4.63768 4.02417C4.58411 3.69417 4.61197 3.35346 4.70197 3.03417V3.03203Z"
											fill="black"
										/>
										<path
											d="M8.16127 5.35491C7.82056 6.32777 6.76627 6.78849 5.78484 6.84634C5.79127 6.88706 5.78913 6.92991 5.7827 6.97277C5.76556 7.0692 5.74842 7.16777 5.73342 7.2642C5.51699 7.25777 5.30056 7.25563 5.08413 7.25991C5.10984 7.1142 5.13342 6.97063 5.15913 6.82706C4.75199 6.77777 4.34699 6.65777 4.00413 6.4392C3.56056 6.15634 3.29699 5.72991 3.1727 5.22634C3.07413 4.82349 3.69342 4.65206 3.79199 5.05491C3.88199 5.41706 4.04913 5.7192 4.37913 5.9142C4.71556 6.11563 5.12056 6.20134 5.51056 6.20991C6.24342 6.22277 7.26984 5.9592 7.54199 5.18349C7.67699 4.79349 8.29842 4.96277 8.16127 5.35491Z"
											fill="black"
										/>
										<path
											d="M2.61932 2.91228C2.61932 2.91228 2.61932 2.91228 2.61932 2.90585C2.63647 2.83299 2.64718 2.76013 2.66861 2.68942C2.67932 2.65085 2.69218 2.61228 2.70718 2.57585C2.71361 2.55871 2.72004 2.54371 2.72647 2.52656C2.79932 2.37871 2.87861 2.23942 2.97718 2.10871C3.07789 1.97371 3.00289 1.74442 2.86147 1.66942C2.69218 1.57942 2.52932 1.64156 2.42218 1.78513C1.97219 2.38299 1.84147 3.16513 2.10076 3.87013C2.15861 4.02655 2.32147 4.15084 2.49718 4.09513C2.65147 4.04584 2.78432 3.86798 2.72218 3.6987C2.69432 3.62155 2.66861 3.54227 2.64932 3.46084C2.64075 3.42227 2.63218 3.38155 2.62361 3.34084C2.62361 3.33227 2.62147 3.32584 2.61932 3.32155C2.61932 3.31727 2.61932 3.31298 2.61932 3.30655C2.61289 3.22727 2.60647 3.14798 2.60861 3.0687C2.60861 3.03013 2.61075 2.98942 2.61504 2.95085C2.61504 2.93799 2.61718 2.92513 2.61932 2.91228Z"
											fill="black"
										/>
										<path
											d="M0.866084 0.960088C0.392512 1.49366 0.0753697 2.12795 0.011084 2.84366C-0.0532018 3.54223 0.167513 4.23865 0.533941 4.8258C0.752512 5.17508 1.30966 4.85365 1.08894 4.50223C0.784655 4.0158 0.608941 3.47366 0.649655 2.89509C0.688226 2.34009 0.956084 1.8258 1.32037 1.41652C1.59466 1.10794 1.14037 0.651517 0.866084 0.962231V0.960088Z"
											fill="black"
										/>
										<path
											d="M9.21516 1.70983C9.06302 1.75912 8.92588 1.93697 8.99016 2.10626C9.04588 2.25197 9.08873 2.40197 9.11016 2.55626C9.11016 2.5734 9.11659 2.62912 9.11873 2.63769C9.12088 2.6784 9.12302 2.71912 9.12302 2.75983C9.12302 2.82412 9.11873 2.8884 9.1123 2.95269C9.11016 2.96769 9.10159 3.0234 9.09945 3.03197C9.09302 3.06197 9.08659 3.08983 9.08016 3.11983C9.06088 3.19269 9.0373 3.26555 9.0073 3.33626C9.00088 3.34912 8.99016 3.37697 8.98588 3.3834C8.96873 3.41983 8.94945 3.45626 8.92802 3.49269C8.8873 3.56555 8.84016 3.63626 8.79088 3.70483C8.69016 3.83983 8.76302 4.06912 8.90659 4.14412C9.07373 4.23197 9.23873 4.17412 9.34588 4.0284C9.79159 3.42197 9.8773 2.6334 9.61159 1.93483C9.55159 1.7784 9.39302 1.65412 9.21516 1.70983Z"
											fill="black"
										/>
										<path
											d="M11.5054 1.41191C11.3275 1.03905 10.7725 1.36477 10.9504 1.73548C11.2182 2.29691 11.3404 2.93977 11.2097 3.55692C11.0725 4.19763 10.7061 4.73121 10.2218 5.16406C9.91325 5.44049 10.3697 5.89478 10.6761 5.61835C11.2482 5.10621 11.6918 4.43335 11.8397 3.67263C11.9918 2.89262 11.844 2.1212 11.5054 1.40977V1.41191Z"
											fill="black"
										/>
										<path
											d="M6.74328 9.75865C5.60542 9.75436 4.46757 9.74793 3.32971 9.7415C2.91614 9.73936 2.91614 9.0965 3.32971 9.09865C3.80971 9.10079 4.28757 9.10293 4.76542 9.10722C4.87042 8.49008 4.97757 7.87508 5.08471 7.26008C5.30114 7.25579 5.51757 7.26008 5.734 7.26436C5.62685 7.8815 5.51971 8.49436 5.41471 9.10936C5.85614 9.1115 6.29971 9.11365 6.74328 9.11579C7.15685 9.12008 7.15685 9.76293 6.74328 9.75865Z"
											fill="#DCFF6F"
										/>
										<path
											d="M0.10282 9.54191C-0.385752 7.99262 2.29926 7.28548 5.08497 7.25977C4.97783 7.87477 4.87069 8.48977 4.76569 9.10691C4.28783 9.10262 3.80997 9.10048 3.32997 9.09834C2.9164 9.09619 2.9164 9.73905 3.32997 9.74119C4.46783 9.74762 5.60569 9.75405 6.74352 9.75834C7.15712 9.76262 7.15712 9.11977 6.74352 9.11548C6.29997 9.11334 5.8564 9.11119 5.41497 9.10905C5.51997 8.49405 5.62712 7.88119 5.73426 7.26405C8.04854 7.32619 10.2664 7.84905 10.6243 8.73191C11.79 11.6076 0.803534 11.7619 0.10282 9.54191Z"
											fill="black"
										/>
									</g>
									<defs>
										<clipPath id="clip0_1622_255">
											<rect width="12" height="12" fill="white" />
										</clipPath>
									</defs>
								</svg> */}
								<span className="font-bold font-lyon text-xl">
									Start Practicing
								</span>
							</div>
							<div className="flex items-center gap-1 font-medium text-sm transition-all duration-300 hover:text-lime-700 hover:underline">
								<Link to="/practice" className="flex items-center gap-1">
									<HistoryIcon className="size-4" />
								</Link>
							</div>
						</div>
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
