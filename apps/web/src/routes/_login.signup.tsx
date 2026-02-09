import { createFileRoute } from "@tanstack/react-router";
import SignUpForm from "@/components/auth/sign-up-form";
import { createTitle, PAGE_TITLE } from "@/utils/title";

export const Route = createFileRoute("/_login/signup")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: createTitle(PAGE_TITLE.register),
			},
		],
	}),
});

function RouteComponent() {
	return <SignUpForm />;
}
