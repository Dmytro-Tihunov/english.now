import { createFileRoute, redirect } from "@tanstack/react-router";
import ResetPassForm from "@/components/auth/reset-pass-form";
import { createTitle, PAGE_TITLE } from "@/utils/title";

type ResetPasswordSearch = {
	token?: string;
};

export const Route = createFileRoute("/_login/reset-password")({
	validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
		token: typeof search.token === "string" ? search.token : undefined,
	}),
	beforeLoad: ({ search }) => {
		if (!search.token) {
			throw redirect({ to: "/login" });
		}
	},
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: createTitle(PAGE_TITLE.resetPassword),
			},
		],
	}),
});

function RouteComponent() {
	return <ResetPassForm token={Route.useSearch().token as string} />;
}
