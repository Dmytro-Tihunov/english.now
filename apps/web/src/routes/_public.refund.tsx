import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/refund")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container relative mx-auto max-w-3xl px-4 py-8">
			<article className="prose prose-neutral dark:prose-invert max-w-none">
				<header className="mb-12 text-center">
					<h1 className="mb-4 font-bold font-lyon text-3xl tracking-tight md:text-4xl">
						Refund Policy & Cancellation Policy
					</h1>
					<p className="text-muted-foreground">Last updated: January 1, 2026</p>
				</header>
				<section className="mb-10">
					<h2 className="mb-4 font-semibold text-2xl">Introduction</h2>
					<p className="mb-4 text-muted-foreground">
						english.now is an open-source, self-study English learning platform.
						We are committed to protecting your privacy and being transparent
						about how we handle your data. This Privacy Policy explains what
						information we collect, how we use it, and your rights regarding
						your personal data.
					</p>
					<p className="text-muted-foreground">
						As an open-source project, our code is publicly available for
						review, which means you can verify exactly how we handle your data.
					</p>
				</section>
				<section className="mb-10">
					<h2 className="mb-4 font-semibold text-2xl">Introduction</h2>
					<p className="mb-4 text-muted-foreground">
						english.now is an open-source, self-study English learning platform.
						We are committed to protecting your privacy and being transparent
						about how we handle your data. This Privacy Policy explains what
						information we collect, how we use it, and your rights regarding
						your personal data.
					</p>
					<p className="text-muted-foreground">
						As an open-source project, our code is publicly available for
						review, which means you can verify exactly how we handle your data.
					</p>
				</section>
			</article>
		</div>
	);
}
