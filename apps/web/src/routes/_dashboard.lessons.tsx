import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_dashboard/lessons")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen">
			<div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
				<div className="mb-6 flex flex-col gap-1">
					<div>
						<h1 className="font-bold font-lyon text-3xl tracking-tight md:text-3xl">
							Lessons
						</h1>
					</div>
				</div>

				<div
					className="overflow-hidden rounded-3xl bg-neutra-50"
					style={{
						boxShadow:
							"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
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
						<div
							className="mb-4 rounded-xl bg-white p-4"
							style={{
								boxShadow:
									"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
							}}
						>
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
								<h4 className="font-medium text-neutral-500">
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
		</div>
	);
}
