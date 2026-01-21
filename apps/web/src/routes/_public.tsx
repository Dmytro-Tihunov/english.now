import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export const Route = createFileRoute("/_public")({
	component: PublicLayout,
});

function PublicLayout() {
	const matches = useMatches();
	const isLoginPage = matches.some(
		(match) =>
			match.pathname === "/login" ||
			match.pathname === "/signup" ||
			match.pathname === "/forgot-password",
	);

	if (isLoginPage) {
		return (
			<div className="flex min-h-screen flex-col">
				<Outlet />
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen flex-col">
			<Navbar />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
