import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL || "");

// Re-export drizzle-orm helpers
export { and, asc, desc, eq, or, sql } from "drizzle-orm";
// Export schemas
export * from "./schema/auth";
export * from "./schema/conversation";
