import { sql } from "drizzle-orm"
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

export const user = sqliteTable("user", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch('now'))`)
		.notNull(),
	profileImageUrl: text("profile_image_url"),
	backgroundImageUrl: text("background_image_url"),
	description: text("description"),
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export const userFollowUser = sqliteTable(
	"user_follow_user",
	{
		follower: integer("follower")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		following: integer("following")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => {
		return {
			followerIdx: index("idx_user_follow_user_follower").on(table.follower),
			followingIdx: index("idx_user_follow_user_following").on(table.following),
		}
	},
)

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
		createdAt: integer("created_at", { mode: "timestamp" })
			.default(sql`(unixepoch('now'))`)
			.notNull(),
	},
	(table) => {
		return {
			userIdIdx: index("idx_video_user_id").on(table.userId),
		}
	},
)

export type Video = typeof video.$inferSelect
export type NewVideo = typeof video.$inferInsert

export const videoView = sqliteTable("video_view", {
	id: integer("id")
		.primaryKey()
		.references(() => video.id, { onDelete: "cascade" }),
	count: integer("count").default(0).notNull(),
})

export const userLikeVideo = sqliteTable(
	"user_like_video",
	{
		userId: integer("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		videoId: integer("video_id")
			.references(() => video.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => {
		return {
			userIdVideoIdIdx: uniqueIndex("idx_user_like_video_user_id_video_id").on(
				table.userId,
				table.videoId,
			),
			videoIdIdx: index("idx_user_like_video_video_id").on(table.videoId),
		}
	},
)

export const playlist = sqliteTable("playlist", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	desciption: text("description").notNull(),
	userId: integer("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch('now'))`)
		.notNull(),
})

// Primary key should be playlist ID, just like video_view
export const playlistVideo = sqliteTable("playlist_video", {
	playlistId: integer("playlist_id")
		.primaryKey()
		.references(() => playlist.id, { onDelete: "cascade" }),
	videoId: integer("video_id")
		.references(() => video.id, { onDelete: "cascade" })
		.notNull(),
})
