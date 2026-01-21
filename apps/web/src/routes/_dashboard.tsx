import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/dashboard/navbar";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
  component: DashboardLayout,
  pendingComponent: DashboardPending,
});

function DashboardPending() {
  return (
    <div className="flex h-dvh w-full">
      <main className="relative flex h-fit min-h-screen w-full flex-1 flex-col overflow-auto">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    </div>
  );
}

function DashboardLayout() {
  // Check if we're transitioning to a different layout (like conversation)
  const isTransitioningAway = useRouterState({
    select: (s) => {
      // resolvedLocation is where we're navigating TO
      const targetPath = s.resolvedLocation?.pathname;
      const isLeavingDashboard = targetPath?.startsWith("/conversation");
      return s.isLoading && isLeavingDashboard;
    },
  });

  // If transitioning to conversation, show centered loader without navbar
  if (isTransitioningAway) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full bg-neutral-50 dark:bg-neutral-900">
      <main className="relative flex h-fit min-h-screen w-full flex-1 flex-col overflow-auto">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
