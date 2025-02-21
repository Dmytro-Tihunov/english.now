import type { MiddlewareHandler } from "hono";
import { createClient } from '@repo/db'
import { auth } from "../utils/auth";

export function init(): MiddlewareHandler {
  return async (c, next) => {
    c.set('db', createClient(c.env.POSTGRES_URL))
    c.set('auth', auth({ POSTGRES_URL: c.env.POSTGRES_URL, BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET }))
    await next()
  }
}