import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { createClient } from '@repo/db'
import { user } from '@repo/db/src/schema'
import { auth } from './utils/auth'

type Bindings = {
  POSTGRES_URL: string
}

const app = new Hono<{ Bindings: Bindings }>({ strict: false })

app.use("*", cors({
  origin: ['http://localhost:8081', 'exp://192.168.1.X:8081'], // Add your Expo development URLs
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}))

// app.use("*", jwt({ secret: 'dsadas'}))

app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.get('/', async (c) => {
  const db = createClient(c.env.POSTGRES_URL)
  const users = await db.select().from(user)
  console.log(users)
  return c.json({ message: 'Hello World', users })
})

app.get('/ping', (c) => {
  return c.json({ message: 'pong' })
})

export default app
