import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export const createClient = (connectionString: string): NeonHttpDatabase<typeof schema> => {
    const sql = neon(connectionString);
    return drizzle({ client: sql });
};

export * from "drizzle-orm";
export * as schema from './schema/';
export type { NeonHttpDatabase } from 'drizzle-orm/neon-http';