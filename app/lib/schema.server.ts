import { sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const user = sqliteTable("user", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch('now'))`),
	profileImageUrl: text("profile_image_url"),
	backgroundImageUrl: text("background_image_url"),
	description: text("description"),
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export const video = sqliteTable(
	"video",
	{
		id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		title: text("title").notNull(),
		description: text("description").notNull(),
		thumbnailUrl: text("thumbnail_url").notNull(),
		videoUrl: text("video_url").notNull(),
		userId: integer("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch('now'))`),
	},
	(table) => {
		return {
			userIdIdx: index("idx_video_user_id").on(table.userId),
		}
	},
)

export type Video = typeof video.$inferSelect
export type NewVideo = typeof video.$inferInsert
