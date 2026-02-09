import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export const Route = createFileRoute("/_public")({
	component: PublicLayout,
});

function PublicLayout() {
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
