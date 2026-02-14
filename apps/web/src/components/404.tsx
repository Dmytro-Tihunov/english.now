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
				<div className="mb-2 font-bold font-lyon text-4xl italic">
					Page Not Found
				</div>
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
					variant="outline"
					className="group mt-5 inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-xl border border-neutral-200 bg-linear-to-b from-neutral-50 to-neutral-100 px-6 py-1.5 font-medium text-neutral-700 italic shadow-none transition duration-150 ease-in-out will-change-transform hover:brightness-95 focus:shadow-none focus:outline-none focus-visible:shadow-none"
					asChild
				>
					<Link to="/">
						Back{" "}
						<span className="relative font-lyon text-lg text-neutral-700/80 italic leading-0 group-hover:text-neutral-700">
							home
						</span>
					</Link>
				</Button>
			</div>
		</div>
	);
}
