import { NeonHttpDatabase } from "@repo/db";
import { schema } from "@repo/db";
import type { User, Session, Auth } from "./utils/auth";
import type { Ai } from "@cloudflare/workers-types";

export interface Env {
  POSTGRES_URL: string;
  BETTER_AUTH_SECRET: string;
  APPLE_CLIENT_ID: string;
  APPLE_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_SECRET: string;
}

export type Bindings = {
  POSTGRES_URL: string;
  BETTER_AUTH_SECRET: string;
  AI: Ai;
};

export type Variables = {
  db: NeonHttpDatabase<typeof schema>;
  auth: Auth;
  user: User | null;
  session: Session | null;
};
