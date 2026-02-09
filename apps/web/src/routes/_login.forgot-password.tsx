import { createFileRoute } from "@tanstack/react-router";
import ForgotPassForm from "@/components/auth/forgot-pass-form";
import { createTitle, PAGE_TITLE } from "@/utils/title";

export const Route = createFileRoute("/_login/forgot-password")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: createTitle(PAGE_TITLE.forgotPassword),
			},
		],
	}),
});

function RouteComponent() {
	return <ForgotPassForm />;
}
