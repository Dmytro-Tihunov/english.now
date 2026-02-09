import { createMiddleware } from "@tanstack/react-start";
import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await authClient.getSession({
			fetchOptions: {
				headers: request.headers,
				throw: true,
			},
		});

		let profile = null;
		if (session?.user?.id) {
			const profileResponse = await fetch(
				`${process.env.VITE_SERVER_URL}/api/profile`,
				{
					method: "GET",
					headers: {
						cookie: request.headers.get("cookie") || "",
					},
				},
			);
			if (profileResponse.ok) {
				profile = await profileResponse.json();
			}
		}

		return next({
			context: { session, profile },
		});
	},
);
