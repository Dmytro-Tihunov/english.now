import { Hono } from 'hono'
import { requestId } from 'hono/request-id'
import { logger } from "hono/logger";
import { cors } from 'hono/cors'
import { init, authMiddleware } from './middleware'
import course from './routes/course'
import type { Variables, Bindings } from './types'; 
import type { Auth } from './utils/auth';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>({ strict: false })

app.notFound((c) => { 
  return c.text('Custom 404 Message', 404)
})

/**
 * Middleware
 */
app.use("*", requestId())
app.use("*", logger())
app.use("*", init())
app.use("*", authMiddleware())
app.use("*", cors({
  origin: ['http://localhost:8081', 'exp://192.168.1.X:8081'], // Add your Expo development URLs
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}))

app.on(["POST", "GET"], "/api/auth/**", (c) => { 
  const auth: Auth = c.get('auth')
  return auth.handler(c.req.raw)
});

/**
 * Ping Pong
 */
app.get('/ping', (c) => {
  return c.json({ message: 'pong' })
})

/**
 * API Routes v1
 */
app.route('/v1/course', course)

export default app
