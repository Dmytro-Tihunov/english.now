export interface SendEmailOptions {
	to: string;
	templateId: string;
	dynamicData?: Record<string, string>;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
	const response = await fetch("https://api.autosend.com/v1/mails/send", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.AUTOSEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			to: { email: options.to },
			from: {
				email: process.env.EMAIL_FROM || "noreply@english.now",
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
