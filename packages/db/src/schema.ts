import { pgTable, text, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";

// ============= ENUMS =============
export const cefrLevelEnum = pgEnum("cefr_level", ["A1", "A2", "B1", "B2", "C1", "C2"]);
export const lessonTypeEnum = pgEnum("lesson_type", ["grammar", "vocabulary", "reading", "listening", "speaking", "writing"]);


// ============= USERS & AUTHENTICATION =============
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

// ============= CORE CONTENT STRUCTURE =============
export const course = pgTable("course", {
	id: text("id").primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	level: cefrLevelEnum('level').notNull(),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	metadata: jsonb('metadata')
});

export const module = pgTable("module", {
	id: text("id").primaryKey(),
	courseId: text('course_id').notNull().references(() => course.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});

export const lesson = pgTable("lesson", {
	id: text("id").primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	moduleId: text('module_id').notNull().references(() => module.id, { onDelete: 'cascade' })
});

export const exercise = pgTable("exercise", {
	id: text("id").primaryKey(),
	lessonId: text('lesson_id').notNull().references(() => lesson.id, { onDelete: 'cascade' }),
	type: lessonTypeEnum('type').notNull(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});