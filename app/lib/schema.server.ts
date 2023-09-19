import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const user = sqliteTable("user", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	username: text("username").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch('now'))`),
	profileImageUrl: text("profile_image_url"),
	backgroundImageUrl: text("background_image_url"),
	description: text("description"),
})

// export const video = sqliteTable("video", {
// 	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
// 	title: text("title"),
// 	description: text("description"),
// 	thumbnail: text("thumbnail")
// })

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
