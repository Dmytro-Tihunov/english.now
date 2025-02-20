import type { MiddlewareHandler } from "hono";
import { createClient } from '@repo/db'
import { auth } from "../utils/auth";

export function init(): MiddlewareHandler {
  return async (c, next) => {
    // const auths = auth({ POSTGRES_URL: c.env.POSTGRES_URL })
    c.set('db', createClient(c.env.POSTGRES_URL))
    // c.set('auth', auths)
    await next()
  }
}