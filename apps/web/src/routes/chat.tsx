import { createFileRoute } from "@tanstack/react-router";
import { AI } from "@/components/home/ai";
export const Route = createFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AI />;
}
