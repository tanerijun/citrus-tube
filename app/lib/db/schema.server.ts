import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	username: text("username").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }),
})
