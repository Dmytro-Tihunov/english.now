import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import SettingsModal from "./settings-modal";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!session) {
    return (
      <>
        <div className="relative mb-2 flex items-center pl-8 font-medium text-foreground-muted text-sm">
          Login to access more features. <br /> Start for free.
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Log in to access more free translations."
            aria-hidden="true"
            viewBox="0 0 40.2 90.4"
            className="absolute w-4.5"
            style={{ top: "0.5rem", left: "-0.2rem", rotate: "30deg" }}
          >
            <path
              d="M7.3,39.2c1.6-1.2,3.1-2.4,4.7-3.4,4-2.6,8.3-3,12.8-1.7,5,1.4,7.1,7.2,4.2,11.6-4.3,6.6-11.4,6.2-16.4,2.9-1.9-1.2-3.5-2.7-5.4-4.2-1.3,1.6-2.5,3.4-3.2,5.5-2.8,9.4.2,17.4,6.2,24.5,1.1,1.4,2.8,2.4,4.4,3.3,3.9,2,8,3.9,12.5,3.8,2.7,0,5.3-.4,8.3-.6-1.3-1.4-2.3-2.5-3.4-3.6-.2-.2-.3-.4-.5-.6-.4-.6-.7-1.3,0-1.9.7-.6,1.3-.3,1.9.3.4.5.8,1,1.3,1.4,1.3,1.1,2.7,2.3,4.1,3.2,1.3.9,1.6,1.7.7,3-1.4,1.8-2.9,3.6-4.4,5.4-.5.6-1,1.1-1.5,1.7-.6.7-1.3,1.1-2.1.5-.7-.5-.7-1.3,0-2.2.7-.9,1.5-1.7,2.2-2.6.4-.5.8-.9,1.1-1.7-.9.1-1.7.3-2.6.3-1.9.1-3.9.4-5.8.3-5.8-.1-10.8-2.5-15.6-5.5-1.7-1.1-3.2-2.6-4.4-4.2C2.7,69.3-.1,63.5,0,56.6c0-5.2,1.3-9.9,4.7-14,.6-.7.6-1.2.1-1.9-3.3-5.1-3.9-10.8-3.5-16.6.4-5.3,1.9-10.3,4.9-14.8C9.1,4.9,13.4,2.5,18.3,1c1.4-.4,2.8-.6,4.3-.8.7,0,1.5-.2,2.2-.2.7,0,1.3,0,1.9.2s1.2.3,1.6.8.2.5.2.7c0,.5-.8.8-1.2.8-1.9.2-3.9.1-5.8.4-3.9.5-7.2,2.3-10.2,4.7-3.5,2.9-5.2,7-6.3,11.3-1.2,4.6-1.2,9.3-.3,14,.4,2.2,1.4,4.2,2.6,6.1ZM12.4,44.7c1.9,1.6,4.2,2.8,6.7,3s5.5-1.1,7.1-3.5c2.2-3.1.9-6.7-2.8-7.6-5.6-1.4-10,.7-13.9,4.6-.1.1-.1.7,0,.9.4.4.8.8,1.2,1.2.5.5,1,.9,1.5,1.3Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <Button
          className="group inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl border-0 border-transparent bg-[radial-gradient(100%_100%_at_50%_0%,_#EFFF9B_0%,_#D8FF76_60%,_#C6F64D_100%)] px-3 py-1 font-semibold text-slate-900 shadow-none transition duration-150 ease-in-out will-change-transform hover:bg-slate-100 hover:brightness-95 focus:shadow-none focus:outline-none focus-visible:shadow-none focus-visible:shadow-outline-indigo active:scale-97 dark:text-slate-100 dark:hover:bg-white/[.10] dark:hover:text-white"
          variant="outline"
          asChild
        >
          <Link to="/login">Start for free</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-full flex-col items-start">
          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <img
                src={session.user.image ?? undefined}
                alt={session.user.name ?? ""}
                className="size-8 rounded-full"
              />
            </div>
            <div>
              <div className="font-medium text-sm">{session.user.name}</div>
              <div className="text-muted-foreground text-sm">
                {session.user.email}
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </Button>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/billing">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/logout">Logout</Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem asChild>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/",
                    });
                  },
                },
              });
            }}
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </DropdownMenu>
  );
}
