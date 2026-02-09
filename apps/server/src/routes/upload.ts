import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { auth } from "@english.now/auth";
import { env } from "@english.now/env/server";
import type { Context, Next } from "hono";
import { Hono } from "hono";

type Variables = {
	session: Awaited<ReturnType<typeof auth.api.getSession>>;
};

const upload = new Hono<{ Variables: Variables }>();

const s3Client = new S3Client({
	region: "auto",
	endpoint: env.R2_ENDPOINT,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

const BUCKET_NAME = env.R2_BUCKET_NAME;
const PUBLIC_URL = env.R2_PUBLIC_URL;

// Middleware to check auth
const requireAuth = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	c.set("session", session);
	return next();
};

// Upload avatar directly through server (avoids CORS issues)
upload.post("/avatar", requireAuth, async (c) => {
	const session = c.get("session");
	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	try {
		const formData = await c.req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return c.json({ error: "No file provided" }, 400);
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return c.json({ error: "File must be an image" }, 400);
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return c.json({ error: "File must be smaller than 5MB" }, 400);
		}

		// Generate unique file key
		const fileExtension = file.name.split(".").pop() || "jpg";
		const key = `${session.user.id}/${Date.now()}.${fileExtension}`;

		// Convert file to buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to R2
		const command = new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: file.type,
		});

		await s3Client.send(command);

		// Public URL for accessing the uploaded file
		const publicUrl = `${PUBLIC_URL}/${BUCKET_NAME}/${key}`;

		return c.json({
			publicUrl,
			key,
		});
	} catch (error) {
		console.error("Error uploading file:", error);
		return c.json({ error: "Failed to upload file" }, 500);
	}
});

export default upload;
