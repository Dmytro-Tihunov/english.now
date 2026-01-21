import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/fluency")({
	component: FluencyPage,
});

function FluencyPage() {
	return (
		<div className="flex h-full items-center justify-center">
			<div className="text-center">
				<h1 className="font-bold font-lyon text-3xl">Speaking Practice</h1>
				<p className="mt-2 text-muted-foreground">
					Practice your speaking skills with AI conversations...
				</p>
			</div>
		</div>
	);
}
