import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_session/session/")({
	beforeLoad: () => {
		throw redirect({ to: "/home" });
	},
	component: () => null,
});
