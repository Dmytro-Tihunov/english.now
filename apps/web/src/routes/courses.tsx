import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/courses")({
  component: CoursesLayout,
});

function CoursesLayout() {
  return <Outlet />;
}
