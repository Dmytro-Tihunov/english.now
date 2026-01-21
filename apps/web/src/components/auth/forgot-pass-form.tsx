import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import Loader from "../loader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ForgotPassForm() {
	const navigate = useNavigate({
		from: "/",
	});
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.requestPasswordReset(
				{
					email: value.email,
					redirectTo: `${window.location.origin}/reset-password?token=`,
				},
				{
					onSuccess: () => {
						toast.success("Password reset email sent");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div
			className="mx-auto mt-10 w-full max-w-sm rounded-3xl bg-white p-6"
			style={{
				boxShadow:
					"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
			}}
		>
			<Link to="/" className="flex items-center gap-3">
				<div className="relative size-10 overflow-hidden rounded-xl border border-[#C6F64D] bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)]">
					<img
						className="absolute bottom-[-5px] h-full w-full object-contain"
						src="/logo.svg"
						alt="English Now Logo"
						width={62}
						height={62}
					/>
				</div>
			</Link>
			<div className="mt-4 mb-6">
				<h1 className="mb-1 font-bold font-lyon text-3xl">Forgot Password</h1>
				<p className="text-neutral-500 text-sm">
					Enter your email address and we'll send you a link to reset your
					password.
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-500">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<form.Subscribe>
					{(state) => (
						<Button
							type="submit"
							className="group flex h-9 w-full cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-lg border-0 border-transparent bg-[radial-gradient(100%_100%_at_50%_0%,#EFFF9B_0%,#D8FF76_60%,#C6F64D_100%)] px-3 py-1 font-semibold text-slate-900 text-sm shadow-none transition duration-150 ease-in-out will-change-transform hover:bg-slate-100 hover:brightness-95 focus:shadow-none focus:outline-none focus-visible:shadow-none focus-visible:shadow-outline-indigo active:scale-97 dark:text-slate-100 dark:hover:bg-white/10 dark:hover:text-white"
							disabled={!state.canSubmit || state.isSubmitting}
						>
							{state.isSubmitting ? "Submitting..." : "Reset Password"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-2 text-center">
				<Button
					variant="link"
					onClick={() => navigate({ to: "/login" })}
					className="cursor-pointer text-lime-700 hover:text-lime-700/80"
				>
					Back to Login
				</Button>
			</div>
		</div>
	);
}
