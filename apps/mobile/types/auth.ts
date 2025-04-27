import { authClient } from "../lib/auth-client";

type BaseSession = typeof authClient.$Infer.Session;
type BaseUser = BaseSession["user"];

export interface User extends BaseUser {
  isOnboarded: boolean;
}

export interface Session extends Omit<BaseSession, "user"> {
  user: User;
}
