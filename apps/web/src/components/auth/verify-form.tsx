import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "motion/react";

export default function VerifyForm() {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			code: "",
		},
	});
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
			className="mx-auto w-full max-w-sm p-6"
		>
			<div className="mt-4 mb-6">
				<img src="test.png" alt="email" className="mx-auto w-38" />
				<h1 className="mb-1 text-center font-bold font-lyon text-3xl">
					Confirm your Email
				</h1>
				<p className="text-center text-neutral-500 text-sm">
					A sign link has been sent to your email to confirm your email address.
				</p>
			</div>
			<div className="flex flex-row gap-6">
				<button
					type="submit"
					className="flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] px-3 py-1 font-semibold text-neutral-900 text-sm transition-all duration-150 ease-in-out hover:brightness-95"
				>
					Resend
				</button>

				<button
					type="submit"
					className="flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] px-3 py-1 font-semibold text-neutral-900 text-sm transition-all duration-150 ease-in-out hover:brightness-95"
				>
					Change Email
				</button>
			</div>
			<p className="text-center text-neutral-500 text-sm">
				Cant find the email? Check your spam folder
			</p>
		</motion.div>
	);
}
