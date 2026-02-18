import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import Logo from "@/components/logo";
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
				<div className="sticky top-0 z-10 border-black/5 border-b bg-white dark:bg-neutral-900">
					<div className="container relative mx-auto max-w-6xl px-4">
						<nav className="flex items-center justify-between py-4">
							<Logo link="/practice" />
						</nav>
					</div>
				</div>
				<Outlet />
			</main>
		</div>
	);
}
