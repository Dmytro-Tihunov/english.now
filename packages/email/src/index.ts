import { env } from "@english.now/env/server";

export interface SendEmailOptions {
	to: string;
	templateId: string;
	dynamicData?: Record<string, string>;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
	const response = await fetch("https://api.autosend.com/v1/mails/send", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.AUTOSEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			to: { email: options.to },
			from: {
				email: env.EMAIL_FROM,
				name: "English Now",
			},
			templateId: options.templateId,
			dynamicData: options.dynamicData,
		}),
	});

	if (!response.ok) {
		console.error("Failed to send email:", await response.text());
	}
}
