import { NeonHttpDatabase } from "@repo/db"
import { schema } from "@repo/db";
import type{ User, Session } from './utils/auth';

export type Bindings = {
    POSTGRES_URL: string
}

export type Variables = { 
    db: NeonHttpDatabase<typeof schema>,
    auth: any,
    user: User | null,
    session: Session | null
}

