import { createFileRoute, redirect } from "@tanstack/react-router";
import SignUpForm from "@/components/auth/sign-up-form";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/_public/signup")({
	beforeLoad: async () => {
		const session = await getUser();
		if (session) {
			throw redirect({
				to: "/home",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex size-full flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
			<SignUpForm />
		</div>
	);
}
