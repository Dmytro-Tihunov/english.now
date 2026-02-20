import type { PgBoss } from "pg-boss";
import { generateLearningPath } from "../services/generate-learning-path";

const QUEUE_NAME = "generate-learning-path";

export interface GenerateLearningPathJobData {
	userId: string;
}

export async function registerGenerateLearningPathWorker(boss: PgBoss) {
	await boss.createQueue(QUEUE_NAME, {
		retryLimit: 2,
		retryDelay: 10,
		retryBackoff: true,
		expireInSeconds: 5 * 60,
	});

	boss.work<GenerateLearningPathJobData>(
		QUEUE_NAME,
		{ localConcurrency: 2 },
		async (jobs) => {
			for (const job of jobs) {
				console.log(
					`[${QUEUE_NAME}] processing job ${job.id} for user ${job.data.userId}`,
				);

				const result = await generateLearningPath(job.data.userId);

				console.log(
					`[${QUEUE_NAME}] done — learningPathId=${result.learningPathId}`,
				);
			}
		},
	);
}

export async function enqueueGenerateLearningPath(
	boss: PgBoss,
	data: GenerateLearningPathJobData,
) {
	const jobId = await boss.send(QUEUE_NAME, data, {
		singletonKey: data.userId,
		retryLimit: 2,
		retryDelay: 10,
		expireInSeconds: 5 * 60,
	});

	console.log(`[${QUEUE_NAME}] enqueued job ${jobId} for user ${data.userId}`);
	return jobId;
}
