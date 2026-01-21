import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-dvh flex-col items-center justify-center">
      <div className="mb-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative size-14 overflow-hidden rounded-3xl border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]">
            <img
              className="absolute bottom-[-8px] h-full w-full object-contain"
              src="/logo-404.svg"
              alt="English Now Logo"
              width={62}
              height={62}
            />
          </div>
        </Link>
      </div>
      <div className="text-center">
        <div className="mb-2 font-bold font-lyon text-4xl">Page Not Found</div>
        <div className="text-muted-foreground">
          The page you're looking for cannot be found. <br />
          If this keeps happening, please{" "}
          <a
            className="text-primary underline"
            href="mailto:support@english.now"
          >
            contact us
          </a>
          .
        </div>
        <Button
          size="lg"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.75) 100%)",
            boxShadow:
              "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 0px 0px rgb(255, 255, 255, 1) inset, 0px 1px 2px 1px rgba(0, 0, 0, 0.06)",
          }}
          className="mt-6 cursor-pointer rounded-xl text-black hover:brightness-95"
          asChild
        >
          <Link to="/">
            <div className="flex w-full items-center justify-center gap-1 whitespace-nowrap">
              Back to home
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
