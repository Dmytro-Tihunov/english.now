import { createFileRoute } from "@tanstack/react-router";
import VerifyForm from "@/components/auth/verify-form";
export const Route = createFileRoute("/_login/verify")({
	component: RouteComponent,
});

function RouteComponent() {
	return <VerifyForm />;
}
