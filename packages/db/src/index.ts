import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export const createClient = (connectionString: string) => {
    const sql = neon(connectionString);
    return drizzle({ client: sql});
};

export * as schema from './schema';