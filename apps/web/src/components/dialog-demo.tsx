import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
export default function DialogDemo({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="min-w-3xl max-w-4xl border-0 bg-transparent p-0 shadow-none">
				<DialogTitle className="sr-only">Demo Video</DialogTitle>
				<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
					<iframe
						className="absolute inset-0 h-full w-full"
						src={
							open ? "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" : ""
						}
						title="Demo Video"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
