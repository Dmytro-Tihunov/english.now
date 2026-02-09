import { createFileRoute } from "@tanstack/react-router";
import Conversation from "@/components/practice/convesation";
import Pronunciation from "@/components/practice/pronunciation";

export const Route = createFileRoute("/_dashboard/practice")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen">
			<div className="container relative z-10 mx-auto max-w-5xl px-4 py-6 pt-8">
				<div className="mb-6 flex flex-col gap-1">
					<div>
						<h1 className="font-bold font-lyon text-3xl tracking-tight md:text-3xl">
							Practice
						</h1>
					</div>
				</div>

				<div className="mb-10 border-black/5 border-b pb-8">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<Conversation />
						<Pronunciation />
					</div>
				</div>

				<div className="">
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-center gap-2">
							<div className="flex flex-col items-center gap-2">
								<img src="/test.png" alt="Empty state" className="w-1/4" />
								<p className="font-medium text-xl">
									You don’t have records yet
								</p>
								<p className="text-muted-foreground">
									Most people create multiple records daily to get better at
									speaking
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
