import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/blog")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative">
      <div className="container relative mx-auto max-w-5xl px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-bold font-lyon text-4xl tracking-tight md:text-5xl lg:text-6xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Stay up to date with the latest news and updates from English Now.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">Latest Posts</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
