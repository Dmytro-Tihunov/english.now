import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/courses")({
	component: CoursesLayout,
});

function CoursesLayout() {
	return <Outlet />;
}
