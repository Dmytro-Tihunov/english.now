import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@english.now/env/server";

const s3Client = new S3Client({
	region: "auto",
	endpoint: env.R2_ENDPOINT,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

export default s3Client;
