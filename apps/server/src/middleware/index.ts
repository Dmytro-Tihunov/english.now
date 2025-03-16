import type { MiddlewareHandler } from "hono";
import type { Auth } from "../utils/auth";
import { createClient } from '@repo/db'
import { auth } from "../utils/auth";

function init(): MiddlewareHandler {
  return async (c, next) => {
    c.set('db', createClient(c.env.POSTGRES_URL))
    c.set('auth', auth({ 
      POSTGRES_URL: c.env.POSTGRES_URL, 
      BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
      APPLE_CLIENT_ID: c.env.APPLE_CLIENT_ID,
      APPLE_SECRET: c.env.APPLE_SECRET,
      GOOGLE_CLIENT_ID: c.env.GOOGLE_CLIENT_ID,
      GOOGLE_SECRET: c.env.GOOGLE_SECRET
    }))
    await next()
  }
}

function authMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const auth: Auth = c.get('auth')
    const session = await auth.api.getSession({ headers: c.req.raw.headers})
  	if (!session) {
    	c.set("user", null);
    	c.set("session", null);
    	return next();
  	}
  	c.set("user", session.user);
  	c.set("session", session.session);
  	return next();
  }
}

export { init, authMiddleware }