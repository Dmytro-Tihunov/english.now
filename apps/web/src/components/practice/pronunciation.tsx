import { Link } from "@tanstack/react-router";
import { MicIcon } from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

export default function Pronunciation() {
	return (
		<div
			className="overflow-hidden rounded-[1.2rem] bg-white"
			style={{
				boxShadow:
					"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
			}}
		>
			<Link
				to="/pronunciation"
				className="group flex w-full items-center justify-between border-black/5 border-b p-4 transition-colors duration-300 hover:bg-neutral-100"
			>
				<div className="flex items-center gap-2.5">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#C6F64D] bg-radial from-[#EFFF9B] to-[#D8FF76]">
						<MicIcon className="size-5 text-lime-700" />
					</div>
					<div className="text-left">
						<h2 className="font-semibold text-slate-900">Pronunciation</h2>
						<p className="text-muted-foreground text-sm">
							Practice your pronunciation
						</p>
					</div>
				</div>
				<svg
					className="relative size-5 text-gray-400 transition-all duration-300 group-hover:text-gray-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</Link>
			<div className="relative py-4 pr-0">
				<Carousel
					opts={{
						align: "start",
						loop: false,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-2 pl-4">
						<CarouselItem className="basis-[80%] pl-2">
							<div className="h-[120px] rounded-xl border p-3">
								<span className="font-semibold text-sm">Read Aloud</span>
							</div>
						</CarouselItem>
						<CarouselItem className="basis-[80%] pl-2">
							<div className="h-[120px] h-full rounded-xl border p-3">
								<span className="font-semibold text-sm">Tongue Twisters</span>
							</div>
						</CarouselItem>
					</CarouselContent>
				</Carousel>
				{/* Fade effect on the right */}
				<div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
			</div>
		</div>
	);
}
