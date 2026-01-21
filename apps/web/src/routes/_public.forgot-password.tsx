import { createFileRoute } from "@tanstack/react-router";
import ForgotPassForm from "@/components/auth/forgot-pass-form";

export const Route = createFileRoute("/_public/forgot-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex size-full flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
			<ForgotPassForm />
		</div>
	);
}
