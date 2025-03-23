import { NeonHttpDatabase } from "@repo/db";
import { schema } from "@repo/db";
import type { User, Session, Auth } from "./utils/auth";

export type Bindings = {
  POSTGRES_URL: string;
};

export type Variables = {
  db: NeonHttpDatabase<typeof schema>;
  auth: Auth;
  user: User | null;
  session: Session | null;
};
