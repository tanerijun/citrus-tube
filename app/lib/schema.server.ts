import { relations, sql } from "drizzle-orm"
import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const user = sqliteTable(
	"user",
	{
		id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		username: text("username").unique().notNull(),
		email: text("email").unique().notNull(),
		password: text("password").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.default(sql`(unixepoch('now'))`)
			.notNull(),
		profileImageUrl: text("profile_image_url"),
		backgroundImageUrl: text("background_image_url"),
		description: text("description"),
	},
	(table) => {
		return {
			usernameIdx: index("idx_user_username").on(table.username),
			usernameEmail: index("idx_user_email").on(table.email),
		}
	},
)

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export const userFollowUser = sqliteTable(
	"user_follow_user",
	{
		follower: integer("follower")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		following: integer("following")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => {
		return {
			pk: primaryKey(table.follower, table.following),
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

export const videoRelations = relations(video, ({ one }) => ({
	owner: one(user, { fields: [video.userId], references: [user.id] }),
}))

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
			pk: primaryKey(table.userId, table.videoId),
			videoIdIdx: index("idx_user_like_video_video_id").on(table.videoId),
		}
	},
)

export const playlist = sqliteTable(
	"playlist",
	{
		id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		title: text("title").notNull(),
		desciption: text("description").notNull(),
		userId: integer("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.default(sql`(unixepoch('now'))`)
			.notNull(),
	},
	(table) => {
		return {
			userIdIdx: index("idx_playlist_user_id").on(table.userId),
		}
	},
)

export const playlistHasVideo = sqliteTable(
	"playlist_has_video",
	{
		playlistId: integer("playlist_id")
			.references(() => playlist.id, { onDelete: "cascade" })
			.notNull(),
		videoId: integer("video_id")
			.references(() => video.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => {
		return {
			pk: primaryKey(table.playlistId, table.videoId),
		}
	},
)

export const comment = sqliteTable(
	"comment",
	{
		id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		content: text("content").notNull(),
		userId: integer("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		videoId: integer("video_id")
			.references(() => video.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.default(sql`(unixepoch('now'))`)
			.notNull(),
	},
	(table) => {
		return {
			videoId: index("idx_comment_video_id").on(table.videoId),
		}
	},
)

export const post = sqliteTable(
	"post",
	{
		id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		content: text("content").notNull(),
		userId: integer("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.default(sql`(unixepoch('now'))`)
			.notNull(),
	},
	(table) => {
		return {
			userId: index("idx_post_user_id").on(table.userId),
		}
	},
)

export const userLikePost = sqliteTable(
	"user_like_post",
	{
		userId: integer("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		postId: integer("post_id")
			.references(() => post.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => {
		return {
			pk: primaryKey(table.userId, table.postId),
			postIdIdx: index("idx_user_like_post_post_id").on(table.postId),
		}
	},
)
