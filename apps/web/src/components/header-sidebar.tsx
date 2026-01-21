import { Link } from "@tanstack/react-router";
import { LanguageSwitcher } from "./language-switcher";

export default function HeaderSidebar() {
	return (
		<div className="flex w-full flex-row items-center justify-between">
			<Link to="/home" className="flex items-center gap-3">
				<div className="relative size-10 overflow-hidden rounded-2xl border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]">
					<img
						className="absolute bottom-[-6px] h-full w-full object-contain"
						src="/logo.svg"
						alt="English Now Logo"
						width={62}
						height={62}
					/>
				</div>
			</Link>
			<LanguageSwitcher />
		</div>
	);
}
