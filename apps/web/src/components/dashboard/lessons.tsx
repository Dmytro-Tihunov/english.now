import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	CheckIcon,
	ChevronRight,
	ClockIcon,
	Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function Lessons() {
	const lessons = [
		{
			id: 1,
			title: "Job Interview Basics",
			level: "Intermediate",
			progress: 45,
			status: "current" as const,
		},
		{
			id: 2,
			title: "Business Email Writing",
			level: "Intermediate",
			progress: 0,
			status: "locked" as const,
		},
	];
	return (
		<div
			className="overflow-hidden rounded-3xl bg-white p-2.5"
			style={{
				boxShadow:
					"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
			}}
		>
			<div className="mb-2 flex items-center justify-between gap-2 pl-1.5 font-medium">
				<div className="font-bold font-lyon text-xl">Lessons</div>
			</div>

			<div className="relative flex h-full w-full gap-4">
				<div className="flex flex-1 flex-col gap-3">
					<div className="overflow-hidden rounded-2xl border border-border/50">
						<div className="p-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="relative flex size-10 items-center justify-center">
										<svg
											className="size-10"
											viewBox="0 0 56 56"
											aria-hidden="true"
										>
											<title>Level progress</title>
											<circle
												cx="28"
												cy="28"
												r="24"
												fill="none"
												stroke="currentColor"
												strokeWidth="4"
												className="text-neutral-100"
											/>
											<circle
												cx="28"
												cy="28"
												r="24"
												fill="none"
												stroke="currentColor"
												strokeWidth="4"
												strokeLinecap="round"
												strokeDasharray={`${(50 / 100) * 150.8} 150.8`}
												transform="rotate(-90 28 28)"
												className="text-lime-500"
											/>
										</svg>
										<span className="absolute font-bold text-[10px]">50%</span>
									</div>
									<div>
										<h2 className="font-semibold text-sm">
											Introductions & Greetings
										</h2>
										<p className="text-muted-foreground text-xs">
											Reach 50% to open next unit.
										</p>
									</div>
								</div>
								{/* <Button
									variant="outline"
									size="icon"
									className="size-6 rounded-full"
									asChild
								>
									<Link to="/lessons">
										<ArrowRight className="size-4" />
									</Link>
								</Button> */}
							</div>
						</div>
					</div>

					<div className="flex w-full flex-col gap-2 px-1.5">
						<div className="flex flex-col">
							{lessons.map((lesson, i) => (
								<div key={lesson.id} className="flex items-stretch gap-3">
									<div
										className={cn(
											"mb-2 flex-1 rounded-xl border p-2",
											lesson.status === "current"
												? "border-neutral-100 bg-white"
												: "border-neutral-100 bg-neutral-50/50 opacity-60",
										)}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div
													className={cn(
														"relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-[10px]",
														lesson.status === "current" &&
															"border border-amber-400 bg-amber-200 text-amber-600",
														lesson.status === "locked" &&
															"border border-neutral-300 bg-neutral-100 text-neutral-400",
													)}
												>
													{lesson.status === "completed" ? (
														<CheckIcon className="size-3" strokeWidth={2.5} />
													) : lesson.status === "current" ? (
														<ClockIcon className="size-3" strokeWidth={2.5} />
													) : lesson.status === "locked" ? (
														<Lock className="size-3" strokeWidth={2.5} />
													) : null}
												</div>
												<span
													className={cn(
														"font-medium text-xs",
														lesson.status === "locked"
															? "text-neutral-400"
															: "text-neutral-800",
													)}
												>
													{lesson.title}
												</span>
											</div>
											{lesson.status === "current" && (
												<Button
													variant="outline"
													size="icon"
													className="size-6 rounded-full text-xs"
													asChild
												>
													<Link to="/lessons">
														<ChevronRight className="size-4" />
													</Link>
												</Button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
