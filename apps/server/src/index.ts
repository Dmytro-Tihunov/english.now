import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { user } from '@repo/db/src/schema'
import { init } from './middleware'

type Bindings = {
  POSTGRES_URL: string
}

type Varibles = {
  db: any
}

const app = new Hono<{ Bindings: Bindings }>({ strict: false })

app.use("*", init())
app.use("*", cors({
  origin: ['http://localhost:8081', 'exp://192.168.1.X:8081'], // Add your Expo development URLs
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}))

app.notFound((c) => { 
  return c.text('Custom 404 Message', 404)
})

app.on(["POST", "GET"], "/api/auth/**", (c) => { 
  const auth = c.get('auth')
  return auth.handler(c.req.raw)
});

app.get('/', async (c) => {
  const db = c.get('db')
  const users = await db.select().from(user)
  console.log(users)
  return c.json({  users })
})

app.get('/ping', (c) => {
  return c.json({ message: 'pong' })
})

export default app
