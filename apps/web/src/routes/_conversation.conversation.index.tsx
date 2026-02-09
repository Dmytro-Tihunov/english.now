import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_conversation/conversation/")({
	beforeLoad: () => {
		throw redirect({ to: "/practice" });
	},
	component: () => null,
});
