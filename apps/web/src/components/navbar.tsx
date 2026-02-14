import { useTranslation } from "@english.now/i18n";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import { Button } from "./ui/button";

export default function Navbar() {
	const { t } = useTranslation("common");
	const [isScrolled, setIsScrolled] = useState(false);

	const _links = [
		{
			to: "/about",
			label: t("nav.about"),
		},
		{
			to: "/features",
			label: t("nav.features"),
		},
		{
			to: "/pricing",
			label: t("nav.pricing"),
		},
		{
			to: "/blog",
			label: t("nav.blog"),
		},
	];

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={`sticky top-0 right-0 left-0 z-50 bg-white/70 backdrop-blur-md transition-[border-color] duration-200 dark:bg-neutral-900/70 ${
				isScrolled ? "border-border/50 border-b" : "border-transparent border-b"
			}`}
		>
			<div className="container relative z-10 mx-auto max-w-5xl px-4">
				<nav className="flex items-center justify-between py-5 md:grid-cols-5">
					<div className="col-span-3 items-center gap-3 md:flex">
						<Logo />
						<div className="hidden items-center gap-1.5 md:flex">
							{_links.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="w-auto rounded-xl px-2.5 py-2 font-medium transition-all duration-300 hover:bg-neutral-200/60 md:inline-flex md:items-center md:justify-center md:text-sm"
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
					<div className="relative z-50 flex items-center justify-end gap-2">
						<Button
							asChild
							variant="ghost"
							className="rounded-xl px-2.5 py-2 font-medium hover:bg-neutral-200/60"
						>
							<Link to="/login" className="text-sm">
								{t("auth.signIn")}
							</Link>
						</Button>
						<Button
							asChild
							className="relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl bg-linear-to-t from-[#202020] to-[#2F2F2F] font-base text-white shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.4)] outline-none transition-all hover:opacity-90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 has-[>svg]:px-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:from-[rgb(192,192,192)] dark:to-[rgb(255,255,255)] dark:shadow-[inset_0_1px_4px_0_rgba(128,128,128,0.2)] dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none"
						>
							<Link to="/signup">
								{t("auth.signUp")}{" "}
								<span className="text-neutral-500 text-sm">-</span>
								<span className="font-lyon text-lg text-neutral-500 italic">
									free
								</span>
							</Link>
						</Button>
					</div>
				</nav>
			</div>
		</div>
	);
}
