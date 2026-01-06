import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fluency")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/fluency"!</div>;
}
