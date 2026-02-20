import type { PgBoss } from "pg-boss";
import { registerGenerateConversationFeedbackWorker } from "./generate-conversation-feedback";
import { registerGenerateLearningPathWorker } from "./generate-learning-path";

export { enqueueGenerateConversationFeedback } from "./generate-conversation-feedback";
export { enqueueGenerateLearningPath } from "./generate-learning-path";

export async function registerAllWorkers(boss: PgBoss) {
	await registerGenerateLearningPathWorker(boss);
	await registerGenerateConversationFeedbackWorker(boss);
}
