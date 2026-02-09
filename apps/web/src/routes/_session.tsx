import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/_session")({
	beforeLoad: async () => {
		const session = await getUser();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
		return { session };
	},
	component: SessionLayout,
	pendingComponent: SessionPending,
});

function SessionPending() {
	return (
		<div className="flex h-dvh w-full items-center justify-center">
			<Loader className="size-8 animate-spin text-muted-foreground" />
		</div>
	);
}

function SessionLayout() {
	return (
		<div className="flex min-h-dvh w-full bg-neutral-50 dark:bg-neutral-900">
			<main className="relative flex h-full w-full flex-1 flex-col overflow-auto">
				{/* Header */}
				<div className="sticky top-0 z-10 border-black/5 border-b bg-white dark:bg-neutral-900">
					<div className="container relative mx-auto max-w-6xl px-4">
						<nav className="flex items-center justify-between py-4">
							<Link to="/practice" className="flex items-center gap-3">
								<div className="relative size-9 overflow-hidden rounded-xl border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]">
									<img
										className="absolute bottom-[-5px] h-full w-full object-contain"
										src="/logo.svg"
										alt="English Now Logo"
										width={62}
										height={62}
									/>
								</div>
							</Link>
						</nav>
					</div>
				</div>
				<Outlet />
			</main>
		</div>
	);
}
