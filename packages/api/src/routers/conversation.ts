import { conversationMessage, conversationSession, db } from "@english.now/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

// Scenario definitions for conversation practice
const SCENARIOS = {
    "job-interview": {
        name: "Job Interview",
        description: "Practice common job interview questions and answers",
        systemPrompt: (
            level: string,
        ) => `You are a friendly HR manager conducting a job interview. 
The candidate is learning English at a ${level} level.
- Keep your questions appropriate for their level
- Be encouraging and supportive
- After they respond, provide helpful corrections for any grammar or vocabulary mistakes
- Ask follow-up questions to keep the conversation flowing
- Focus on common interview topics: experience, skills, strengths, career goals`,
        goals: [
            "Practice answering common interview questions",
            "Learn professional vocabulary",
            "Build confidence in formal settings",
        ],
    },
    "restaurant-order": {
        name: "Restaurant Ordering",
        description: "Practice ordering food and interacting with waitstaff",
        systemPrompt: (
            level: string,
        ) => `You are a friendly waiter at a nice restaurant.
The customer is learning English at a ${level} level.
- Greet them warmly and offer help with the menu
- Be patient and helpful with their order
- After they speak, gently correct any mistakes
- Use natural restaurant language and phrases
- Ask clarifying questions about their preferences`,
        goals: [
            "Learn restaurant vocabulary",
            "Practice polite requests",
            "Understand menu descriptions",
        ],
    },
    "travel-directions": {
        name: "Asking for Directions",
        description: "Practice asking and understanding directions",
        systemPrompt: (
            level: string,
        ) => `You are a helpful local person on the street.
The tourist is learning English at a ${level} level.
- They're looking for directions to various places
- Give clear, simple directions appropriate for their level
- Correct their English mistakes gently
- Use common directional phrases and landmarks
- Be friendly and patient`,
        goals: [
            "Learn directional vocabulary",
            "Practice asking questions politely",
            "Understand location descriptions",
        ],
    },
    "small-talk": {
        name: "Casual Small Talk",
        description: "Practice everyday casual conversation",
        systemPrompt: (
            level: string,
        ) => `You are a friendly person making casual conversation.
The person you're talking to is learning English at a ${level} level.
- Keep the conversation natural and friendly
- Discuss topics like weather, hobbies, weekend plans, etc.
- Correct any mistakes in a supportive way
- Ask open-ended questions to keep the conversation going
- Use common idioms and expressions appropriate for their level`,
        goals: [
            "Build conversational fluency",
            "Learn common expressions",
            "Practice natural dialogue flow",
        ],
    },
    "doctor-visit": {
        name: "Doctor's Appointment",
        description:
            "Practice describing symptoms and understanding medical advice",
        systemPrompt: (level: string) => `You are a friendly and patient doctor.
Your patient is learning English at a ${level} level.
- Ask about their symptoms and health concerns
- Use clear, simple medical vocabulary
- Correct their English gently when they make mistakes
- Give advice in easy-to-understand language
- Be empathetic and reassuring`,
        goals: [
            "Learn medical vocabulary",
            "Practice describing physical sensations",
            "Understand health advice",
        ],
    },
    shopping: {
        name: "Shopping Experience",
        description: "Practice shopping conversations in stores",
        systemPrompt: (level: string) => `You are a helpful store assistant.
The customer is learning English at a ${level} level.
- Help them find what they're looking for
- Discuss sizes, colors, prices
- Correct their English in a friendly way
- Use common shopping phrases
- Handle requests for exchanges or returns`,
        goals: [
            "Learn shopping vocabulary",
            "Practice making requests",
            "Understand prices and descriptions",
        ],
    },
} as const;

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const conversationRouter = router({
    // Get available scenarios
    getScenarios: protectedProcedure.query(() => {
        return Object.entries(SCENARIOS).map(([id, scenario]) => ({
            id,
            name: scenario.name,
            description: scenario.description,
            goals: scenario.goals,
        }));
    }),

    // Start a new conversation session
    start: protectedProcedure
        .input(
            z.object({
                scenario: z.enum([
                    "job-interview",
                    "restaurant-order",
                    "travel-directions",
                    "small-talk",
                    "doctor-visit",
                    "shopping",
                ]),
                level: z.enum(LEVELS),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const scenarioConfig = SCENARIOS[input.scenario];

            const sessionId = crypto.randomUUID();

            const newSession = {
                id: sessionId,
                userId: ctx.session.user.id,
                scenario: input.scenario,
                level: input.level,
                context: {
                    systemPrompt: scenarioConfig.systemPrompt(input.level),
                    scenarioDescription: scenarioConfig.description,
                    goals: scenarioConfig.goals,
                },
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await db.insert(conversationSession).values(newSession);

            // Generate initial AI greeting based on scenario
            const greeting = getInitialGreeting(input.scenario, input.level);

            // Save the initial message
            const messageId = crypto.randomUUID();
            await db.insert(conversationMessage).values({
                id: messageId,
                sessionId,
                role: "assistant",
                content: greeting,
                createdAt: new Date(),
            });

            return {
                sessionId,
                scenario: {
                    id: input.scenario,
                    name: scenarioConfig.name,
                    description: scenarioConfig.description,
                    goals: scenarioConfig.goals,
                },
                level: input.level,
                initialMessage: {
                    id: messageId,
                    role: "assistant" as const,
                    content: greeting,
                },
            };
        }),

    // Get session details with messages
    getSession: protectedProcedure
        .input(z.object({ sessionId: z.string() }))
        .query(async ({ ctx, input }) => {
            const session = await db
                .select()
                .from(conversationSession)
                .where(eq(conversationSession.id, input.sessionId))
                .limit(1);

            if (!session[0] || session[0].userId !== ctx.session.user.id) {
                throw new Error("Session not found");
            }

            const messages = await db
                .select()
                .from(conversationMessage)
                .where(eq(conversationMessage.sessionId, input.sessionId))
                .orderBy(conversationMessage.createdAt);

            return {
                session: session[0],
                messages,
            };
        }),

    // Get user's conversation history
    getSessions: protectedProcedure
        .input(
            z
                .object({
                    limit: z.number().min(1).max(50).default(10),
                    offset: z.number().min(0).default(0),
                })
                .optional(),
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 10;
            const offset = input?.offset ?? 0;

            const sessions = await db
                .select()
                .from(conversationSession)
                .where(eq(conversationSession.userId, ctx.session.user.id))
                .orderBy(desc(conversationSession.createdAt))
                .limit(limit)
                .offset(offset);

            return sessions.map((s) => ({
                ...s,
                scenarioName:
                    SCENARIOS[s.scenario as keyof typeof SCENARIOS]?.name ?? s.scenario,
            }));
        }),

    // Send a text message (non-streaming, for tRPC)
    sendMessage: protectedProcedure
        .input(
            z.object({
                sessionId: z.string(),
                content: z.string().min(1).max(2000),
                inputType: z.enum(["text", "voice"]).default("text"),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Verify session belongs to user
            const session = await db
                .select()
                .from(conversationSession)
                .where(eq(conversationSession.id, input.sessionId))
                .limit(1);

            if (!session[0] || session[0].userId !== ctx.session.user.id) {
                throw new Error("Session not found");
            }

            // Save user message
            const userMessageId = crypto.randomUUID();
            await db.insert(conversationMessage).values({
                id: userMessageId,
                sessionId: input.sessionId,
                role: "user",
                content: input.content,
                metadata: { transcribedFrom: input.inputType },
                createdAt: new Date(),
            });

            // Get conversation history for context
            const _history = await db
                .select()
                .from(conversationMessage)
                .where(eq(conversationMessage.sessionId, input.sessionId))
                .orderBy(conversationMessage.createdAt);

            // This returns a placeholder - actual AI response will be streamed via REST endpoint
            return {
                userMessageId,
                sessionId: input.sessionId,
                // Client should call /api/conversation/stream for the AI response
            };
        }),

    // End a conversation session
    endSession: protectedProcedure
        .input(z.object({ sessionId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const session = await db
                .select()
                .from(conversationSession)
                .where(eq(conversationSession.id, input.sessionId))
                .limit(1);

            if (!session[0] || session[0].userId !== ctx.session.user.id) {
                throw new Error("Session not found");
            }

            await db
                .update(conversationSession)
                .set({ status: "completed", updatedAt: new Date() })
                .where(eq(conversationSession.id, input.sessionId));

            return { success: true };
        }),
});

// Helper function to generate initial greeting based on scenario
function getInitialGreeting(scenario: string, level: string): string {
    const greetings: Record<string, Record<string, string>> = {
        "job-interview": {
            beginner:
                "Hello! Welcome to our company. Please sit down. I'm going to ask you some easy questions today. Are you ready?",
            intermediate:
                "Good morning! Thank you for coming in today. I'm Sarah, the HR manager. I'll be conducting your interview. How are you feeling today?",
            advanced:
                "Good morning and welcome. I'm Sarah Chen, Head of Human Resources. Thank you for taking the time to interview with us. Before we dive into the specifics of your experience, could you tell me a bit about what drew you to this position?",
        },
        "restaurant-order": {
            beginner:
                "Hello! Welcome to our restaurant. Here is the menu. What would you like to eat today?",
            intermediate:
                "Good evening! Welcome to The Garden Bistro. My name is Alex, and I'll be your server tonight. Can I start you off with something to drink while you look at the menu?",
            advanced:
                "Good evening and welcome to The Garden Bistro. I'm Alex, and I'll be taking care of you this evening. Before I tell you about our specials, may I offer you something from our wine list or perhaps a craft cocktail to start?",
        },
        "travel-directions": {
            beginner:
                "Hello! You look lost. Can I help you? Where do you want to go?",
            intermediate:
                "Hi there! You seem like you're looking for something. I'm a local - can I help you find your way somewhere?",
            advanced:
                "Excuse me, I couldn't help but notice you checking your phone with that puzzled expression. I've lived in this neighborhood for years - perhaps I could help you find what you're looking for?",
        },
        "small-talk": {
            beginner: "Hi! Nice weather today. Do you live near here?",
            intermediate:
                "Hey there! Beautiful day, isn't it? I don't think I've seen you around here before. Are you new to the neighborhood?",
            advanced:
                "What a gorgeous afternoon! This is my favorite time of year when the weather finally starts to warm up. Have you been enjoying the spring weather? I noticed you were admiring the cherry blossoms.",
        },
        "doctor-visit": {
            beginner:
                "Hello! I'm Doctor Smith. Please sit down. How do you feel today? What is the problem?",
            intermediate:
                "Good morning! I'm Dr. Smith. Thank you for coming in today. So, what brings you to see me? Tell me about what's been bothering you.",
            advanced:
                "Good morning, I'm Dr. Elizabeth Smith. I've reviewed your file, but I'd like to hear from you directly. What concerns have brought you in today, and how long have you been experiencing these symptoms?",
        },
        shopping: {
            beginner: "Hello! Welcome to our store. Can I help you find something?",
            intermediate:
                "Hi there! Welcome to StyleMart. I'm Jamie. Is there anything specific you're looking for today, or would you like me to show you around?",
            advanced:
                "Good afternoon and welcome to StyleMart! I'm Jamie, a personal stylist here. I noticed you looking at our new collection. Are you shopping for a particular occasion, or would you like me to put together some options based on your style?",
        },
    };

    return greetings[scenario]?.[level] ?? "Hello! How can I help you today?";
}
